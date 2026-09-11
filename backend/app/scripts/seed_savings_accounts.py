"""Creates a savings account for every member already in the database
who doesn't have one of the given type yet. Quick way to get real
savings data behind real members ahead of the demo, using the same
service functions the API endpoints call — no HTTP, no tokens needed.

Usage (run from backend/):
    python -m app.scripts.seed_savings_accounts
    python -m app.scripts.seed_savings_accounts --type all
    python -m app.scripts.seed_savings_accounts --type kidi --child-name "Ama"
    python -m app.scripts.seed_savings_accounts --type education-fund --amount 10000 --target-amount 500000

All money amounts are minor units (pesewas) — the default --amount 5000
is exactly the GHS50 activation floor. --target-amount defaults to
GHS5000 (500000) for the two goal-based types.
"""

import argparse

from app.core.database import SessionLocal
from app.modules.members.model import Member
from app.modules.savings.model import SavingsAccount
from app.modules.savings.schema import (
    CreateEducationFundRequest,
    CreateKidiAccountRequest,
    CreatePurposeDrivenRequest,
    CreateRegularSavingsAccountRequest,
)
from app.modules.savings.service import (
    create_education_fund_account,
    create_kidi_savings_account,
    create_purpose_driven_account,
    create_regular_savings_account,
)

TYPE_CHOICES = {
    "regular": "regular_account",
    "kidi": "kidi_account",
    "education-fund": "education_fund",
    "purpose-driven": "purpose_driven",
}


def _create_one(db, account_type: str, member_id, args) -> None:
    if account_type == "regular_account":
        payload = CreateRegularSavingsAccountRequest(
            initial_deposit=args.amount,
            auto_transfer=False,
            is_primary=False,
        )
        create_regular_savings_account(db, payload, member_id)

    elif account_type == "kidi_account":
        payload = CreateKidiAccountRequest(
            initial_deposit=args.amount,
            auto_transfer=False,
            child_name=args.child_name,
        )
        create_kidi_savings_account(db, payload, member_id)

    elif account_type == "education_fund":
        payload = CreateEducationFundRequest(
            initial_deposit=args.amount,
            auto_transfer=False,
            goal_name=args.goal_name,
            target_amount=args.target_amount,
        )
        create_education_fund_account(db, payload, member_id)

    elif account_type == "purpose_driven":
        payload = CreatePurposeDrivenRequest(
            initial_deposit=args.amount,
            auto_transfer=False,
            goal_name=args.goal_name,
            target_amount=args.target_amount,
        )
        create_purpose_driven_account(db, payload, member_id)


def seed_savings_accounts(args) -> None:
    types_to_create = (
        list(TYPE_CHOICES.values()) if args.type == "all" else [TYPE_CHOICES[args.type]]
    )

    with SessionLocal() as db:
        members = db.query(Member).all()
        print(f"Found {len(members)} member(s).")

        for member in members:
            existing_types = {
                account.account_type
                for account in db.query(SavingsAccount)
                .filter_by(member_id=member.id)
                .all()
            }

            for account_type in types_to_create:
                if account_type in existing_types:
                    print(f"  skip {member.membership_id}: already has {account_type}")
                    continue

                _create_one(db, account_type, member.id, args)
                print(f"  created {account_type} for {member.membership_id}")

    print("Done.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--type",
        choices=[*TYPE_CHOICES.keys(), "all"],
        default="regular",
        help="Which account type to create per member (default: regular).",
    )
    parser.add_argument(
        "--amount",
        type=int,
        default=5000,
        help="initialDeposit in minor units/pesewas (default: 5000 = GHS50 floor).",
    )
    parser.add_argument(
        "--target-amount",
        type=int,
        default=500000,
        help="targetAmount in minor units, education-fund/purpose-driven only (default: 500000 = GHS5000).",
    )
    parser.add_argument(
        "--goal-name",
        default="Demo Goal",
        help="goalName, education-fund/purpose-driven only.",
    )
    parser.add_argument(
        "--child-name",
        default="Demo Child",
        help="childName, kidi only.",
    )

    args = parser.parse_args()
    seed_savings_accounts(args)


if __name__ == "__main__":
    main()