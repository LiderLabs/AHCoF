"""add member password hash

Revision ID: d6e15c724143
Revises: da856d8408a2
Create Date: 2026-08-22 15:44:57.400562

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = 'd6e15c724143'
down_revision: Union[str, Sequence[str], None] = 'da856d8408a2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass



def downgrade() -> None:
    """Downgrade schema."""
    pass

