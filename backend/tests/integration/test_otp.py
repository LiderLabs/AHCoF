"""
Tests for OTP-backed flows: signup verification and forgot/reset password.

Since the plaintext OTP code is deliberately never returned by the API (only
its hash is stored — see otp/service.py), these tests patch
`send_otp_to_member` at the point auth/router.py imports it, to capture the
real code that would have been sent, the same way a human tester would read
it off their phone/email in demo mode instead.
"""

from unittest.mock import patch

from app.core.config import settings
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def _register(phone_number: str, email_address: str | None = None) -> tuple[dict, str]:
    """Registers a member, capturing the OTP code that was sent. Returns
    (response_json, code)."""
    payload = {
        "firstName": "Otp",
        "lastName": "Tester",
        "phoneNumber": phone_number,
        "password": "securepassword123",
    }
    if email_address is not None:
        payload["emailAddress"] = email_address

    captured: list[str] = []

    def _capture(member, code):
        captured.append(code)

    with patch("app.modules.auth.router.send_otp_to_member", side_effect=_capture):
        response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 201
    assert len(captured) == 1
    return response.json(), captured[0]


def test_register_sends_otp_and_member_starts_unverified() -> None:
    body, code = _register("0301111111", "otp.tester1@example.com")

    assert body["member"]["isVerified"] is False
    assert isinstance(code, str) and len(code) == settings.otp_length


def test_verify_signup_otp_succeeds_and_flips_is_verified() -> None:
    body, code = _register("0301111112", "otp.tester2@example.com")
    phone_number = body["member"]["phoneNumber"]

    verify_response = client.post(
        "/api/v1/auth/verify-signup-otp",
        json={"identifier": phone_number, "code": code},
    )
    assert verify_response.status_code == 200

    login_response = client.post(
        "/api/v1/auth/login",
        json={"identifier": phone_number, "password": "securepassword123"},
    )
    assert login_response.json()["member"]["isVerified"] is True


def test_verify_signup_otp_wrong_code_fails() -> None:
    body, _correct_code = _register("0301111113", "otp.tester3@example.com")
    phone_number = body["member"]["phoneNumber"]

    response = client.post(
        "/api/v1/auth/verify-signup-otp",
        json={"identifier": phone_number, "code": "000000"},
    )
    assert response.status_code == 400
    assert response.json()["error"] == "INVALID_OTP"


def test_verify_signup_otp_expired_code_fails() -> None:
    original_expiry = settings.otp_expire_minutes
    settings.otp_expire_minutes = -1  # already expired the moment it's created
    try:
        body, code = _register("0301111114", "otp.tester4@example.com")
    finally:
        settings.otp_expire_minutes = original_expiry

    phone_number = body["member"]["phoneNumber"]

    response = client.post(
        "/api/v1/auth/verify-signup-otp",
        json={"identifier": phone_number, "code": code},
    )
    assert response.status_code == 400
    assert response.json()["error"] == "OTP_EXPIRED"


def test_forgot_password_returns_same_message_regardless_of_match() -> None:
    body, _code = _register("0301111115", "otp.tester5@example.com")
    phone_number = body["member"]["phoneNumber"]

    with patch("app.modules.auth.router.send_otp_to_member"):
        real_member_response = client.post(
            "/api/v1/auth/forgot-password",
            json={"identifier": phone_number},
        )
        unknown_identifier_response = client.post(
            "/api/v1/auth/forgot-password",
            json={"identifier": "0309999999"},
        )

    assert real_member_response.status_code == 200
    assert unknown_identifier_response.status_code == 200
    assert real_member_response.json() == unknown_identifier_response.json()


def test_forgot_password_reset_password_flow() -> None:
    body, _signup_code = _register("0301111116", "otp.tester6@example.com")
    phone_number = body["member"]["phoneNumber"]

    captured: list[str] = []

    def _capture(member, code):
        captured.append(code)

    with patch("app.modules.auth.router.send_otp_to_member", side_effect=_capture):
        forgot_response = client.post(
            "/api/v1/auth/forgot-password",
            json={"identifier": phone_number},
        )

    assert forgot_response.status_code == 200
    assert len(captured) == 1
    reset_code = captured[0]

    reset_response = client.post(
        "/api/v1/auth/reset-password",
        json={
            "identifier": phone_number,
            "code": reset_code,
            "newPassword": "brandnewpassword456",
        },
    )
    assert reset_response.status_code == 200

    old_password_login = client.post(
        "/api/v1/auth/login",
        json={"identifier": phone_number, "password": "securepassword123"},
    )
    assert old_password_login.status_code == 401

    new_password_login = client.post(
        "/api/v1/auth/login",
        json={"identifier": phone_number, "password": "brandnewpassword456"},
    )
    assert new_password_login.status_code == 200


def test_reset_password_with_unknown_identifier_returns_invalid_otp() -> None:
    response = client.post(
        "/api/v1/auth/reset-password",
        json={
            "identifier": "0309999998",
            "code": "000000",
            "newPassword": "brandnewpassword456",
        },
    )
    assert response.status_code == 400
    assert response.json()["error"] == "INVALID_OTP"