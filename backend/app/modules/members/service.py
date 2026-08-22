from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.members.model import Member

def get_member_by_id(db: Session, member_id: UUID) -> Member | None:
    return db.get(Member, member_id)

def get_all_members(db: Session) -> list[Member]:
    statement = select(Member).order_by(Member.created_at.desc())
    return list(db.scalars(statement).all())