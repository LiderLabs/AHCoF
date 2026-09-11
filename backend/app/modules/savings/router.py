from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import (
    SavingsAccountAccessDeniedError,
    SavingsAccountNotFoundError,
)
from app.modules.auth.dependencies import get_current_member
from app.modules.members.model import Member
from app.modules.savings.schema import (
    AllAccountsResponse,
    ContributeToAccountRequest,
    ContributionHistoryItem,
    ContributionHistoryResponse,
    CreateEducationFundRequest,
    CreateKidiAccountRequest,
    CreatePurposeDrivenRequest,
    CreateRegularSavingsAccountRequest,
    PaginationMeta,
    SingleAccountResponse,
)
from app.modules.savings.service import (
    contribute_to_account,
    create_education_fund_account,
    create_kidi_savings_account,
    create_purpose_driven_account,
    create_regular_savings_account,
    get_account_by_id,
    get_accounts_for_member,
    get_contribution_history,
    serialize_account,
)

router = APIRouter(
    prefix="/savings",
    tags=["Savings"],
)


@router.post(
    "/accounts/regular",
    response_model=SingleAccountResponse,
    response_model_by_alias=True,
    status_code=201,
    summary="Create a regular savings account",
    description=(
        "Data_shapes.docx §2.14 & §2.15. Creates a regular savings account for "
        "the authenticated member."
    ),
)
def create_regular_account(
    payload: CreateRegularSavingsAccountRequest,
    current_member: Member = Depends(get_current_member),
    db: Session = Depends(get_db),
) -> SingleAccountResponse:
    target_member_id = payload.member_id or current_member.id
    account = create_regular_savings_account(db, payload, member_id=target_member_id)
    return SingleAccountResponse(data=serialize_account(account))


@router.post(
    "/accounts/kidi",
    response_model=SingleAccountResponse,
    response_model_by_alias=True,
    status_code=201,
    summary="Create a Kidi savings account",
    description="Data_shapes.docx §2.14 & §2.16. Creates a Kidi savings account for the authenticated member.",
)
def create_kidi_account(
    payload: CreateKidiAccountRequest,
    current_member: Member = Depends(get_current_member),
    db: Session = Depends(get_db),
) -> SingleAccountResponse:
    account = create_kidi_savings_account(db, payload, member_id=current_member.id)
    return SingleAccountResponse(data=serialize_account(account))


@router.post(
    "/accounts/education-fund",
    response_model=SingleAccountResponse,
    response_model_by_alias=True,
    status_code=201,
    summary="Create an Education Fund savings account",
    description="Data_shapes.docx §2.14 & §2.17. Creates an Education Fund savings account for the authenticated member.",
)
def create_education_fund(
    payload: CreateEducationFundRequest,
    current_member: Member = Depends(get_current_member),
    db: Session = Depends(get_db),
) -> SingleAccountResponse:
    account = create_education_fund_account(db, payload, member_id=current_member.id)
    return SingleAccountResponse(data=serialize_account(account))


@router.post(
    "/accounts/purpose-driven",
    response_model=SingleAccountResponse,
    response_model_by_alias=True,
    status_code=201,
    summary="Create a Purpose-Driven savings account",
    description="Data_shapes.docx §2.14 & §2.18. Creates a Purpose-Driven savings account for the authenticated member.",
)
def create_purpose_driven(
    payload: CreatePurposeDrivenRequest,
    current_member: Member = Depends(get_current_member),
    db: Session = Depends(get_db),
) -> SingleAccountResponse:
    account = create_purpose_driven_account(db, payload, member_id=current_member.id)
    return SingleAccountResponse(data=serialize_account(account))



@router.get(
    "/accounts",
    response_model=AllAccountsResponse,
    response_model_by_alias=True,
    summary="List the logged-in member's savings accounts",
    description="Data_shapes.docx §2.22. Returns all account types the member has, currently only regular_account.",
)
def list_my_accounts(
    current_member: Member = Depends(get_current_member),
    db: Session = Depends(get_db),
) -> AllAccountsResponse:
    accounts = get_accounts_for_member(db, current_member.id)
    return AllAccountsResponse(accounts=[serialize_account(account) for account in accounts])


@router.get(
    "/accounts/{account_id}",
    response_model=SingleAccountResponse,
    response_model_by_alias=True,
    summary="Retrieve one savings account",
    description="Data_shapes.docx §2.21. Must belong to the logged-in member.",
    responses={
        404: {"description": "Account not found."},
        403: {"description": "Account exists but belongs to a different member."},
    },
)
def retrieve_account(
    account_id: UUID,
    current_member: Member = Depends(get_current_member),
    db: Session = Depends(get_db),
) -> SingleAccountResponse:
    account = get_account_by_id(db, account_id)

    if account is None:
        raise SavingsAccountNotFoundError()

    if account.member_id != current_member.id:
        raise SavingsAccountAccessDeniedError()

    return SingleAccountResponse(data=serialize_account(account))


@router.get(
    "/accounts/{account_id}/contributions",
    response_model=ContributionHistoryResponse,
    response_model_by_alias=True,
    summary="Get an account's contribution history",
    description="Data_shapes.docx §2.23. Must belong to the logged-in member.",
    responses={
        404: {"description": "Account not found."},
        403: {"description": "Account exists but belongs to a different member."},
    },
)
def retrieve_contribution_history(
    account_id: UUID,
    current_member: Member = Depends(get_current_member),
    db: Session = Depends(get_db),
    page_number: int = Query(default=1, ge=1, alias="pageNumber"),
    page_size: int = Query(default=20, ge=1, le=100, alias="pageSize"),
) -> ContributionHistoryResponse:
    account = get_account_by_id(db, account_id)

    if account is None:
        raise SavingsAccountNotFoundError()

    if account.member_id != current_member.id:
        raise SavingsAccountAccessDeniedError()

    entries, total_count = get_contribution_history(db, account_id, page_number, page_size)

    return ContributionHistoryResponse(
        contribution_history=[
            ContributionHistoryItem(
                contribution_date=entry.contribution_date,
                amount_contributed=entry.amount_contributed,
            )
            for entry in entries
        ],
        pagination=PaginationMeta(
            page_number=page_number,
            page_size=page_size,
            total_count=total_count,
        ),
    )


@router.post(
    "/accounts/{account_id}/contributions",
    response_model=SingleAccountResponse,
    response_model_by_alias=True,
    status_code=201,
    summary="Contribute to a savings account",
    description=(
        "Data_shapes.docx §2.28 & §2.29. Records a contribution from a "
        "loved one/interested party (or the member themselves) against an "
        "existing account, updating the balance and, for education-fund "
        "and purpose-driven accounts, progress toward the target."
    ),
    responses={
        404: {"description": "Account not found."},
        403: {"description": "Account exists but belongs to a different member."},
    },
)
def contribute_to_savings_account(
    account_id: UUID,
    payload: ContributeToAccountRequest,
    current_member: Member = Depends(get_current_member),
    db: Session = Depends(get_db),
) -> SingleAccountResponse:
    account = get_account_by_id(db, account_id)

    if account is None:
        raise SavingsAccountNotFoundError()

    if account.member_id != current_member.id:
        raise SavingsAccountAccessDeniedError()

    account = contribute_to_account(db, account, payload)
    return SingleAccountResponse(data=serialize_account(account))