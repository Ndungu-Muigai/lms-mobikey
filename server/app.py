from flask import Flask, make_response, request, jsonify, session, send_from_directory
from config import AppConfig
from flask_migrate import Migrate
from models import db, Employee, LeaveDays, LeaveApplication, OneTimePassword   
from flask_restful import Api, Resource
from schema import EmployeeSchema, LeaveDaysSchema, LeaveApplicationsSchema
import hashlib
from datetime import datetime, date, timedelta
from werkzeug.utils import secure_filename
import uuid as uuid
import os
from Mail.credentials import send_login_credentials
from Mail.reset import send_otp
from Generations.password import random_password
from Generations.otp import get_otp

app=Flask(__name__)
app.config.from_object(AppConfig)
app.static_folder = 'static' 
#Initializing the migration
migrate=Migrate(app, db)
db.init_app(app)

#Wrapping the app as an API instance
api=Api(app)

#Login resource
class Login(Resource):
    def post(self):
        #Getting the infprmation from the form
        username=request.json["username"].lower() #Converting username to lower case in case user enters the username in all caps
        password=request.json["password"]

        #Querying the database to check if the employee exists based on the username
        employee=Employee.query.filter_by(username=username).first()

        #If the username doesn't exists, return an error
        if not employee:
            return make_response(jsonify({"error": "Incorrect username!"}), 409)
        
        #If the password is incorrect, return an error
        elif employee.password!= hashlib.md5(password.encode("utf-8")).hexdigest():
            return make_response(jsonify({"error": "Incorrect password!"}), 409)
        
        #Creating sessions that will be used later on in the program 
        session["employee_id"]=employee.id
        session["employee_role"]=employee.role
        session["employee_department"]=employee.department
        session["employee_section"]=employee.section

        #Returning a success message once a user is successfully authenticated
        return make_response(jsonify(
            {
                "success": "Login successful!",
                "first_login": employee.first_login
            }))

api.add_resource(Login, "/login")

#Resource to update password
class UpdatePassword(Resource):
    def post(self):

        #Getting the ID of the employee
        employee_id=session.get("employee_id")

        #Getting the form data
        password=request.json["new_password"]
        confirm_password=request.json["confirm_password"]

        #Checking if both passwords match
        if password != confirm_password:
            return make_response(jsonify({"error": "Passwords do not match"}), 409)

        #Getting the employee details
        employee=Employee.query.filter(Employee.id == employee_id).first()

        #Hashing the password
        hashed_password=hashlib.md5(password.encode("utf-8")).hexdigest()

        #Checking if the new password is equal to the password in the databse
        if employee.password == hashed_password:
            return make_response(jsonify({"error": "New password cannot be the same as the current password"}), 409)

        #Updating the employee's password
        employee.password=hashed_password

        #Checking the employee's first_login status and updating it to false if it is true
        if employee.first_login:
            employee.first_login=False

        #AAdding and committing the changes to the database
        db.session.add(employee)
        db.session.commit()

        #Returning a success response
        return make_response(jsonify({"success": "Password updated successfully! Redirecting to the dashboard."}),201)

api.add_resource(UpdatePassword, "/update-password")

#OTP Generation Resource
class GenerateOTP(Resource):
    def post(self):

        #Getting the email from the front end
        email=request.json["email"]

        #Checking if the email exists in the database. If it doesn't exist, return an error
        employee_record=Employee.query.filter_by(email=email).first()

        if not employee_record:
            print('Not there')
            return make_response(jsonify({"error": "No account with the given email exists!"}), 404)

        #If email exists, generate a OTP
        otp=get_otp()

        #Querying the OTP database to check if an OTP exists. If it exists, replace it with a new one
        existing_otp = OneTimePassword.query.filter_by(email=email).first()

        if existing_otp:
            existing_otp.otp=otp
            existing_otp.timestamp=datetime.now()

        else:
            #Adding the OTP to the database
            new_otp=OneTimePassword(email=email, otp=otp)
            db.session.add(new_otp)

        db.session.commit()
            
        #Sending the OTP to the user's email
        send_otp(email=email, otp=otp, last_name=employee_record.last_name, first_name=employee_record.first_name)

        #Returning a success message
        return make_response(jsonify({"success": "OTP generated successfully! Kindly check your email"}))

