from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app

client = TestClient(app)

NEW_MEMBER = {
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "0209999999",
    "emailAddress": "test.user@example.com",
    "password": "securepassword123",
}

def test_register_new_member_succeeds():
    response = client.post("/api/v1/auth/register", json=NEW_MEMBER)
    assert response.status_code == 201
    body = response.json()
    assert body["tokenType"] == "bearer"
    assert isinstance(body["accessToken"], str) and body["accessToken"]
    assert body["member"] is not None
    assert body["member"]["firstName"] == "Test"
    assert body["member"]["phoneNumber"] == "0209999999"
    assert body["expiresIn"] == settings.access_token_expire_minutes * 60

def test_register_duplicate_phone_fails():
    client.post("/api/v1/auth/register", json=NEW_MEMBER)
    response = client.post("/api/v1/auth/register", json=NEW_MEMBER)
    assert response.status_code == 409
    assert response.json()["error"] == "USER_ALREADY_EXISTS"



def test_register_two_members_without_email_does_not_conflict():
    """Regression test: Member.email_address == None compiles to
    'email_address IS NULL' in SQLAlchemy, so the duplicate check must not
    include that condition at all when email_address is omitted — otherwise
    the first member with no email on file blocks every later signup that
    also skips email, regardless of phone number.
    """
    first_response = client.post(
        "/api/v1/auth/register",
        json={
            "firstName": "No",
            "lastName": "Email",
            "phoneNumber": "0501111111",
            "password": "securepassword123",
        },
    )
    assert first_response.status_code == 201

    second_response = client.post(
        "/api/v1/auth/register",
        json={
            "firstName": "Also",
            "lastName": "NoEmail",
            "phoneNumber": "0502222222",
            "password": "securepassword123",
        },
    )
    assert second_response.status_code == 201


def test_register_duplicate_email_fails():
    client.post("/api/v1/auth/register", json=NEW_MEMBER)
    response = client.post(
        "/api/v1/auth/register",
        json={
            "firstName": "Different",
            "lastName": "Phone",
            "phoneNumber": "0503333333",
            "emailAddress": NEW_MEMBER["emailAddress"],
            "password": "securepassword123",
        },
    )
    assert response.status_code == 409
    assert response.json()["error"] == "USER_ALREADY_EXISTS"