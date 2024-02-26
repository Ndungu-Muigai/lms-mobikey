from app import app
from models import Employee, LeaveApplication, LeaveDays, db

if __name__ == "__main__":
    with app.app_context():
        print("Seed file")
        # Employee.query.delete()
        # LeaveApplication.query.delete()
        # LeaveDays.query.delete()
        # db.session.commit()

        # new_employee=Employee(first_name="Samuel",last_name="Muigai", gender="Male", email="muigaisam65@gmail.com", username="smuigai", section="Mobikey", department="Logistics", position="Logistics Assistant", role="HR", password="214aaf2c9a8510d948555ee25cb38397")
        # db.session.add(new_employee)
        # db.session.commit()

        # new_leave_days=LeaveDays(employee_id=1, normal_leave=21, sick_leave=14, maternity_leave=0, paternity_leave=14)
        # db.session.add(new_leave_days)
        # db.session.commit()