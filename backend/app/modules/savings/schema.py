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


class SavingsAccountData(AHCoFBase):
    """Data_shapes.docx §2.14 — the shared envelope every account type
    carries. This is what the doc refers to as `data(object)` wherever it
    shows up in a response.

    accountType/accountDetails are scoped to "regular_account" for now.
    When kidi/education_fund/purpose_driven land, accountType becomes a
    Literal union and accountDetails becomes a discriminated union keyed
    on accountType.
    """

    account_id: UUID
    member_id: UUID
    account_number: str
    account_type: Literal["regular_account"]
    account_status: Literal["active", "matured", "closed", "frozen"]
    current_balance: int
    currency: str = "GHS"
    contribution_history: list[ContributionHistoryItem] = Field(default_factory=list)
    contributors_information: list[ContributorInformation] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
    interest_earned: int
    auto_transfer: bool
    account_details: RegularAccountDetails


class CreateRegularSavingsAccountRequest(AHCoFBase):
    """Admin/seed-style creation payload. Data_shapes.docx has no member-
    facing "create account" shape yet (account creation/provisioning is
    still an open question) — this exists so we have real accounts to
    retrieve through the read endpoints below.
    """

    member_id: UUID
    current_balance: int = Field(default=0, examples=[0])
    interest_earned: int = Field(default=0, examples=[0])
    auto_transfer: bool = Field(default=False)
    amount_contributed_that_month: int = Field(default=0, examples=[0])
    is_primary: bool = Field(default=False)


class SingleAccountResponse(AHCoFBase):
    """Data_shapes.docx §2.21."""

    status: Literal["success"] = "success"
    data: SavingsAccountData


class AllAccountsResponse(AHCoFBase):
    """Data_shapes.docx §2.22. `data(object)` in the doc just describes
    the shape backing each item in `accounts` — there's no separate
    literal `data` field in this response (confirmed with Drew)."""

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