api.add_resource(GenerateOTP, "/generate-otp")

#Resource to update the password after OTP generation
class UpdatePasswordOTP(Resource):
    def post(self):

        #Getting the data from the front end
        otp=request.json['otp']
        new_password=request.json['new_password']
        confirm_password=request.json['confirm_password']

        #Checking if the OTP exists
        otp=OneTimePassword.query.filter_by(otp=otp).first()

        if not otp:
            return make_response(jsonify({"error": "The entered OTP does not exist!"}), 404)
        
        #Checking if the timestamp is greater than 15 minutes. If it exceeds, delete the OTP and return an error
        if datetime.now() - otp.timestamp > timedelta(minutes=15):
            db.session.delete(otp)
            db.session.commit()
            return make_response(jsonify({"error": "OTP has already expired"}), 409)


        # Checking if the two passwords match. If not, return an error
        if new_password != confirm_password:
            return make_response(jsonify({"error": "Passwords do not match!"}), 400)

        #Checking if the newly entered passwords is equal to the current password
        employee=Employee.query.filter_by(email=otp.email).first()
        
        hashed_password=hashlib.md5(new_password.encode("utf-8")).hexdigest()

        if employee.password == hashed_password:
            return make_response(jsonify({"error": "The new password cannot be equal to the current password"}), 409)
        
        else:
            #If not, update the password and delete the otp
            employee.password=hashed_password
            db.session.add(employee)
            db.session.delete(otp)
            db.session.commit()

            #Returning a success message
            return make_response(jsonify({"success": "Password updated successfully!"}))

api.add_resource(UpdatePasswordOTP, "/update-password-with-otp")

#Dashboard resource
class Dashboard(Resource):
    def get(self):

        #Getting the ID of the current logged in user
        employee_id=session.get("employee_id")

        #If a user is not logged in, return an error
        if not employee_id:
            return make_response(jsonify({"error": "Kindly login to continue"}))

        #If a user is logged in, fetch his/her data

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

        #Getting the currently logged in employee so that we can return his.her full name
        employee=Employee.query.filter_by(id=employee_id).first()

        #Getting today's date to only filter applications who's start date is greater than or equal to today in the upcoming department leave's table
        today_date=date.today()

        #Getting upcoming department leaves
        upcoming = LeaveApplication.query.join(Employee).filter(Employee.department == employee.department, LeaveApplication.start_date >= today_date, LeaveApplication.hod_status=="Approved", LeaveApplication.gm_status=="Approved", LeaveApplication.hr_status=="Approved").all()
        upcoming_schema=LeaveApplicationsSchema(only=("id" ,"employee","start_date", "end_date","total_days")).dump(upcoming, many=True)

        #Creating the response to the front end
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
                },
                "upcoming_leave": upcoming_schema
            }
        ))

api.add_resource(Dashboard, "/home")

