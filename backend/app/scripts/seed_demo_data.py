from sqlalchemy import select

from app.core.database import SessionLocal
from app.modules.members.model import Member


DEMO_MEMBER = {
    "membership_id": "AHCOF-000123",
    "first_name": "Elder",
    "last_name": "Mensah",
    "phone_number": "0241234567",
    "email": "elder.mensah@example.com",
    "church": "Kumasi Central SDA Church",
    "conference": "Mid-Central Ghana Conference",
    "membership_status": "ACTIVE",
    "is_demo": True,
}


def seed_demo_member() -> None:
    with SessionLocal() as db:
        existing_member = db.scalar(
            select(Member).where(
                Member.membership_id == DEMO_MEMBER["membership_id"]
            )
        )

        if existing_member is not None:
            print(
                f"Demo member {DEMO_MEMBER['membership_id']} already exists. "
                "No changes made."
            )
            return

        member = Member(**DEMO_MEMBER)
        db.add(member)
        db.commit()
        db.refresh(member)

        print(
            f"Created demo member: {member.first_name} {member.last_name} "
            f"({member.membership_id})"
        )


if __name__ == "__main__":
    seed_demo_member()