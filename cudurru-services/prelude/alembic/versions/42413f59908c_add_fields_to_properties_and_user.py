"""Add fields to properties and user

Revision ID: 42413f59908c
Revises: 4d5296ae69df
Create Date: 2020-11-04 12:09:40.189179

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42413f59908c'
down_revision = '4d5296ae69df'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('property_bases', sa.Column('address1', sa.String(), nullable=True))
    op.add_column('property_bases', sa.Column('address2', sa.String(), nullable=True))
    op.add_column('property_bases', sa.Column('bathroom_count', sa.Float(), nullable=True))
    op.add_column('property_bases', sa.Column('bedroom_count', sa.Integer(), nullable=True))
    op.add_column('property_bases', sa.Column('city', sa.String(), nullable=True))
    op.add_column('property_bases', sa.Column('description', sa.String(), nullable=True))
    op.add_column('property_bases', sa.Column('square_footage', sa.Integer(), nullable=True))
    op.add_column('property_bases', sa.Column('state', sa.String(), nullable=True))
    op.add_column('users', sa.Column('name', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'name')
    op.drop_column('property_bases', 'state')
    op.drop_column('property_bases', 'square_footage')
    op.drop_column('property_bases', 'description')
    op.drop_column('property_bases', 'city')
    op.drop_column('property_bases', 'bedroom_count')
    op.drop_column('property_bases', 'bathroom_count')
    op.drop_column('property_bases', 'address2')
    op.drop_column('property_bases', 'address1')
    # ### end Alembic commands ###
