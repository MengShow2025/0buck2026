"""celery dead letters

Revision ID: 0003_celery_dead_letters
Revises: 0001_baseline
Create Date: 2026-04-12

"""

from alembic import op
import sqlalchemy as sa


revision = "0003_celery_dead_letters"
down_revision = "0001_baseline"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "celery_dead_letters",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("task", sa.String(length=200), nullable=False),
        sa.Column("task_id", sa.String(length=100), nullable=False),
        sa.Column("args", sa.JSON(), nullable=False),
        sa.Column("kwargs", sa.JSON(), nullable=False),
        sa.Column("error", sa.String(length=500), nullable=False),
        sa.Column("retries", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("max_retries", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("replayed", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("replayed_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()")),
    )
    op.create_index("ix_celery_dead_letters_task", "celery_dead_letters", ["task"], unique=False)
    op.create_index("ix_celery_dead_letters_task_id", "celery_dead_letters", ["task_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_celery_dead_letters_task_id", table_name="celery_dead_letters")
    op.drop_index("ix_celery_dead_letters_task", table_name="celery_dead_letters")
    op.drop_table("celery_dead_letters")