#Leave applications resource
class LeaveApplications(Resource):
    def get(self):

        #Get the currently logged in user
        employee_id=session.get("employee_id")

        #Get the user's leave applications and create a dict of it
        leave_applications=LeaveApplication.query.filter_by(employee_id=employee_id).all()
        leave_applications_dict=LeaveApplicationsSchema(only=("id",'leave_type',"leave_duration","start_date", "end_date")).dump(leave_applications,many=True)

        #Get the user's leave days from the database and create a dict
        leave_days=LeaveDays.query.filter_by(employee_id=employee_id).first()
        leave_days_dict=LeaveDaysSchema().dump(leave_days, many=False)

        #Getting the current logged in employee in order to get their gender
        employee=Employee.query.filter_by(id=employee_id).first()

        #Create a response
        return make_response(jsonify(
            {
                "leave_days": leave_days_dict,
                "leave_applications": leave_applications_dict,
                "gender": employee.gender
            }
        ),200)
    
    def post(self):

        # Get the employee ID from the session
        employee_id = session.get("employee_id")

        # Getting the values from the form
        leave_type = request.form.get("leave_type")
        leave_duration = request.form.get("leave_duration")
        start_date = datetime.strptime(request.form.get("start_date"), '%Y-%m-%d').date()
        end_date = datetime.strptime(request.form.get("end_date"), '%Y-%m-%d').date()
        total_days = request.form.get("total_days")
        reason = request.form.get("reason")
        file_attachment=request.files.get("file_attachment")

        #Querying the database to check if the leave application exists
        leaveapplication=LeaveApplication.query.filter_by(
            employee_id=employee_id, 
            start_date=start_date,
            end_date=end_date,
            leave_type=leave_type,
            leave_duration=leave_duration
            ).first()
        
        #If application exists, return an error
        if leaveapplication:
            return make_response(jsonify({"error": "An application with the given details already exists"}), 409)
        
        #Checking if the leave days being requested are greater than the number of leave days the employee has
        leave_days=LeaveDays.query.filter_by(employee_id=employee_id).first()

        if leave_type == "Normal":
            days_balance= float(leave_days.normal_leave) - float(total_days)

            #If leave balance is less than or equal to 0, return error. Else, update the leave days table
            if days_balance <= 0:
                return make_response(jsonify({"error": "You do not have enough leave days"}), 409)

            leave_days.normal_leave=days_balance

        elif leave_type == "Sick":
            days_balance= float(leave_days.sick_leave) - float(total_days)

            if days_balance <= 0:
                return make_response(jsonify({"error": "You do not have enough leave days"}), 409)
            
            leave_days.sick_leave=days_balance

        elif leave_type == "Paternity":
            days_balance= float(leave_days.paternity_leave) - float(total_days)

            if days_balance <= 0:
                return make_response(jsonify({"error": "You do not have enough leave days"}), 409)
            
            leave_days.paternity_leave=days_balance

        elif leave_type == "Maternity":
            days_balance= float(leave_days.maternity_leave) - float(total_days)

            if days_balance <= 0:
                return make_response(jsonify({"error": "You do not have enough leave days"}), 409)
            
            leave_days.maternity_leave=days_balance

        #If there is a file attachment, generate a unique file name and save it to the Uploads folder
        if file_attachment:

            #Getting the file name of the file attachment
            file_name=secure_filename(file_attachment.filename)

            #Generating a unigue ID for each file name (makes the filename unique)
            unique_file_name=str(uuid.uuid1()) + "_" + file_name

            #Saving the application files to the respective folder based on the leave type
            file_attachment.save(os.path.join(f"{app.config['UPLOAD_FOLDER']}/{leave_type}", unique_file_name))

            #Saving the unique filename to the database by assigning it to the file attachment variable
            file_attachment=unique_file_name

        #Checking if the employee is either a HOD, HR or GM and updating those fields accordingly
        employee_role=session.get("employee_role")
        if employee_role == "HOD":
            new_application=LeaveApplication(leave_type=leave_type, leave_duration=leave_duration, start_date=start_date, end_date=end_date, total_days=total_days, reason=reason, file_attachment=file_attachment, employee_id=employee_id, hod_status="Approved")

        elif employee_role== "HR":
            new_application=LeaveApplication(leave_type=leave_type, leave_duration=leave_duration, start_date=start_date, end_date=end_date, total_days=total_days, reason=reason, file_attachment=file_attachment, employee_id=employee_id, hod_status="Approved", hr_status="Approved")

        else:
            new_application=LeaveApplication(leave_type=leave_type, leave_duration=leave_duration, start_date=start_date, end_date=end_date, total_days=total_days, reason=reason, file_attachment=file_attachment, employee_id=employee_id)

        #Adding the changes made to the leave days and the newly created leave application
        db.session.add_all([new_application, leave_days])
        db.session.commit()

        #Creating a response
        return make_response(jsonify(
            {
                "success": "Application submitted successfully",
                "application": LeaveApplicationsSchema().dump(new_application)
            }), 200)

