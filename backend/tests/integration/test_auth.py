"""
Tests for the authentication flow.

Covers logging in with either identifier type the demo member has on file
(phone number and email), and confirming the resulting token works against
the protected /auth/me endpoint.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

DEMO_PASSWORD = "demo-password"
DEMO_PHONE_NUMBER = "0241234567"
DEMO_EMAIL = "elder.mensah@example.com"
DEMO_MEMBERSHIP_ID = "AHCOF-000123"


def test_login_with_phone_number_identifier_succeeds() -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"identifier": DEMO_PHONE_NUMBER, "password": DEMO_PASSWORD},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["tokenType"] == "bearer"
    assert isinstance(body["accessToken"], str) and body["accessToken"]


def test_login_with_email_identifier_succeeds() -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"identifier": DEMO_EMAIL, "password": DEMO_PASSWORD},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["tokenType"] == "bearer"
    assert isinstance(body["accessToken"], str) and body["accessToken"]


def test_me_returns_current_member_after_login() -> None:
    login_response = client.post(
        "/api/v1/auth/login",
        json={"identifier": DEMO_EMAIL, "password": DEMO_PASSWORD},
    )
    token = login_response.json()["accessToken"]

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json()["membershipId"] == DEMO_MEMBERSHIP_ID


def test_me_without_token_is_unauthorized() -> None:
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 401