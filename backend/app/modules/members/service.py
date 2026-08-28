from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.members.model import Member

from app.core.exceptions import UserAlreadyExistsError
from app.core.security import hash_password
from app.modules.members.schema import MemberCreate

import uuid as uuid_lib

def create_member(db: Session, payload: MemberCreate) -> Member:
    existing = db.scalar(
        select(Member).where(
            (Member.phone_number == payload.phone_number) |
            (Member.email_address == payload.email_address)
        )
    )
    if existing:
        raise UserAlreadyExistsError()

    member = Member(
        membership_id=f"AHCOF-{str(uuid_lib.uuid4())[:8].upper()}",
        first_name=payload.first_name,
        last_name=payload.last_name,
        email_address=payload.email_address,
        phone_number=payload.phone_number,
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