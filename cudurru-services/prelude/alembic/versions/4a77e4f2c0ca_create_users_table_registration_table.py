"""create users table + registration table

Revision ID: 4a77e4f2c0ca
Revises: 8b2ba63540da
Create Date: 2019-04-11 22:42:27.157376

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4a77e4f2c0ca'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(90), unique=True),
        sa.Column('email', sa.String(90), unique=True),
        sa.Column('password', sa.String(128)),
        sa.Column('activated_date', sa.DateTime),
        sa.Column('active_status', sa.Boolean, server_default='n'),
        sa.Column('reset_code', sa.String(32)),
        sa.Column('deactivated_date', sa.DateTime),
        sa.Column('created_date', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_date', sa.DateTime,
                  server_default=sa.func.now(), server_onupdate=sa.func.now()),
    )

    op.create_table(
        'registrations',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(50)),
        sa.Column('email', sa.String(50)),
        sa.Column('headers', sa.String(255)),
        sa.Column('deactivated_date', sa.DateTime),
        sa.Column('created_date', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_date', sa.DateTime,
                  server_default=sa.func.now(), server_onupdate=sa.func.now()),
    )

    op.create_table(
        'registration_codes',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('username', sa.String(50)),
        sa.Column('email', sa.String(50)),
        sa.Column('code', sa.String(32)),
        sa.Column('deactivated_date', sa.DateTime),
        sa.Column('created_date', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_date', sa.DateTime,
                  server_default=sa.func.now(), server_onupdate=sa.func.now()),
    )


def downgrade():
    op.execute("DROP TABLE IF EXISTS registrations")
    op.execute("DROP TABLE IF EXISTS users")
    op.execute("DROP TABLE IF EXISTS registration_codes")
