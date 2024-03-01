"""Added a default time of now to the timestamp attribute of the OTP table

Revision ID: 42e2a1eac39d
Revises: 282363632ae0
Create Date: 2024-03-01 20:22:33.256297

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42e2a1eac39d'
down_revision = '282363632ae0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('otp', schema=None) as batch_op:
        batch_op.alter_column('timestamp',
               existing_type=sa.DATE(),
               type_=sa.DateTime(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('otp', schema=None) as batch_op:
        batch_op.alter_column('timestamp',
               existing_type=sa.DateTime(),
               type_=sa.DATE(),
               existing_nullable=True)

    # ### end Alembic commands ###
