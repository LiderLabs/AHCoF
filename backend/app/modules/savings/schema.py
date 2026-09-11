from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import Field

from app.core.serialization import AHCoFBase

# GHS 50.00 in minor units (pesewas). Flat activation floor across all
# four account types per Gina's call — the initial deposit is a
# commitment fee to activate the account, not a progress metric.
MIN_INITIAL_DEPOSIT = 5000


class RegularAccountDetails(AHCoFBase):
    """Data_shapes.docx §2.20 — accountDetails shape when
    accountType == "regular_account"."""

    is_primary: bool = Field(default=False)


class KidiAccountDetails(AHCoFBase):
    """Data_shapes.docx §2.21 — accountDetails shape when
    accountType == "kidi_account". childId is app-generated, never
    client-supplied. maturityDate dropped per latest update — kidi
    accounts don't track a target/maturity concept."""

    child_id: str
    child_name: str


class EducationFundDetails(AHCoFBase):
    """Data_shapes.docx §2.22 — accountDetails shape when
    accountType == "education_fund". maturityDate/daysToMaturity are
    backend-generated the moment currentBalance reaches targetAmount —
    never client-supplied, and stay null until that happens."""

    goal_name: str
    target_amount: int = Field(ge=1)
    progress_percentage: int = 0
    maturity_date: datetime | None = None
    days_to_maturity: int | None = None


class PurposeDrivenDetails(AHCoFBase):
    """Data_shapes.docx §2.23 — accountDetails shape when
    accountType == "purpose_driven". Same shape/semantics as
    EducationFundDetails."""

    goal_name: str
    target_amount: int = Field(ge=1)
    progress_percentage: int = 0
    maturity_date: datetime | None = None
    days_to_maturity: int | None = None


class ContributorInformation(AHCoFBase):
    """Data_shapes.docx §2.28."""

    contributor_id: UUID
    contributors_name: str
    relationship_to_child: str | None = None
    amount_contributed: int
    date_of_contribution: datetime


class ContributionHistoryItem(AHCoFBase):
    """Data_shapes.docx §2.29 — a single contribution history entry."""

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


class CreateSavingsAccountBase(AHCoFBase):
    """Data_shapes.docx §2.15 — BASE CREATE ACCOUNT PAYLOAD, shared by all
    four account types. initialDeposit funds currentBalance directly and
    must clear the GHS50 activation floor; autoTransfer is shared too, no
    longer regular-account-specific."""

    initial_deposit: int = Field(ge=MIN_INITIAL_DEPOSIT, examples=[5000])
    auto_transfer: bool = Field(default=False)


class CreateRegularSavingsAccountRequest(CreateSavingsAccountBase):
    """Data_shapes.docx §2.24 — REGULAR ACCOUNT PAYLOAD (extends base)."""

    is_primary: bool = Field(default=False)


class CreateKidiAccountRequest(CreateSavingsAccountBase):
    """Data_shapes.docx §2.25 — KIDI ACCOUNT PAYLOAD (extends base).
    childId is app-generated; maturityDate no longer applies to kidi."""

    child_name: str


class CreateEducationFundRequest(CreateSavingsAccountBase):
    """Data_shapes.docx §2.26 — EDUCATION FUND ACCOUNT PAYLOAD (extends base).
    maturityDate is never a payload field — it's backend-generated."""

    goal_name: str
    target_amount: int = Field(ge=1)


class CreatePurposeDrivenRequest(CreateSavingsAccountBase):
    """Data_shapes.docx §2.27 — PURPOSE-DRIVEN ACCOUNT PAYLOAD (extends base)."""

    goal_name: str
    target_amount: int = Field(ge=1)


class ContributeToAccountRequest(AHCoFBase):
    """Payload for a loved one / the member topping up an existing account.
    contributorsName is optional — omit it when the member is contributing
    to their own account rather than recording someone else's gift."""

    amount_contributed: int = Field(gt=0, examples=[1000])
    contributors_name: str | None = None
    relationship_to_child: str | None = None


class SingleAccountResponse(AHCoFBase):
    """Data_shapes.docx §2.30."""

    status: Literal["success"] = "success"
    data: SavingsAccountData


class AllAccountsResponse(AHCoFBase):
    """Data_shapes.docx §2.31."""

    status: Literal["success"] = "success"
    accounts: list[SavingsAccountData]


class PaginationMeta(AHCoFBase):
    page_number: int
    page_size: int
    total_count: int


class ContributionHistoryResponse(AHCoFBase):
    """Data_shapes.docx §2.32."""

    status: Literal["success"] = "success"
    contribution_history: list[ContributionHistoryItem]
    pagination: PaginationMeta