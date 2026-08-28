from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.members.model import Member

from app.core.exceptions import UserAlreadyExistsError
from app.core.security import hash_password
from app.modules.members.schema import MemberCreate

def create_member(db: Session, payload: MemberCreate) -> Member:
    existing = db.scalar(
        select(Member).where(
            (Member.phone_number == payload.phone_number) |
            (Member.email_address == payload.email_address) |
            (Member.membership_id == payload.membership_id)
        )
    )
    if existing:
        raise UserAlreadyExistsError()

    member = Member(
        membership_id=payload.membership_id,
        first_name=payload.first_name,
        last_name=payload.last_name,
        membership_type=payload.membership_type,
        email_address=payload.email_address,
        phone_number=payload.phone_number,
        church_branch=payload.church_branch,
        conference=payload.conference,
        gps_address=payload.gps_address,
        password_hash=hash_password(payload.password),
        is_active=True,
        is_demo=False,
        accounts=[],
    )

    db.add(member)
    db.commit()
    db.refresh(member)
    return member

def get_member_by_id(db: Session, member_id: UUID) -> Member | None:
    return db.get(Member, member_id)

def get_all_members(db: Session) -> list[Member]:
    statement = select(Member).order_by(Member.created_at.desc())
    return list(db.scalars(statement).all())