api.add_resource(LeaveApplications, "/leave-applications")

#Individual leave application resource
class LeaveApplicationByID(Resource):
    def get(self, id):

        #Querying the database to get the specific application
        leave_application=LeaveApplication.query.filter_by(id=id).first()

        #If no application exists, return an error
        if not leave_application:
            return make_response(jsonify({"error": "Leave application could not be found"}), 404)
        
        #Creating a response dict for that specific application
        leave_application_dict=LeaveApplicationsSchema(only=("id", "leave_type","leave_duration", "start_date","end_date","total_days", "file_attachment","reason","hod_status","gm_status","hr_status")).dump(leave_application)

        #Creating a response
        return make_response(leave_application_dict, 200)

api.add_resource(LeaveApplicationByID, "/leave-applications/<int:id>")

#All employee leave requests
class AllRequests(Resource):
    def get(self):
        #Getting all the requests
        leave_requests=LeaveApplication.query.all()

        #Looping over all the requests and updating the status variable
        request_list=[]
        for request in leave_requests:
            if request.hod_status or request.hr_status or request.gm_status == "Rejected":
                request.status="Rejected"
                request_list.append(request)

            elif request.hod_status == "Pending" or request.hr_status == "Pending" or request.gm_status=="Pending":
                request.status="Pending"
                request_list.append(request)

            elif request.hod_status == "Approved" and request.hr_status == "Approved" and request.gm_status=="Approved":
                request.status="Approved"
                request_list.append(request)

        #Creating a dict of the requests
        leave_requests_dict=LeaveApplicationsSchema(only=("id","employee", "leave_type", "leave_duration","start_date", "end_date", "total_days","file_attachment","status")).dump(request_list, many=True)

        return make_response(leave_requests_dict, 200)

api.add_resource(AllRequests, "/employee-requests")

#All pending employee requests
class PendingEmployeeRequests(Resource):
    def get(self):
        #Getting the session data which will be used to query the leave applications table
        employee_id=session.get("employee_id")
        role=session.get("employee_role")
        department=session.get("employee_department")
        section=session.get("employee_section")

        #Displaying the requests based on the user's role
        if role == "HOD":
            pending_requests = LeaveApplication.query.join(Employee).filter(
                LeaveApplication.hod_status == "Pending",
                LeaveApplication.employee_id != employee_id,
                Employee.department == department,
                Employee.section == section
            ).all()

        elif role == "GM":
            pending_requests = LeaveApplication.query.join(Employee).filter(
                LeaveApplication.hod_status == "Approved",
                LeaveApplication.gm_status == "Pending",
                LeaveApplication.employee_id != employee_id,
                # Employee.section == section
            ).all()

        elif role == "HR":
            pending_requests = LeaveApplication.query.filter(
                LeaveApplication.hod_status == "Approved",
                LeaveApplication.gm_status == "Approved",
                LeaveApplication.hr_status == "Pending",
                LeaveApplication.employee_id != employee_id,
            ).all()

        #Creating a response will the fetched requests
        return make_response(LeaveApplicationsSchema().dump(pending_requests, many=True), 200)
    
api.add_resource(PendingEmployeeRequests, "/pending-employee-requests")

