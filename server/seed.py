from app import app
from models import Employee, LeaveApplication, LeaveDays, db

if __name__ == "__main__":
    with app.app_context():
        print("Seed file")
        # Employee.query.delete()
        # LeaveApplication.query.delete()
        # LeaveDays.query.delete()
        # db.session.commit()