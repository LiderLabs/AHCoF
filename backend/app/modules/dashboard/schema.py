from __future__ import annotations

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal


class DashboardMember(BaseModel):
    first_name: str = Field(..., description="Member first name for greeting")
    last_name: str = Field(..., description="Member last name")
    membership_id: str = Field(..., description="AHCoF membership ID")


class FinancialSummary(BaseModel):
    total_savings: str = Field(..., description="Total savings balance as decimal string")
    share_value: str = Field(..., description="Total share value as decimal string")
    active_loan_balance: str = Field(..., description="Outstanding loan balance as decimal string")
    upcoming_repayment_amount: str = Field(..., description="Next repayment amount as decimal string")
    upcoming_repayment_date: str | None = Field(None, description="Next repayment date as ISO date string")
    currency: str = Field(default="GHS", description="Currency code")


class QuickAction(BaseModel):
    id: str
    label: str
    route: str
    enabled: bool = True


class RecentActivity(BaseModel):
    id: str
    type: Literal[
        "savings_contribution",
        "loan_repayment",
        "dividend",
        "share_purchase",
        "withdrawal",
    ]
    amount: str = Field(..., description="Amount as decimal string")
    date: datetime
    description: str
    reference: str


class RecentNotification(BaseModel):
    id: str
    category: Literal["financial", "loan", "account", "announcement"]
    title: str
    message: str
    date: datetime
    is_read: bool


class DashboardResponse(BaseModel):
    member: DashboardMember
    financial_summary: FinancialSummary
    quick_actions: list[QuickAction]
    recent_activities: list[RecentActivity]
    recent_notifications: list[RecentNotification]

    class Config:
        from_attributes = True
