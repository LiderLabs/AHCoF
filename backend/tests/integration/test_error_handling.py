"""
Tests for the global error-handling layer wired up in app.main.

These check the *shape* of error responses, not business logic: every error
returned by the API — validation failures, not-found, unknown routes — should
come back as {error, message, status_code, details} rather than FastAPI's
default {"detail": ...}.
"""

import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _assert_error_shape(payload: dict, expected_status: int) -> None:
    assert set(payload.keys()) >= {"error", "message", "status_code"}
    assert payload["status_code"] == expected_status
    assert isinstance(payload["error"], str) and payload["error"]
    assert isinstance(payload["message"], str) and payload["message"]


def test_member_not_found_returns_standard_error_shape() -> None:
    random_id = uuid.uuid4()

    response = client.get(f"/api/v1/members/{random_id}")

    assert response.status_code == 404
    body = response.json()
    _assert_error_shape(body, 404)
    assert body["error"] == "MEMBER_NOT_FOUND"


def test_invalid_login_payload_returns_validation_error_shape() -> None:
    # Missing the required "password" field entirely.
    response = client.post("/api/v1/auth/login", json={"phoneNumber": "0000000000"})

    assert response.status_code == 422
    body = response.json()
    _assert_error_shape(body, 422)
    assert body["error"] == "VALIDATION_ERROR"
    assert "fields" in body["details"]
    assert any(f["field"] == "password" for f in body["details"]["fields"])


def test_unknown_route_returns_standard_error_shape() -> None:
    response = client.get("/api/v1/this-route-does-not-exist")

    assert response.status_code == 404
    body = response.json()
    _assert_error_shape(body, 404)
    assert body["error"] == "NOT_FOUND"


def test_wrong_login_credentials_returns_standard_error_shape() -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"phoneNumber": "0000000000", "password": "definitely-wrong"},
    )

    assert response.status_code == 401
    body = response.json()
    _assert_error_shape(body, 401)
    assert body["error"] == "INVALID_CREDENTIALS"
