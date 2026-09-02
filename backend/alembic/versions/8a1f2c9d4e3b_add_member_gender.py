"""add member gender

Revision ID: 8a1f2c9d4e3b
Revises: 66f708606bb1
Create Date: 2026-08-31 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '8a1f2c9d4e3b'
down_revision: Union[str, Sequence[str], None] = '66f708606bb1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "members",
        sa.Column(
            "gender",
            sa.String(length=30),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("members", "gender")