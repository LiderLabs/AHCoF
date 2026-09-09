import uuid as uuid_lib
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.savings.model import (
    ContributionHistoryEntry as ContributionHistoryEntryModel,
)
from app.modules.savings.model import SavingsAccount
from app.modules.savings.schema import (
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
        current_balance=payload.amount_contributed_that_month,
        interest_earned=0,
        auto_transfer=False,
        account_details={
            "amountContributedThatMonth": payload.amount_contributed_that_month,
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
        current_balance=0,
        interest_earned=0,
        auto_transfer=payload.auto_transfer,
        account_details={
            "childName": payload.child_name,
            "childId": payload.child_id,
            "nextTransferDate": payload.next_transfer_date.isoformat()
            if payload.next_transfer_date
            else None,
            "nextTransferAmount": payload.next_transfer_amount,
            "maturityDate": payload.maturity_date.isoformat()
            if payload.maturity_date
            else None,
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
    account = SavingsAccount(
        member_id=member_id,
        account_number=_generate_account_number(),
        account_type="education_fund",
        account_status="active",
        current_balance=0,
        interest_earned=0,
        auto_transfer=payload.auto_transfer,
        account_details={
            "goalName": payload.goal_name,
            "targetAmount": payload.target_amount,
            "progressPercentage": 0,
            "maturityDate": payload.maturity_date.isoformat()
            if payload.maturity_date
            else None,
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
    account = SavingsAccount(
        member_id=member_id,
        account_number=_generate_account_number(),
        account_type="purpose_driven",
        account_status="active",
        current_balance=0,
        interest_earned=0,
        auto_transfer=payload.auto_transfer,
        account_details={
            "goalName": payload.goal_name,
            "targetAmount": payload.target_amount,
            "progressPercentage": 0,
            "maturityDate": payload.maturity_date.isoformat()
            if payload.maturity_date
            else None,
        },
    )

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