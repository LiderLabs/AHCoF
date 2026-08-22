"""create members table

Revision ID: e9c5703e681f
Revises:
Create Date: 2026-08-18 15:35:10.681253

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'e9c5703e681f'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""

    op.create_table('members',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('membership_id', sa.String(length=50), nullable=False),
    sa.Column('first_name', sa.String(length=100), nullable=False),
    sa.Column('last_name', sa.String(length=100), nullable=False),
    sa.Column('phone_number', sa.String(length=20), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=True),
    sa.Column('church', sa.String(length=150), nullable=True),
    sa.Column('conference', sa.String(length=150), nullable=True),
    sa.Column('membership_status', sa.String(length=30), nullable=False),
    sa.Column('is_demo', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_members_membership_id'), 'members', ['membership_id'], unique=True)
    op.create_index(op.f('ix_members_phone_number'), 'members', ['phone_number'], unique=True)

def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(op.f('ix_members_phone_number'), table_name='members')
    op.drop_index(op.f('ix_members_membership_id'), table_name='members')
    op.drop_table('members')
