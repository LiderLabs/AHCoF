from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.members.schema import MemberResponse
from app.modules.members.service import get_all_members, get_member_by_id

router = APIRouter(
    prefix="/members",
    tags=["Members"],
    responses={
        404: {
            "description": "Member not found.",
        }
    },
)

@router.get(
    "",
    response_model=list[MemberResponse],
    summary="List prototype members",
    description=(
        "Returns all member records currently available in the prototype database. "
        "All records returned by this endpoint are fictional demonstration data."
    ),
)
def list_members(db: Session = Depends(get_db)) -> list[MemberResponse]:
    return get_all_members(db)

@router.get(
    "/{member_id}",
    response_model=MemberResponse,
    summary="Retrieve one member profile",
    description=(
        "Returns a single prototype member by internal UUID. "
        "Returns HTTP 404 if no member exists with the provided UUID."
    ),
)
def retrieve_member(
    member_id: UUID,
    db: Session = Depends(get_db),
) -> MemberResponse:
    member = get_member_by_id(db, member_id)

    if member is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found.",
        )

    return member