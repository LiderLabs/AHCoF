from __future__ import annotations

from fastapi import APIRouter

from app.modules.dashboard.service import get_dashboard_for_demo_member
from app.modules.dashboard.schema import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardResponse, summary="Get member home dashboard")
def get_dashboard() -> DashboardResponse:
    """
    Return the home dashboard for the prototype demo member.

    Currently returns fixed sample data as per the PRD.
    Authentication and member-specific authorization will be added later.
    """
    return get_dashboard_for_demo_member()
