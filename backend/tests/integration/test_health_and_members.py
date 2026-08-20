from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check_returns_ok() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["environment"] == "development"
    assert response.json()["demo_mode"] is True


def test_readiness_check_returns_database_connected() -> None:
    response = client.get("/health/ready")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["database"] == "connected"


def test_list_members_returns_demo_member() -> None:
    response = client.get("/api/v1/members")

    assert response.status_code == 200

    members = response.json()

    assert len(members) >= 1
    assert any(
        member["membership_id"] == "AHCOF-000123"
        and member["is_demo"] is True
        for member in members
    )