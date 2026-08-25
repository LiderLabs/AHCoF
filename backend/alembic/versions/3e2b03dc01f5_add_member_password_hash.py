"""add member password hash

Revision ID: 3e2b03dc01f5
Revises: d6e15c724143
Create Date: 2026-08-22 21:15:39.907671

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3e2b03dc01f5'
down_revision: Union[str, Sequence[str], None] = 'd6e15c724143'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "members",
        sa.Column(
            "password_hash",
            sa.String(length=255),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("members", "password_hash")
