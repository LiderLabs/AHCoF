from datetime import datetime, timezone

from app.core.config import settings
from app.core.database import engine
from app.core.security import create_access_token
from app.main import app
from app.modules.members.model import Member
from app.modules.savings.model import (
    AccountContributor,
    ContributionHistoryEntry,
    SavingsAccount,
)
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import sessionmaker

client = TestClient(app)


def _demo_member() -> Member:
    Session = sessionmaker(bind=engine)
    with Session() as db:
        return db.scalar(select(Member).where(Member.membership_id == "AHCOF-000123"))


def _auth_headers_for(member: Member) -> dict[str, str]:
    token = create_access_token(
        subject=str(member.id),
        secret_key=settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
        expires_minutes=settings.access_token_expire_minutes,
    )
    return {"Authorization": f"Bearer {token}"}


def test_create_regular_account_returns_contract_shape():
    member = _demo_member()

    response = client.post(
        "/api/v1/savings/accounts/regular",
        json={
            "memberId": str(member.id),
            "currentBalance": 1000,
            "interestEarned": 0,
            "autoTransfer": False,
            "amountContributedThatMonth": 200,
            "isPrimary": True,
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "success"
    data = body["data"]
    assert data["accountType"] == "regular_account"
    assert data["accountStatus"] == "active"
    assert data["currentBalance"] == 1000
    assert data["accountDetails"] == {
        "amountContributedThatMonth": 200,
        "isPrimary": True,
    }
    assert data["contributionHistory"] == []
    assert data["contributorsInformation"] == []


def test_list_my_accounts_only_returns_my_accounts():
    member = _demo_member()
    other = Member(
        membership_id="AHCOF-OTHER1",
        first_name="Other",
        last_name="Member",
        phone_number="0209999999",
        accounts=[],
        is_demo=True,
    )

    Session = sessionmaker(bind=engine)
    with Session() as db:
        db.add(other)
        db.commit()
        db.refresh(other)

        db.add(SavingsAccount(
            member_id=member.id,
            account_number="SAV-MINE0001",
            account_type="regular_account",
            account_status="active",
        ))
        db.add(SavingsAccount(
            member_id=other.id,
            account_number="SAV-THEIRS01",
            account_type="regular_account",
            account_status="active",
        ))
        db.commit()

    response = client.get("/api/v1/savings/accounts", headers=_auth_headers_for(member))

    assert response.status_code == 200
    body = response.json()
    assert len(body["accounts"]) == 1
    assert body["accounts"][0]["accountNumber"] == "SAV-MINE0001"


def test_retrieve_account_rejects_someone_elses_account():
    member = _demo_member()
    other = Member(
        membership_id="AHCOF-OTHER2",
        first_name="Other",
        last_name="Member",
        phone_number="0208888888",
        accounts=[],
        is_demo=True,
    )

    Session = sessionmaker(bind=engine)
    with Session() as db:
        db.add(other)
        db.commit()
        db.refresh(other)

        account = SavingsAccount(
            member_id=other.id,
            account_number="SAV-NOTMINE1",
            account_type="regular_account",
            account_status="active",
        )
        db.add(account)
        db.commit()
        db.refresh(account)
        account_id = account.id

    response = client.get(
        f"/api/v1/savings/accounts/{account_id}",
        headers=_auth_headers_for(member),
    )

    assert response.status_code == 403
    assert response.json()["error"] == "SAVINGS_ACCOUNT_ACCESS_DENIED"


def test_retrieve_account_404_for_unknown_id():
    member = _demo_member()
    import uuid

    response = client.get(
        f"/api/v1/savings/accounts/{uuid.uuid4()}",
        headers=_auth_headers_for(member),
    )

    assert response.status_code == 404
    assert response.json()["error"] == "SAVINGS_ACCOUNT_NOT_FOUND"


def test_contribution_history_paginates():
    member = _demo_member()

    Session = sessionmaker(bind=engine)
    with Session() as db:
        account = SavingsAccount(
            member_id=member.id,
            account_number="SAV-HISTORY1",
            account_type="regular_account",
            account_status="active",
        )
        db.add(account)
        db.commit()
        db.refresh(account)
        account_id = account.id

        for i in range(25):
            db.add(ContributionHistoryEntry(
                account_id=account_id,
                contribution_date=datetime(2026, 1, i + 1, tzinfo=timezone.utc),
                amount_contributed=100,
            ))
        db.commit()

    response = client.get(
        f"/api/v1/savings/accounts/{account_id}/contributions",
        params={"pageNumber": 2, "pageSize": 10},
        headers=_auth_headers_for(member),
    )

    assert response.status_code == 200
    body = response.json()
    assert len(body["contributionHistory"]) == 10
    assert body["pagination"] == {
        "pageNumber": 2,
        "pageSize": 10,
        "totalCount": 25,
    }

