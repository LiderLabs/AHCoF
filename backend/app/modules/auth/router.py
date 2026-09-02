from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import (
    AccountInactiveError,
    InvalidCredentialsError,
    InvalidOtpError,
    MemberNotFoundError,
)
from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth.dependencies import get_current_member
from app.modules.members.model import Member
from app.modules.members.schema import (
    CurrentMemberResponse,
    LoginRequest,
    MemberCreate,
    MemberResponse,
    TokenResponse,
)
from app.modules.members.service import create_member, get_member_by_identifier
from app.modules.otp.model import OtpPurpose
from app.modules.otp.schema import (
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    SendOtpResponse,
    VerifyOtpResponse,
    VerifySignupOtpRequest,
)
from app.modules.otp.senders import channels_for_member, send_otp_to_member
from app.modules.otp.service import create_otp, verify_otp

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
    response_model_by_alias=True,
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    member = get_member_by_identifier(db, payload.identifier)

    if (
        member is None
        or member.password_hash is None
        or not verify_password(payload.password, member.password_hash)
    ):
        raise InvalidCredentialsError()

    if not member.is_active:
        raise AccountInactiveError()

    token = create_access_token(
        subject=str(member.id),
        secret_key=settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
        expires_minutes=settings.access_token_expire_minutes,
    )

    return TokenResponse(
        member=MemberResponse.model_validate(member, from_attributes=True),
        access_token=token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.get(
    "/me",
    response_model=CurrentMemberResponse,
    response_model_by_alias=True,
)
def get_me(
    current_member: Member = Depends(get_current_member),
) -> Member:
    return current_member


@router.post(
    "/register",
    response_model=TokenResponse,
    response_model_by_alias=True,
    status_code=201,
    summary="Register a new member",
    description=(
        "Creates the member and immediately sends a signup-verification OTP "
        "to their phone (and email, if provided). The member can log in "
        "right away — `isVerified` starts false and is set true by "
        "POST /auth/verify-signup-otp. Verification does not gate login."
    ),
)
def register(
    payload: MemberCreate,
    db: Session = Depends(get_db),
) -> TokenResponse:
    member = create_member(db, payload)

    code = create_otp(db, member, OtpPurpose.SIGNUP_VERIFICATION)
    send_otp_to_member(member, code)

    token = create_access_token(
        subject=str(member.id),
        secret_key=settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
        expires_minutes=settings.access_token_expire_minutes,
    )

    return TokenResponse(
        member=MemberResponse.model_validate(member, from_attributes=True),
        access_token=token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post(
    "/verify-signup-otp",
    response_model=VerifyOtpResponse,
    response_model_by_alias=True,
    summary="Verify the OTP sent at registration",
)
def verify_signup_otp(
    payload: VerifySignupOtpRequest,
    db: Session = Depends(get_db),
) -> VerifyOtpResponse:
    member = get_member_by_identifier(db, payload.identifier)

    if member is None:
        raise MemberNotFoundError()

    verify_otp(db, member, payload.code, OtpPurpose.SIGNUP_VERIFICATION)

    member.is_verified = True
    db.commit()

    return VerifyOtpResponse(
        channel=payload.channel,
        verified=True,
        message="Member verified successfully.",
    )


@router.post(
    "/forgot-password",
    response_model=SendOtpResponse,
    response_model_by_alias=True,
    summary="Request a password-reset OTP",
    description=(
        "Sends a reset OTP to whichever contact channels the member has on "
        "file (SMS always, plus email if one is registered). Always returns "
        "the same generic message and a channelsSent list whether or not the "
        "identifier matches a member — an unrecognized identifier reports "
        "channelsSent: ['phone'], identical to what a real member with no "
        "email on file would see, so this endpoint can't be used to check "
        "which phone numbers or emails are registered."
    ),
)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
) -> SendOtpResponse:
    member = get_member_by_identifier(db, payload.identifier)

    if member is not None:
        code = create_otp(db, member, OtpPurpose.PASSWORD_RESET)
        send_otp_to_member(member, code)
        channels_sent = channels_for_member(member)
    else:
        channels_sent = ["phone"]

    return SendOtpResponse(
        channels_sent=channels_sent,
        message="If that phone number or email is registered, a reset code has been sent.",
    )


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    response_model_by_alias=True,
    summary="Reset password using the OTP from /auth/forgot-password",
)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
) -> MessageResponse:
    member = get_member_by_identifier(db, payload.identifier)

    if member is None:
        raise InvalidOtpError()

    verify_otp(db, member, payload.code, OtpPurpose.PASSWORD_RESET)

    member.password_hash = hash_password(payload.new_password)
    db.commit()

    return MessageResponse(message="Password reset successfully.")