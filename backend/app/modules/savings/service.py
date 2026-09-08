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
    CreateRegularSavingsAccountRequest,
    RegularAccountDetails,
    SavingsAccountData,
)


def _generate_account_number() -> str:
    return f"SAV-{str(uuid_lib.uuid4())[:8].upper()}"


def create_regular_savings_account(
    db: Session,
    payload: CreateRegularSavingsAccountRequest,
) -> SavingsAccount:
    account = SavingsAccount(
        member_id=payload.member_id,
        account_number=_generate_account_number(),
        account_type="regular_account",
        account_status="active",
        current_balance=payload.current_balance,
        interest_earned=payload.interest_earned,
        auto_transfer=payload.auto_transfer,
        account_details={
            "amountContributedThatMonth": payload.amount_contributed_that_month,
            "isPrimary": payload.is_primary,
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


def serialize_account(account: SavingsAccount) -> SavingsAccountData:
    """Assembles the §2.14 envelope from the ORM object. Explicit field-by-
    field mapping rather than `.model_validate(account, from_attributes=True)`
    because accountId/accountDetails/contributorsInformation don't map
    1:1 onto the ORM's column and relationship names.
    """

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
        account_details=RegularAccountDetails(**account.account_details),
    )