#Individual pending employee requests 
class PendingEmployeeRequestsByID(Resource):
    def get(self, id):
        #Querying the database to get the individual request and creating a dict of it
        request=LeaveApplication.query.filter_by(id=id).first()
        response=LeaveApplicationsSchema().dump(request)
        
        #If a file attachment exists, return the file path
        if request and request.file_attachment:
            file_path = f"Uploads/{request.leave_type}/{request.file_attachment}"  
            response["file_attachment"] = file_path

        return make_response(response, 200)
    
    #Patch request to update the request
    def patch(self, id):
        #Getting the approval status (Approved or Rejected) from the frontend
        status=request.json["status"]
        #Getting the role of the currently logged in employee
        role=session.get("employee_role")
        
        #Getting the request from the database
        application=LeaveApplication.query.filter_by(id=id).first()

        #Updating the status based on the logged in user's role
        if role == "HOD":
            if status == "Rejected":
                application.hod_status=status
                application.hr_status=status
                application.gm_status=status

            application.hod_status=status
        
        elif role == "GM":
            if status == "Rejected":
                application.hr_status=status
                application.gm_status=status
            
            application.gm_status=status
        
        elif role == "HR":
            application.hr_status=status

        db.session.add(application)
        db.session.commit()

        #Returning a success message for approved requests
        if status == "Approved":
            return make_response(jsonify({"success": "Leave application approved successfully"}),200)

        #If the status is rejected, get the employee id from the leave application, query the leave days table and add back the number of leave days of that application
        elif status == "Rejected":
            employee_id=application.employee_id
            leave_days=LeaveDays.query.filter_by(employee_id=employee_id).first()

            if application.leave_type == "Normal":
                leave_days.normal_leave= float(leave_days.normal_leave) + float(application.total_days)

            elif application.leave_type == "Sick":
                leave_days.sick_leave= float(leave_days.sick_leave) + float(application.total_days)

            elif application.leave_type == "Paternity":
                leave_days.paternity_leave= float(leave_days.paternity_leave) + float(application.total_days)
            
            elif application.leave_type == "Maternity":
                leave_days.maternity_leave= float(leave_days.maternity_leave) + float(application.total_days)

            db.session.add(leave_days)
            db.session.commit()
            return make_response(jsonify({"success": "Leave application rejected successfully"}),200)

api.add_resource(PendingEmployeeRequestsByID, "/pending-employee-requests/<int:id>")

#File fetching resource
class GetFile(Resource):
    def get(self, filename):
        return send_from_directory('static', filename)

api.add_resource(GetFile, "/static/<path:filename>")

#All employees resource
class Employees(Resource):
    def get(self):
        #Getting the employee id
        employee_id=session.get("employee_id")

        #Getting the role of the currently logged in user
        employee_role=session.get("employee_role")
        
        #If the role is not HR, return an error
        if employee_role != "HR":
            return make_response(jsonify({"error": "You do not have the rights to do that"}), 405)
        
        #Getting all employees from the database and creating a dict 
        employees=Employee.query.filter(Employee.id != employee_id).all()
        employee_dict=EmployeeSchema().dump(employees, many=True)
        return make_response(jsonify(
            {
                "success": "You have access rights",
                "employee_data": employee_dict
            }
        ), 200)
    
    def post(self):

        #Getting the data from the form
        first_name=request.json["first_name"]
        last_name=request.json["last_name"]
        email=request.json["email"]
        gender=request.json["gender"]
        department=request.json["department"]
        section=request.json["section"]
        position=request.json["position"]
        role=request.json["role"]

        #Creating a username and a random password
        username=(first_name[0]+last_name).lower()
        password=random_password()

        #Checking if the email exists in the database. If it does, return an error
        if Employee.query.filter_by(email=email).first():
            return make_response(jsonify({"error" : "Email already exists"}),409)
        
        #Checking if the username exists in the database. If it does, return an error
        elif Employee.query.filter_by(username=username).first():
            return make_response(jsonify({"error" : "Username already exists"}),409)
        
        #Creating the account details
        hashed_password=hashlib.md5(password.encode("utf-8")).hexdigest()
        new_employee=Employee(first_name=first_name, username=username, password=hashed_password, last_name=last_name, gender=gender, department=department, section=section, role=role, position=position, email=email)

        #Sending the email with the login credentials
        send_login_credentials(last_name=last_name, username=username, first_name=first_name, email=email, password=password)

        #Creating an employee's leave days once their account is created
        if new_employee.gender=="Male":
            leave_days=LeaveDays(employee=new_employee,normal_leave=21, sick_leave=14, paternity_leave=14, maternity_leave=0)

        elif new_employee.gender == "Female":
            leave_days=LeaveDays(employee=new_employee,normal_leave=21, sick_leave=14, paternity_leave=0, maternity_leave=90)

        #Committing the info to the database
        db.session.add_all([new_employee, leave_days])
        db.session.commit()

        #Creating a dict of the newly created account and including it in the response
        employee=EmployeeSchema().dump(new_employee)

        return make_response(jsonify(
            {
                "success": "Employee account created successfully",
                "employee_data": employee
            }
        ), 201)
    
