"""Renamed the user id column in the leave applications table to employee id

Revision ID: cbf3d7c2f899
Revises: 
Create Date: 2024-02-15 18:02:46.838815

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cbf3d7c2f899'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('employees',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.Column('gender', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('section', sa.String(), nullable=False),
    sa.Column('department', sa.String(), nullable=False),
    sa.Column('position', sa.String(), nullable=False),
    sa.Column('role', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('leave_applications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.Integer(), nullable=True),
    sa.Column('leave_type', sa.Enum('Sick Leave', 'Maternity Leave', 'Paternity Leave'), nullable=False),
    sa.Column('leave_duration', sa.String(), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=False),
    sa.Column('end_date', sa.Date(), nullable=False),
    sa.Column('total_days', sa.Float(), nullable=False),
    sa.Column('file_attachment', sa.String(), nullable=False),
    sa.Column('reason', sa.String(), nullable=True),
    sa.Column('hod_status', sa.Enum('Pending', 'Approved', 'Rejected'), nullable=False),
    sa.Column('hr_status', sa.Enum('Pending', 'Approved', 'Rejected'), nullable=False),
    sa.Column('gm_status', sa.Enum('Pending', 'Approved', 'Rejected'), nullable=False),
    sa.ForeignKeyConstraint(['employee_id'], ['employees.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('leave_days',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('employee_id', sa.Integer(), nullable=False),
    sa.Column('normal_leave', sa.Float(), nullable=False),
    sa.Column('sick_leave', sa.Float(), nullable=False),
    sa.Column('maternity_leave', sa.Float(), nullable=False),
    sa.Column('paternity_leave', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['employee_id'], ['employees.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('leave_days')
    op.drop_table('leave_applications')
    op.drop_table('employees')
    # ### end Alembic commands ###
