"""Added a firstLogin boolean attribute

Revision ID: 39b66a46f667
Revises: a6d77d6dc09a
Create Date: 2024-02-29 10:48:33.234412

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '39b66a46f667'
down_revision = 'a6d77d6dc09a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('employees', schema=None) as batch_op:
        batch_op.add_column(sa.Column('first_login', sa.Boolean(), nullable=True))
        batch_op.drop_column('firstLogin')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('employees', schema=None) as batch_op:
        batch_op.add_column(sa.Column('firstLogin', sa.BOOLEAN(), nullable=True))
        batch_op.drop_column('first_login')

    # ### end Alembic commands ###