import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SavingsAccount(Base):
    """Data_shapes.docx §2.14 — the shared account envelope every savings
    account type carries. Type-specific fields (§2.15-2.18) live in
    `account_details` rather than as columns/subtables, so kidi_account,
    education_fund, and purpose_driven can be added later without a
    migration each time. Only accountType == "regular_account" is
    implemented today; see schema.py.
    """

    __tablename__ = "savings_accounts"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    member_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("members.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    account_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    account_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    # active/matured/closed/frozen
    account_status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="active",
    )

    current_balance: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
        default="GHS",
    )

    interest_earned: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    auto_transfer: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    account_details: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
        default=dict,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    contribution_history: Mapped[list["ContributionHistoryEntry"]] = relationship(
        back_populates="account",
        cascade="all, delete-orphan",
        order_by="ContributionHistoryEntry.contribution_date.desc()",
    )

    contributors: Mapped[list["AccountContributor"]] = relationship(
        back_populates="account",
        cascade="all, delete-orphan",
    )


class ContributionHistoryEntry(Base):
    """Data_shapes.docx §2.20 — one entry in an account's contribution
    history. Kept as its own table (rather than inside account_details)
    since §2.23 paginates over it.
    """

    __tablename__ = "savings_contribution_history"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    account_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("savings_accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    contribution_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    amount_contributed: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    account: Mapped["SavingsAccount"] = relationship(back_populates="contribution_history")


class AccountContributor(Base):
    """Data_shapes.docx §2.19 — contributorsInformation. Confirmed (per
    Drew) as a field on the shared §2.14 envelope, so every account type
    can carry contributors, not only kidi accounts.
    """

    __tablename__ = "savings_account_contributors"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    account_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("savings_accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    contributors_name: Mapped[str] = mapped_column(String(150), nullable=False)

    relationship_to_child: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    amount_contributed: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    date_of_contribution: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    account: Mapped["SavingsAccount"] = relationship(back_populates="contributors")

