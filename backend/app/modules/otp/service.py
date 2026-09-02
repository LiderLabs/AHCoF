import secrets
from datetime import datetime, timedelta, timezone

from app.core.config import settings
from app.core.exceptions import InvalidOtpError, OtpExpiredError
from app.core.security import hash_password, verify_password
from app.modules.members.model import Member
from app.modules.otp.model import OtpCode
from sqlalchemy import select
from sqlalchemy.orm import Session


def generate_otp_code(length: int | None = None) -> str:
    """Cryptographically random numeric code, zero-padded so leading zeros
    aren't dropped (e.g. length=6 can produce "003920")."""
    length = length or settings.otp_length
    upper_bound = 10**length
    return str(secrets.randbelow(upper_bound)).zfill(length)


def create_otp(db: Session, member: Member, purpose: str) -> str:
    """Generates a code, stores its hash, and returns the plaintext code so
    the caller can send it. The plaintext is never persisted."""
    code = generate_otp_code()
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.otp_expire_minutes
    )

    otp = OtpCode(
        member_id=member.id,
        purpose=purpose,
        code_hash=hash_password(code),
        expires_at=expires_at,
    )

    db.add(otp)
    db.commit()

    return code


def verify_otp(db: Session, member: Member, code: str, purpose: str) -> None:
    """Raises InvalidOtpError or OtpExpiredError, or marks the OTP consumed
    on success. Always checks the most recent unconsumed code for this
    member+purpose — an older, still-technically-valid code from before a
    resend is not accepted once a newer one has been issued."""
    otp = db.scalar(
        select(OtpCode)
        .where(
            OtpCode.member_id == member.id,
            OtpCode.purpose == purpose,
            OtpCode.consumed_at.is_(None),
        )
        .order_by(OtpCode.created_at.desc())
    )

    if otp is None:
        raise InvalidOtpError()

    if otp.expires_at < datetime.now(timezone.utc):
        raise OtpExpiredError()

    if not verify_password(code, otp.code_hash):
        otp.attempt_count += 1
        db.commit()
        raise InvalidOtpError()

    otp.consumed_at = datetime.now(timezone.utc)
    db.commit()