from models import db, LeaveDays
from app import app

def update_leave_days():
    leave_days=LeaveDays.query.all()

    for leave_day in leave_days:
        #Geting the employee details for the leave day
        employee=leave_day.employee

        #Setting the normal and sick leave days
        leave_day.normal_leave+=21
        leave_day.sick_leav=14

        #Checking the employee's gender and updating the leave days accordingly
        if employee.gender == "Male":
            leave_day.paternity_leave=14
            leave_day.maternity_leave=0

        elif employee.gender == "Female":
            leave_day.paternity_leave=0
            leave_day.maternity_leave=90
            
        #Adding the changes
        db.session.add(leave_day)

    #Committing the changes
    db.session.commit()

with app.app_context():
    update_leave_days()