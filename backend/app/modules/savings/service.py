import uuid as uuid_lib
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.savings.model import AccountContributor
from app.modules.savings.model import (
    ContributionHistoryEntry as ContributionHistoryEntryModel,
)
from app.modules.savings.model import SavingsAccount
from app.modules.savings.schema import (
    ContributeToAccountRequest,
    ContributionHistoryItem,
    ContributorInformation,
    CreateEducationFundRequest,
    CreateKidiAccountRequest,
    CreatePurposeDrivenRequest,
    CreateRegularSavingsAccountRequest,
    EducationFundDetails,
    KidiAccountDetails,
    PurposeDrivenDetails,
    RegularAccountDetails,
    SavingsAccountData,
)


def _generate_account_number() -> str:
    return f"SAV-{str(uuid_lib.uuid4())[:8].upper()}"


def _generate_child_id() -> str:
    return f"CHILD-{str(uuid_lib.uuid4())[:8].upper()}"


def _as_aware_utc(value: datetime) -> datetime:
    """Some DB drivers hand back naive datetimes for TIMESTAMPTZ columns.
    Normalize so duration math against a fresh now() never breaks."""
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def _progress_for(current_balance: int, target_amount: int) -> int:
    if target_amount <= 0:
        return 0
    return min(100, (current_balance * 100) // target_amount)


def create_regular_savings_account(
    db: Session,
    payload: CreateRegularSavingsAccountRequest,
    member_id: UUID,
) -> SavingsAccount:
    account = SavingsAccount(
        member_id=member_id,
        account_number=_generate_account_number(),
        account_type="regular_account",
        account_status="active",
        current_balance=payload.initial_deposit,
        interest_earned=0,
        auto_transfer=payload.auto_transfer,
        account_details={
            "isPrimary": payload.is_primary,
        },
    )

    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def create_kidi_savings_account(
    db: Session,
    payload: CreateKidiAccountRequest,
    member_id: UUID,
) -> SavingsAccount:
    account = SavingsAccount(
        member_id=member_id,
        account_number=_generate_account_number(),
        account_type="kidi_account",
        account_status="active",
        current_balance=payload.initial_deposit,
        interest_earned=0,
        auto_transfer=payload.auto_transfer,
        account_details={
            "childId": _generate_child_id(),
            "childName": payload.child_name,
        },
    )

    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def create_education_fund_account(
    db: Session,
    payload: CreateEducationFundRequest,
    member_id: UUID,
) -> SavingsAccount:
    now = datetime.now(timezone.utc)
    progress = _progress_for(payload.initial_deposit, payload.target_amount)
    maturity_date = now if progress >= 100 else None
    days_to_maturity = 0 if progress >= 100 else None

    account = SavingsAccount(
        member_id=member_id,
        account_number=_generate_account_number(),
        account_type="education_fund",
        account_status="active",
        current_balance=payload.initial_deposit,
        interest_earned=0,
        auto_transfer=payload.auto_transfer,
        account_details={
            "goalName": payload.goal_name,
            "targetAmount": payload.target_amount,
            "progressPercentage": progress,
            "maturityDate": maturity_date.isoformat() if maturity_date else None,
            "daysToMaturity": days_to_maturity,
        },
    )

    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def create_purpose_driven_account(
    db: Session,
    payload: CreatePurposeDrivenRequest,
    member_id: UUID,
) -> SavingsAccount:
    now = datetime.now(timezone.utc)
    progress = _progress_for(payload.initial_deposit, payload.target_amount)
    maturity_date = now if progress >= 100 else None
    days_to_maturity = 0 if progress >= 100 else None

    account = SavingsAccount(
        member_id=member_id,
        account_number=_generate_account_number(),
        account_type="purpose_driven",
        account_status="active",
        current_balance=payload.initial_deposit,
        interest_earned=0,
        auto_transfer=payload.auto_transfer,
        account_details={
            "goalName": payload.goal_name,
            "targetAmount": payload.target_amount,
            "progressPercentage": progress,
            "maturityDate": maturity_date.isoformat() if maturity_date else None,
            "daysToMaturity": days_to_maturity,
        },
    )

    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def contribute_to_account(
    db: Session,
    account: SavingsAccount,
    payload: ContributeToAccountRequest,
) -> SavingsAccount:
    """A loved one / interested party (or the member themselves) topping
    up an existing account. Updates currentBalance, logs the contribution,
    logs a named contributor if one was given, and for goal-based account
    types recomputes progressPercentage and stamps maturityDate/
    daysToMaturity the moment the target is reached — once set, these
    never move again even if the balance keeps growing."""

    now = datetime.now(timezone.utc)

    account.current_balance += payload.amount_contributed

    db.add(
        ContributionHistoryEntryModel(
            account_id=account.id,
            contribution_date=now,
            amount_contributed=payload.amount_contributed,
        )
    )

    if payload.contributors_name:
        db.add(
            AccountContributor(
                account_id=account.id,
                contributors_name=payload.contributors_name,
                relationship_to_child=payload.relationship_to_child,
                amount_contributed=payload.amount_contributed,
                date_of_contribution=now,
            )
        )

    if account.account_type in ("education_fund", "purpose_driven"):
        details = dict(account.account_details or {})
        target_amount = details.get("targetAmount", 0)
        progress = _progress_for(account.current_balance, target_amount)
        details["progressPercentage"] = progress

        if progress >= 100 and not details.get("maturityDate"):
            created_at = _as_aware_utc(account.created_at)
            details["maturityDate"] = now.isoformat()
            details["daysToMaturity"] = (now - created_at).days

        account.account_details = details

    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def get_account_by_id(db: Session, account_id: UUID) -> SavingsAccount | None:
    return db.get(SavingsAccount, account_id)


def get_accounts_for_member(db: Session, member_id: UUID) -> list[SavingsAccount]:
    statement = (
        select(SavingsAccount)
        .where(SavingsAccount.member_id == member_id)
        .order_by(SavingsAccount.created_at.desc())
    )
    return list(db.scalars(statement).all())


def get_contribution_history(
    db: Session,
    account_id: UUID,
    page_number: int,
    page_size: int,
) -> tuple[list[ContributionHistoryEntryModel], int]:
    total_count = (
        db.scalar(
            select(func.count())
            .select_from(ContributionHistoryEntryModel)
            .where(ContributionHistoryEntryModel.account_id == account_id)
        )
        or 0
    )

    statement = (
        select(ContributionHistoryEntryModel)
        .where(ContributionHistoryEntryModel.account_id == account_id)
        .order_by(ContributionHistoryEntryModel.contribution_date.desc())
        .offset((page_number - 1) * page_size)
        .limit(page_size)
    )
    entries = list(db.scalars(statement).all())
    return entries, total_count


def _deserialize_account_details(
    account_type: str, details: dict
) -> (
    RegularAccountDetails
    | KidiAccountDetails
    | EducationFundDetails
    | PurposeDrivenDetails
    | dict
):
    try:
        if account_type == "kidi_account":
            return KidiAccountDetails.model_validate(details)
        if account_type == "education_fund":
            return EducationFundDetails.model_validate(details)
        if account_type == "purpose_driven":
            return PurposeDrivenDetails.model_validate(details)
        return RegularAccountDetails.model_validate(details)
    except Exception:
        return details


def serialize_account(account: SavingsAccount) -> SavingsAccountData:
    """Assembles the §2.14 envelope from the ORM object."""

    return SavingsAccountData(
        account_id=account.id,
        member_id=account.member_id,
        account_number=account.account_number,
        account_type=account.account_type,
        account_status=account.account_status,
        current_balance=account.current_balance,
        currency=account.currency,
        contribution_history=[
            ContributionHistoryItem(
                contribution_date=entry.contribution_date,
                amount_contributed=entry.amount_contributed,
            )
            for entry in account.contribution_history
        ],
        contributors_information=[
            ContributorInformation(
                contributor_id=contributor.id,
                contributors_name=contributor.contributors_name,
                relationship_to_child=contributor.relationship_to_child,
                amount_contributed=contributor.amount_contributed,
                date_of_contribution=contributor.date_of_contribution,
            )
            for contributor in account.contributors
        ],
        created_at=account.created_at,
        updated_at=account.updated_at,
        interest_earned=account.interest_earned,
        auto_transfer=account.auto_transfer,
        account_details=_deserialize_account_details(
            account.account_type, account.account_details or {}
        ),
    )