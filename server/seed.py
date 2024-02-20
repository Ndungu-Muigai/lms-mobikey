from app import app
from models import Employee, LeaveApplication, LeaveDays, db

if __name__ == "__main__":
    with app.app_context():
        # Employee.query.delete()
        LeaveApplication.query.delete()
        # LeaveDays.query.delete()

        # employees=[]

        # employees.append(Employee(first_name="Samuel", last_name="Muigai", gender="Male", username="smuigai", email="test@test.com", section="Mobikey", department="IT", position="Software Engineer", role="User", password="1234"))
        # employees.append(Employee(first_name="John", last_name="Doe", gender="Male", username="jdoe1", email="test1@test.com", section="Mobikey", department="IT", position="Software Engineer", role="HOD", password="1234"))
        # employees.append(Employee(first_name="Jane", last_name="Doe", gender="Female", username="jdoe2", email="test2@test.com", section="Mobikey", department="HR", position="HR Manager", role="HR", password="1234"))
        # employees.append(Employee(first_name="General", last_name="Manager", gender="Female", username="gmanager", email="test3@test.com", section="Mobikey", department="Admin", position="General Manager", role="GM", password="1234"))

        # db.session.add_all(employees)

        # normal_leave=21
        # sick_leave=14

        # leave_days=[]
        # for employee in employees:
        #     if employee.gender == "Male":
        #         leave_days.append(LeaveDays(employee=employee, normal_leave=normal_leave, sick_leave=sick_leave, paternity_leave=14, maternity_leave=0))

        #     elif employee.gender == "Female":
        #         leave_days.append(LeaveDays(employee=employee, normal_leave=normal_leave, sick_leave=sick_leave, paternity_leave=0, maternity_leave=90))

        # db.session.add_all(leave_days)
        # db.session.commit()
