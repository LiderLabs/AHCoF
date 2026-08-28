from fastapi import APIRouter, Depends
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import (
    AccountInactiveError,
    InvalidCredentialsError,
)
from app.core.security import create_access_token, verify_password
from app.modules.auth.dependencies import get_current_member
from app.modules.members.model import Member
from app.modules.members.schema import CurrentMemberResponse, LoginRequest, MemberCreate, TokenResponse

from app.modules.members.service import create_member

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
    member = db.scalar(
    select(Member).where(
        Member.phone_number == payload.phone_number
        )
    )

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
        access_token=token,
        token_type="bearer",
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
)
def register(
    payload: MemberCreate,
    db: Session = Depends(get_db),
) -> TokenResponse:
    member = create_member(db, payload)

    token = create_access_token(
        subject=str(member.id),
        secret_key=settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
        expires_minutes=settings.access_token_expire_minutes,
    )

    return TokenResponse(access_token=token, token_type="bearer")