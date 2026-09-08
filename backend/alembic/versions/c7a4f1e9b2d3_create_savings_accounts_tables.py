"""create savings accounts tables

Revision ID: c7a4f1e9b2d3
Revises: 8a1f2c9d4e3b
Create Date: 2026-09-08 00:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'c7a4f1e9b2d3'
down_revision: Union[str, Sequence[str], None] = '8a1f2c9d4e3b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'savings_accounts',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('member_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('account_number', sa.String(length=50), nullable=False),
        sa.Column('account_type', sa.String(length=30), nullable=False),
        sa.Column('account_status', sa.String(length=20), nullable=False),
        sa.Column('current_balance', sa.Integer(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('interest_earned', sa.Integer(), nullable=False),
        sa.Column('auto_transfer', sa.Boolean(), nullable=False),
        sa.Column('account_details', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['member_id'], ['members.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('account_number'),
    )
    op.create_index(op.f('ix_savings_accounts_member_id'), 'savings_accounts', ['member_id'], unique=False)
    op.create_index(op.f('ix_savings_accounts_account_number'), 'savings_accounts', ['account_number'], unique=False)

    op.create_table(
        'savings_contribution_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('account_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('contribution_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('amount_contributed', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['account_id'], ['savings_accounts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_savings_contribution_history_account_id'),
        'savings_contribution_history',
        ['account_id'],
        unique=False,
    )

    op.create_table(
        'savings_account_contributors',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('account_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('contributors_name', sa.String(length=150), nullable=False),
        sa.Column('relationship_to_child', sa.String(length=50), nullable=True),
        sa.Column('amount_contributed', sa.Integer(), nullable=False),
        sa.Column('date_of_contribution', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['account_id'], ['savings_accounts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_savings_account_contributors_account_id'),
        'savings_account_contributors',
        ['account_id'],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_savings_account_contributors_account_id'), table_name='savings_account_contributors')
    op.drop_table('savings_account_contributors')

    op.drop_index(op.f('ix_savings_contribution_history_account_id'), table_name='savings_contribution_history')
    op.drop_table('savings_contribution_history')

    op.drop_index(op.f('ix_savings_accounts_account_number'), table_name='savings_accounts')
    op.drop_index(op.f('ix_savings_accounts_member_id'), table_name='savings_accounts')
    op.drop_table('savings_accounts')

