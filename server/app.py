from flask import Flask, make_response, request, jsonify, session
from config import AppConfig
from flask_migrate import Migrate
from models import db, Employee, LeaveDays, LeaveApplication
from flask_restful import Api, Resource
from schema import EmployeeSchema, LeaveDaysSchema, LeaveApplicationsSchema
from password import random_password
import hashlib
from datetime import datetime
from werkzeug.utils import secure_filename
import uuid as uuid
import os
from sqlalchemy import or_

app=Flask(__name__)
app.config.from_object(AppConfig)

#Initializing the migration
migrate=Migrate(app, db)
db.init_app(app)

#Wrapping the app as an API instance
api=Api(app)

class Index(Resource):
    def get(self):
        return random_password()

api.add_resource(Index, "/")

class Login(Resource):
    def post(self):
        #Getting the infprmation from the form
        username=request.json["username"].lower()
        password=request.json["password"]

        #Querying the database to check if the employee exists based on the username
        employee=Employee.query.filter_by(username=username).first()

        #If the username doesn't exists, return an error
        if not employee:
            return make_response(jsonify({"error": "Incorrect username!"}), 409)
        
        #If the password is incorrect, return an error
        elif employee.password!= hashlib.md5(password.encode("utf-8")).hexdigest():
            return make_response(jsonify({"error": "Incorrect password!"}), 409)
        
        session["employee_id"]=employee.id
        session["employee_role"]=employee.role
        session["employee_department"]=employee.department
        return make_response(jsonify({"success": "Login successful!"}))

api.add_resource(Login, "/login")

class Dashboard(Resource):
    def get(self):
        employee_id=session.get("employee_id")

        if employee_id:
            #Counting the leave applications and returning the response to the front end
            total_requests = LeaveApplication.query.filter(LeaveApplication.employee_id == employee_id).count()
            approved_requests = LeaveApplication.query.filter(
                LeaveApplication.employee_id == employee_id,
                LeaveApplication.hod_status == "Approved",
                LeaveApplication.hr_status == "Approved",
                LeaveApplication.gm_status == "Approved"
            ).count()
            rejected_requests = LeaveApplication.query.filter(
                LeaveApplication.employee_id == employee_id,
                (LeaveApplication.hod_status == "Rejected") |
                (LeaveApplication.hr_status == "Rejected") |
                (LeaveApplication.gm_status == "Rejected")
            ).count()
            pending_requests = LeaveApplication.query.filter(
            LeaveApplication.employee_id == employee_id,
            (
                (LeaveApplication.hod_status == "Pending") |
                (LeaveApplication.hr_status == "Pending") |
                (LeaveApplication.gm_status == "Pending")
            )
            ).count()

            employee=Employee.query.filter_by(id=employee_id).first()

            return make_response(jsonify(
                {
                    "success": "Logged in successfully",
                    "full_name": employee.full_name(),
                    "role": session.get("employee_role"),
                    "leave_days":
                    {
                        "total_requests": total_requests,
                        "approved_requests": approved_requests,
                        "rejected_requests":  rejected_requests,
                        "pending_requests": pending_requests
                    }
                }
            ))

        else:
            return make_response(jsonify({"error": "Kindly login to continue"}))
        
api.add_resource(Dashboard, "/home")

class Profile(Resource):
    def get(self):
        employee_id=session.get("employee_id")

        if not employee_id:
            return make_response(jsonify({"error": "Kindly login to continue"}), 404)

        employee=Employee.query.filter(Employee.id==employee_id).first()
        employee_details=EmployeeSchema().dump(employee)
        return make_response(employee_details, 200)

api.add_resource(Profile, "/profile")

class LeaveApplications(Resource):

    def get(self):
        employee_id=session.get("employee_id")
        leave_applications=LeaveApplication.query.filter_by(employee_id=employee_id).all()
        leave_applications_dict=LeaveApplicationsSchema().dump(leave_applications,many=True)
        return make_response(leave_applications_dict, 200)
    
    def post(self):

        employee_id=session.get("employee_id")

        #Getting the values from the front-end
        leave_type=request.json["leave_type"]
        leave_duration=request.json["leave_duration"]
        start_date=datetime.strptime(request.json["start_date"], '%Y-%m-%d').date()
        end_date=datetime.strptime(request.json["end_date"], '%Y-%m-%d').date()
        total_days=request.json["total_days"]
        reason=request.json["reason"]

        if not request.json["file_attachment"]:

            #Checking if an application with the same exists
            application=LeaveApplication.query.filter(or_(LeaveApplication.start_date==start_date, LeaveApplication.end_date==end_date)).first()

            if application:
                return make_response(jsonify({"error": "An application with the given dates already exists"}),409)
            
            new_application=LeaveApplication(leave_type=leave_type, leave_duration=leave_duration, start_date=start_date, end_date=end_date, total_days=total_days, reason=reason, employee_id=employee_id)
            db.session.add(new_application)
            db.session.commit()
            return make_response(jsonify({"success": "Application submitted successfully!"}), 201)

        else:
            print(secure_filename(request.json["file_attachment"]))
        # file_attachment=request.files["file_attachment"]

        # if file_attachment:

        #     #Getting the file name of the file attachment
        #     file_name=secure_filename(file_attachment.filename)

        #     #Generating a unigue ID for each file name (makes the filename unique)
        #     unique_file_name=str(uuid.uuid1()) + "_" + file_name

        #     #Saving the application files to the respective folder based on the leave type
        #     file_attachment.save(os.path.join(f"{app.config['UPLOAD_FOLDER']}/{leave_type}"), unique_file_name)

        #     #Saving the unique filename to the database by assigning it to the file attachment variable
        #     file_attachment=unique_file_name

        #     new_application=LeaveApplication(leave_type=leave_type, leave_duration=leave_duration, start_date=start_date, end_date=end_date, total_days=total_days, reason=reason, file_attachment=file_attachment, employee_id=employee_id)
        #     print(new_application)

        

        # new_application=LeaveApplication(leave_type=leave_type, leave_duration=leave_duration, start_date=start_date, end_date=end_date, total_days=total_days, reason=reason, employee_id=employee_id)
        # print(new_application)

