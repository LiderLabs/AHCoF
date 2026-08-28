from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import get_current_member
from app.modules.members.model import Member
from app.modules.dashboard.service import get_dashboard_for_demo_member
from app.modules.dashboard.schema import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get(
    "",
    response_model=DashboardResponse,
    response_model_by_alias=True,
    summary="Get member home dashboard",
)
def get_dashboard(
    current_member: Member = Depends(get_current_member),
) -> DashboardResponse:
    """
    Return the home dashboard. Requires a valid Bearer token.
    Currently returns fixed prototype data — real DB-backed data comes with Savings/Loans modules.
    """
    return get_dashboard_for_demo_member()