api.add_resource(Employees, "/employees-data")

#Resource for fetching specific employee's data
class EmployeeByID(Resource):

    def get(self, id):
        #Getting the individual employee
        employee=Employee.query.filter_by(id=id).first()

        #Displaying an error message if the employee doesn't exist
        if not employee:
            return make_response(jsonify({"error": "Employee not found"}), 404)
        
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

        #If the current leave days is equal to the value being passed, return an error
        if employee_to_update.leave_days.normal_leave == normal_leave :
            return make_response(jsonify({"error": "The current leave days count cannot be equal to the value provided"}), 409)
        
        #Updating the value of the employee's normal leave days
        employee_to_update.leave_days.normal_leave=normal_leave
        db.session.add(employee_to_update)
        db.session.commit()

        return make_response(jsonify({"success": "Leave days updated successfully!"}), 200)
    
    def delete(self, id):

        #Getting the employee from the database
        employee_to_delete=Employee.query.filter_by(id=id).first()
        
        #If employee doesn't exist, return an error
        if not employee_to_delete:
            return make_response(jsonify({"error": "Employee could not be found"}),404)

        #Deleting the employee's details
        db.session.delete(employee_to_delete.leave_days)

        #Looping over the leave applications and deleting them individually
        for leave_application in employee_to_delete.leave_applications:
            db.session.delete(leave_application)
            
        #Deleting the employee and committing the changes
        db.session.delete(employee_to_delete)
        db.session.commit()

        return make_response(jsonify(
            {
                "success": "Employee deleted successfully!"
            }),200)

api.add_resource(EmployeeByID, "/employees-data/<int:id>")


#Profile resource
class Profile(Resource):
    def get(self):
        #Getting the ID of the current logged in user
        employee_id=session.get("employee_id")

        #If no one is logged in, return an error
        if not employee_id:
            return make_response(jsonify({"error": "Kindly login to continue"}), 404)

        #Get the employee's details from the database if they are logged in
        employee=Employee.query.filter(Employee.id==employee_id).first()
        employee_details=EmployeeSchema().dump(employee)
        return make_response(employee_details, 200)
    
    #Password update functionality in the profile page
    def post(self):

        #Getting the attributes from the form
        current_password=request.json["current_password"]
        new_password=request.json["new_password"]
        confirm_password=request.json["confirm_password"]

        #Getting the current logged in employee
        employee=Employee.query.filter(Employee.id==session.get("employee_id")).first()

        #Hashing the password 
        hashed_password=hashlib.md5(new_password.encode()).hexdigest()

        #Checking if the value of current password is not equal to the password in the database
        if employee.password != hashlib.md5(current_password.encode()).hexdigest():
            return make_response(jsonify({"error": "Incorrect current password. Please try again."}), 409)
        
        #Checking if the new and confirm passwords match
        if  new_password!=confirm_password:
            return make_response(jsonify({"error":"The new password and current passwords do not match!"}), 409)
        
        #Checking if the new hashed password is equal to the value of the password in the database
        if employee.password == hashed_password:
            return make_response(jsonify({"error": "The new password cannot be the same as the current password."}), 409)
        
        #Updating the password
        employee.password = hashed_password
        db.session.add(employee)
        db.session.commit()

        return make_response(jsonify({"success": "Password updated successfully"}))

api.add_resource(Profile, "/profile")

#Logout resource
class Logout(Resource):
    def post(self):
        #Clear all sessions
        session.clear()

        #Return a response
        return make_response(jsonify({"success": "Logged out successfully"}), 200)
    
api.add_resource(Logout, "/logout")

if __name__=="__main__":
    app.run(port=5555, debug=True)