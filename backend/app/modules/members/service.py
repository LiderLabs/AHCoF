import uuid as uuid_lib
from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.core.exceptions import UserAlreadyExistsError
from app.core.security import hash_password
from app.modules.members.model import Member
from app.modules.members.schema import CompleteProfileRequest, MemberCreate


def get_member_by_identifier(db: Session, identifier: str) -> Member | None:
    return db.scalar(
        select(Member).where(
            or_(
                Member.phone_number == identifier,
                Member.email_address == identifier,
            )
        )
    )


def create_member(db: Session, payload: MemberCreate) -> Member:
    conflict_conditions = [Member.phone_number == payload.phone_number]

    if payload.email_address is not None:
        conflict_conditions.append(Member.email_address == payload.email_address)

    existing = db.scalar(select(Member).where(or_(*conflict_conditions)))

    if existing is not None:
        if existing.phone_number == payload.phone_number:
            raise UserAlreadyExistsError(
                message="A member with this phone number already exists"
            )
        raise UserAlreadyExistsError(
            message="A member with this email address already exists"
        )

    member = Member(
        membership_id=f"AHCOF-{str(uuid_lib.uuid4())[:8].upper()}",
        first_name=payload.first_name,
        last_name=payload.last_name,
        email_address=payload.email_address,
        phone_number=payload.phone_number,
        password_hash=hash_password(payload.password),
        is_active=True,
        is_verified=False,
        is_demo=False,
        accounts=[],
    )

    db.add(member)
    db.commit()
    db.refresh(member)
    return member

def update_member_profile(
    db: Session,
    member: Member,
    payload: CompleteProfileRequest,
) -> Member:
    updates = payload.model_dump(exclude_unset=True)

    for field, value in updates.items():
        setattr(member, field, value)

    db.commit()
    db.refresh(member)
    return member


def get_member_by_id(db: Session, member_id: UUID) -> Member | None:
    return db.get(Member, member_id)

def get_all_members(db: Session) -> list[Member]:
    statement = select(Member).order_by(Member.created_at.desc())
    return list(db.scalars(statement).all())