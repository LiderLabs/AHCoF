from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

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
    assert body["expiresIn"] == 1800

def test_register_duplicate_phone_fails():
    response = client.post("/api/v1/auth/register", json=NEW_MEMBER)
    assert response.status_code == 409
    assert response.json()["error"] == "USER_ALREADY_EXISTS"