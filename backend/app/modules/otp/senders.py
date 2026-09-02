import logging

import httpx

from app.core.config import settings
from app.modules.members.model import Member

logger = logging.getLogger(__name__)

ARKESEL_SEND_URL = "https://sms.arkesel.com/api/v2/sms/send"
RESEND_SEND_URL = "https://api.resend.com/emails"

# Deliberately NOT using Arkesel's own /otp/send + /otp/verify endpoints,
# even though they exist. Those generate and verify the code entirely on
# Arkesel's side, tied to a phone number. We also need to deliver the same
# code by email via Resend for members with both channels on file, and
# Resend has no equivalent OTP product — Arkesel generating its own code
# would mean two different codes for one verification action. Generating
# the code ourselves once (see otp/service.py) and using each provider as a
# plain delivery channel keeps one code, one verification path, regardless
# of which channel(s) a member has.


def send_sms(phone_number: str, message: str) -> None:
    if settings.demo_mode or not settings.arkesel_api_key:
        logger.info("[DEMO MODE] SMS to %s: %s", phone_number, message)
        return

    response = httpx.post(
        ARKESEL_SEND_URL,
        headers={
            "api-key": settings.arkesel_api_key,
            "Content-Type": "application/json",
        },
        json={
            "sender": settings.arkesel_sender_id,
            "message": message,
            "recipients": [phone_number],
        },
        timeout=10.0,
    )
    response.raise_for_status()


def send_email(to_email: str, subject: str, html: str) -> None:
    if settings.demo_mode or not settings.resend_api_key:
        logger.info("[DEMO MODE] Email to %s (%s): %s", to_email, subject, html)
        return

    response = httpx.post(
        RESEND_SEND_URL,
        headers={
            "Authorization": f"Bearer {settings.resend_api_key}",
            "Content-Type": "application/json",
        },
        json={
            "from": settings.resend_from_email,
            "to": [to_email],
            "subject": subject,
            "html": html,
        },
        timeout=10.0,
    )
    response.raise_for_status()

def channels_for_member(member: Member) -> list[str]:
    """Which channels send_otp_to_member will actually deliver to for this
    member. Phone is always included — every member has one on file.
    Email is included only if one is registered."""
    channels = ["phone"]
    if member.email_address:
        channels.append("email")
    return channels

def send_otp_to_member(member: Member, code: str) -> None:
    """Phone number is required on every member, so SMS always goes out.
    Email only goes out if the member has one on file — this naturally
    covers 'send to both if both are on file, SMS only if that's all
    there is' without any branching on what was provided at registration
    time versus what's actually stored now."""
    message = (
        f"Your AHCoF verification code is {code}. "
        f"It expires in {settings.otp_expire_minutes} minutes."
    )
    send_sms(member.phone_number, message)

    if member.email_address:
        send_email(
            to_email=member.email_address,
            subject="Your AHCoF verification code",
            html=(
                f"<p>Your AHCoF verification code is <strong>{code}</strong>.</p>"
                f"<p>It expires in {settings.otp_expire_minutes} minutes.</p>"
            ),
        )