"""create analytics table

Revision ID: create_analytics_table
Revises: 
Create Date: 2023-12-06 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'create_analytics_table'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create analytics table
    op.create_table(
        'analytics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('component_id', sa.Integer(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('view_count', sa.Integer(), nullable=True),
        sa.Column('last_viewed', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('is_favorite', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['component_id'], ['components.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes
    op.create_index(op.f('ix_analytics_component_id'), 'analytics', ['component_id'], unique=False)
    op.create_index(op.f('ix_analytics_user_id'), 'analytics', ['user_id'], unique=False)


def downgrade():
    # Drop indexes
    op.drop_index(op.f('ix_analytics_user_id'), table_name='analytics')
    op.drop_index(op.f('ix_analytics_component_id'), table_name='analytics')
    
    # Drop table
    op.drop_table('analytics') 