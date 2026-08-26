from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.modules.dashboard.schema import DashboardResponse


def get_dashboard_for_demo_member() -> DashboardResponse:
    """
    Return a prototype dashboard for the demo member (Elder Mensah).
    Values are fictional but realistic, aligned with the PRD examples.
    """
    # Import here to avoid circular imports at module load time
    from app.modules.dashboard.schema import (
        DashboardResponse,
        DashboardMember,
        FinancialSummary,
        QuickAction,
        RecentActivity,
        RecentNotification,
    )

    member = DashboardMember(
        first_name="Elder",
        last_name="Mensah",
        membership_id="AHCOF-000123",
    )

    financial_summary = FinancialSummary(
        total_savings="25800.00",
        share_value="5400.00",
        active_loan_balance="12000.00",
        upcoming_repayment_amount="350.00",
        upcoming_repayment_date="2026-09-01",
        currency="GHS",
    )

    quick_actions = [
        QuickAction(
            id="save_money",
            label="Save Money",
            route="/savings/contribute",
            enabled=True,
        ),
        QuickAction(
            id="apply_loan",
            label="Apply for Loan",
            route="/loans/apply",
            enabled=True,
        ),
        QuickAction(
            id="make_repayment",
            label="Make Repayment",
            route="/loans/repay",
            enabled=True,
        ),
        QuickAction(
            id="buy_shares",
            label="Buy Shares",
            route="/shares/purchase",
            enabled=True,
        ),
        QuickAction(
            id="download_statement",
            label="Download Statement",
            route="/statements/download",
            enabled=False,
        ),
    ]

    recent_activities = [
        RecentActivity(
            id="act-001",
            type="savings_contribution",
            amount="500.00",
            date=datetime(2026, 8, 15, 10, 23, 0, tzinfo=timezone.utc),
            description="Monthly savings contribution",
            reference="TXN-2026-08-001",
        ),
        RecentActivity(
            id="act-002",
            type="loan_repayment",
            amount="350.00",
            date=datetime(2026, 8, 10, 14, 10, 0, tzinfo=timezone.utc),
            description="Loan repayment",
            reference="TXN-2026-08-002",
        ),
        RecentActivity(
            id="act-003",
            type="dividend",
            amount="120.00",
            date=datetime(2026, 7, 30, 9, 0, 0, tzinfo=timezone.utc),
            description="Dividend credited",
            reference="DIV-2026-07",
        ),
    ]

    recent_notifications = [
        RecentNotification(
            id="notif-001",
            category="loan",
            title="Repayment Due Soon",
            message="Your next loan repayment of GHS 350 is due on 1 September 2026.",
            date=datetime(2026, 8, 20, 8, 0, 0, tzinfo=timezone.utc),
            is_read=False,
        ),
        RecentNotification(
            id="notif-002",
            category="financial",
            title="Contribution Received",
            message="Your savings contribution of GHS 500 has been received.",
            date=datetime(2026, 8, 15, 10, 25, 0, tzinfo=timezone.utc),
            is_read=True,
        ),
    ]

    return DashboardResponse(
        member=member,
        financial_summary=financial_summary,
        quick_actions=quick_actions,
        recent_activities=recent_activities,
        recent_notifications=recent_notifications,
    )
