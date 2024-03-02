from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db=SQLAlchemy()

class Employee(db.Model):

    __tablename__="employees"

    id=db.Column(db.Integer, primary_key=True)
    first_name=db.Column(db.String, nullable=False)
    last_name=db.Column(db.String, nullable=False)
    gender=db.Column(db.String, nullable=False)
    email=db.Column(db.String, unique=True, nullable=False)
    username=db.Column(db.String, unique=True, nullable=False)
    section=db.Column(db.String, nullable=False)
    department=db.Column(db.String, nullable=False)
    position=db.Column(db.String, nullable=False)
    role=db.Column(db.String, nullable=False)
    password=db.Column(db.String, nullable=False)
    first_login=db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    leave_days=db.relationship("LeaveDays", backref="employee", uselist=False)
    leave_applications=db.relationship("LeaveApplication", backref="employee")

    def __repr__(self):
        return f"Employee name: {self.first_name} {self.last_name}\nEmail address: {self.email}\nGender: {self.gender}\nSection: {self.section}\nDepartment: {self.department}\nPosition: {self.position}"
    
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
class LeaveDays(db.Model):

    __tablename__="leave_days"

    id=db.Column(db.Integer, primary_key=True)
    employee_id=db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    normal_leave=db.Column(db.Float, nullable=False)
    sick_leave=db.Column(db.Float, nullable=False)
    maternity_leave=db.Column(db.Float, nullable=False)
    paternity_leave=db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"\nEmployee: {self.employee.full_name()}\nNormal: {self.normal_leave}\nSick: {self.sick_leave}\nMaternity: {self.maternity_leave}\nPaternity: {self.paternity_leave}"
    
class LeaveApplication(db.Model):

    __tablename__= "leave_applications"

    id = db.Column(db.Integer, primary_key=True)
    employee_id=db.Column(db.Integer, db.ForeignKey('employees.id'))
    leave_type=db.Column(db.Enum("Sick","Maternity","Paternity", "Normal"),nullable=False)	
    leave_duration=db.Column(db.String, nullable=False)
    start_date=db.Column(db.Date, nullable=False)
    end_date=db.Column(db.Date, nullable=False)
    total_days=db.Column(db.Float, nullable=False)
    file_attachment=db.Column(db.String, nullable=True)
    reason=db.Column(db.String, nullable=True)
    hod_status=db.Column(db.Enum("Pending", "Approved", "Rejected"), nullable=False, default="Pending")
    hr_status=db.Column(db.Enum("Pending", "Approved", "Rejected"), nullable=False, default="Pending")
    gm_status=db.Column(db.Enum("Pending", "Approved", "Rejected"), nullable=False, default="Pending")

class OneTimePassword(db.Model):

    __tablename__="otp"
    id=db.Column(db.Integer, primary_key=True)
    email=db.Column(db.String, nullable=False)
    otp=db.Column(db.String, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)