api.add_resource(LeaveApplications, "/leave-applications")

class Employees(Resource):
    def get(self):

        employee_role=session.get("employee_role")
        
        if employee_role != "HR":
            return make_response(jsonify({"error": "You do not have the rights to do that"}), 405)
        
        employees=Employee.query.all()
        employee_dict=EmployeeSchema().dump(employees, many=True)
        return make_response(jsonify(
            {
                "success": "You have access rights",
                "employee_data": employee_dict
            }
        ), 200)
    
    def post(self):
        first_name=request.json["first_name"]
        last_name=request.json["last_name"]
        email=request.json["email"]
        gender=request.json["gender"]
        department=request.json["department"]
        section=request.json["section"]
        position=request.json["position"]
        role=request.json["role"]

        username=(first_name[0]+last_name).lower()
        password=random_password()

        if Employee.query.filter_by(email=email).first():
            return make_response(jsonify({"error" : "Email already exists"}),409)
        
        elif Employee.query.filter_by(username=username).first():
            return make_response(jsonify({"error" : "Username already exists"}),409)
        
        hashed_password=hashlib.md5(password.encode("utf-8")).hexdigest()
        new_employee=Employee(first_name=first_name, username=username, password=hashed_password, last_name=last_name, gender=gender, department=department, section=section, role=role, position=position, email=email)
        print(password)

        #Creating an employee's leave days once their account is created
        if new_employee.gender=="Male":
            leave_days=LeaveDays(employee=new_employee,normal_leave=21, sick_leave=14, paternity_leave=14, maternity_leave=0)

        elif new_employee.gender == "Female":
            leave_days=LeaveDays(employee=new_employee,normal_leave=21, sick_leave=14, paternity_leave=0, maternity_leave=90)

        db.session.add_all([new_employee, leave_days])
        db.session.commit()
        employee=EmployeeSchema().dump(new_employee)
        return make_response(jsonify(
            {
                "success": "Employee account created successfully",
                "employee_data": employee
            }
        ), 201)
    
api.add_resource(Employees, "/employees-data")

class EmployeeByID(Resource):

    def get(self, id):
        #Getting the individual employee
        employee=Employee.query.filter_by(id=id).first()
        #Getting the employee's leave days from the leave days table
        employee_leave_days=LeaveDays.query.filter_by(employee_id=id).first()
        #Creating a dict for the employee's details
        employee_dict=EmployeeSchema().dump(employee)
        #Creating a dict for the employee's leave days
        leave_days_dict=LeaveDaysSchema().dump(employee_leave_days)
        #Creating a response dict that combines both the employee's details and his/her leave days
        response_dict={}
        response_dict.update(employee_dict)
        response_dict.update(leave_days_dict)
        return make_response(response_dict, 200)
    
    def patch(self, id):
        #Querying the database to check if the employee exists
        employee_to_update=Employee.query.filter_by(id=id).first()

        #If the employee doesn't exist, return an error
        if not employee_to_update:
            return make_response(jsonify({"error": "Employee not found"}), 404)
        
        #Getting the value from the form
        normal_leave=request.json["normal_leave"]
        sick_leave=request.json["sick_leave"]

        #If the current leave days is equal to the value being passed, return an error
        if employee_to_update.leave_days.normal_leave == normal_leave or employee_to_update.leave_days.sick_leave == sick_leave:
            return make_response(jsonify({"error": "The current leave days count cannot be equal to the value provided"}), 409)
        
        #Updating the value of the employee's normal leave days
        employee_to_update.leave_days.normal_leave=normal_leave
        employee_to_update.leave_days.sick_leave=sick_leave
        db.session.add(employee_to_update)
        db.session.commit()

        return make_response(jsonify({"success": "Leave days updated successfully!"}), 200)

api.add_resource(EmployeeByID, "/employees-data/<int:id>")

class Days(Resource):
    def get(self):
        leave_days=LeaveDays.query.all()
        leave_days_dict=LeaveDaysSchema().dump(leave_days, many=True)
        return make_response(leave_days_dict, 200)

api.add_resource(Days, "/leave-days")

class Logout(Resource):
    def post(self):
        session.clear()
        return make_response(jsonify({"success": "Logged out successfully"}), 200)
    
api.add_resource(Logout, "/logout")

if __name__=="__main__":
    app.run(port=5555, debug=True)