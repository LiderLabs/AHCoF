from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.modules.members.model import Member


def seed_demo_member() -> None:
    with SessionLocal() as db:
        existing_member = db.scalar(
            select(Member).where(
                Member.membership_id == "AHCOF-000123"
            )
        )

        if existing_member is not None:
            if existing_member.password_hash is None:
                existing_member.password_hash = hash_password(
                    "demo-password"
                )
                db.commit()
                print("Demo member password updated.")
            else:
                print("Demo member already exists.")
            return

        member = Member(
            membership_id="AHCOF-000123",
            first_name="Elder",
            last_name="Mensah",
            membership_type="Standard",
            email_address="elder.mensah@example.com",
            phone_number="0241234567",
            church_branch="Kumasi Central SDA Church",
            conference="Mid-Central Ghana Conference",
            is_active=True,
            is_demo=True,
            accounts=[],
            gps_address="Kumasi, Ashanti Region, Ghana",
            password_hash=hash_password("demo-password"),
        )

        db.add(member)
        db.commit()

        print("Demo member seeded successfully.")


if __name__ == "__main__":
    seed_demo_member()
