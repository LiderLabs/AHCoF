import secrets
from datetime import datetime, timedelta, timezone

import redis
from app.core.config import settings
from app.core.exceptions import InvalidOtpError, OtpExpiredError, OtpRateLimitedError
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

def enforce_otp_rate_limit(redis_client: redis.Redis, identifier: str, purpose: str) -> None:
    """Blocks OTP generation if this identifier+purpose is on cooldown or has
    hit the hourly cap. Keyed on the raw identifier and checked unconditionally
    — before we know whether it belongs to a real member — so a 429 here can't
    be used to tell a real identifier apart from a fake one. Protects SMS/email
    credit from being drained by repeated requests; a frontend cooldown timer
    alone does nothing against someone calling the API directly."""
    cooldown_key = f"otp:cooldown:{purpose}:{identifier}"
    hourly_key = f"otp:hourly:{purpose}:{identifier}"

    if redis_client.exists(cooldown_key):
        retry_after = redis_client.ttl(cooldown_key)
        raise OtpRateLimitedError(
            message=f"Please wait {retry_after} seconds before requesting another code.",
            details={"retry_after_seconds": retry_after},
        )

    request_count = redis_client.incr(hourly_key)
    if request_count == 1:
        redis_client.expire(hourly_key, 3600)

    if request_count > settings.otp_max_requests_per_hour:
        retry_after = redis_client.ttl(hourly_key)
        raise OtpRateLimitedError(
            message="Too many OTP requests this hour. Please try again later.",
            details={"retry_after_seconds": retry_after},
        )

    redis_client.set(cooldown_key, "1", ex=settings.otp_resend_cooldown_seconds)