from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import Field

from app.core.serialization import AHCoFBase


class RegularAccountDetails(AHCoFBase):
    """Data_shapes.docx §2.15 — accountDetails shape when
    accountType == "regular_account"."""

    amount_contributed_that_month: int = Field(default=0, examples=[500])
    is_primary: bool = Field(default=False)


class KidiAccountDetails(AHCoFBase):
    """Data_shapes.docx §2.16 — accountDetails shape when
    accountType == "kidi_account"."""

    child_name: str
    child_id: str | None = None
    next_transfer_date: datetime | None = None
    next_transfer_amount: int | None = None
    maturity_date: datetime | None = None


class EducationFundDetails(AHCoFBase):
    """Data_shapes.docx §2.17 — accountDetails shape when
    accountType == "education_fund"."""

    goal_name: str
    target_amount: int
    progress_percentage: int = 0
    maturity_date: datetime | None = None


class PurposeDrivenDetails(AHCoFBase):
    """Data_shapes.docx §2.18 — accountDetails shape when
    accountType == "purpose_driven"."""

    goal_name: str
    target_amount: int
    progress_percentage: int = 0
    maturity_date: datetime | None = None


class ContributorInformation(AHCoFBase):
    """Data_shapes.docx §2.19."""

    contributor_id: UUID
    contributors_name: str
    relationship_to_child: str | None = None
    amount_contributed: int
    date_of_contribution: datetime


class ContributionHistoryItem(AHCoFBase):
    """Data_shapes.docx §2.20 — a single contribution history entry."""

    contribution_date: datetime
    amount_contributed: int


AccountType = Literal[
    "regular_account",
    "kidi_account",
    "education_fund",
    "purpose_driven",
]


class SavingsAccountData(AHCoFBase):
    """Data_shapes.docx §2.14 — the shared envelope every account type carries."""

    account_id: UUID
    member_id: UUID
    account_number: str
    account_type: AccountType
    account_status: Literal["active", "matured", "closed", "frozen"]
    current_balance: int = 0
    currency: str = "GHS"
    contribution_history: list[ContributionHistoryItem] = Field(default_factory=list)
    contributors_information: list[ContributorInformation] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    interest_earned: int = 0
    auto_transfer: bool = False
    account_details: (
        RegularAccountDetails
        | KidiAccountDetails
        | EducationFundDetails
        | PurposeDrivenDetails
        | dict
    )


class CreateRegularSavingsAccountRequest(AHCoFBase):
    """Data_shapes.docx §2.14 & §2.15 — payload when a member creates a regular account.

    Matches the frontend contract exactly: amountContributedThatMonth is the
    member's initial contribution (required), isPrimary is optional and
    defaults to False. member_id, current_balance, interest_earned, and
    auto_transfer are no longer accepted from the client — they're derived
    server-side (member_id from the auth token; the rest start at zero/false
    for a brand-new account).
    """

    amount_contributed_that_month: int = Field(examples=[500])
    is_primary: bool = Field(default=False)


class CreateKidiAccountRequest(AHCoFBase):
    """Data_shapes.docx §2.14 & §2.16 — payload when creating a kidi account."""

    child_name: str
    child_id: str | None = None
    next_transfer_date: datetime | None = None
    next_transfer_amount: int | None = None
    maturity_date: datetime | None = None
    auto_transfer: bool = Field(default=False)


class CreateEducationFundRequest(AHCoFBase):
    """Data_shapes.docx §2.14 & §2.17 — payload when creating an education fund account."""

    goal_name: str
    target_amount: int
    maturity_date: datetime | None = None
    auto_transfer: bool = Field(default=False)


class CreatePurposeDrivenRequest(AHCoFBase):
    """Data_shapes.docx §2.14 & §2.18 — payload when creating a purpose-driven account."""

    goal_name: str
    target_amount: int
    maturity_date: datetime | None = None
    auto_transfer: bool = Field(default=False)


class SingleAccountResponse(AHCoFBase):
    """Data_shapes.docx §2.21."""

    status: Literal["success"] = "success"
    data: SavingsAccountData


class AllAccountsResponse(AHCoFBase):
    """Data_shapes.docx §2.22."""

    status: Literal["success"] = "success"
    accounts: list[SavingsAccountData]


class PaginationMeta(AHCoFBase):
    page_number: int
    page_size: int
    total_count: int


class ContributionHistoryResponse(AHCoFBase):
    """Data_shapes.docx §2.23."""

    status: Literal["success"] = "success"
    contribution_history: list[ContributionHistoryItem]
    pagination: PaginationMeta