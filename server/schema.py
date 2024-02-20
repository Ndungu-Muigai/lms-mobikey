from marshmallow import Schema, fields

class EmployeeSchema(Schema):
    id=fields.Integer()
    first_name=fields.Str(required=True)
    last_name=fields.Str(required=True)
    email=fields.Email(required=True)
    gender=fields.Str(required=True)
    department=fields.Str(required=True)
    section=fields.Str(required=True)
    position=fields.Str(required=True)
    role=fields.Str(required=True)

class LeaveDaysSchema(Schema):
    # employee=fields.Nested(EmployeeSchema(only=("first_name", "last_name")), required=True)
    normal_leave=fields.Float(required=True)
    sick_leave=fields.Float(required=True)
    maternity_leave=fields.Float(required=True)
    paternity_leave=fields.Float(required=True)

class LeaveApplicationsSchema(Schema):
    employee=fields.Nested(EmployeeSchema(only=("first_name", "last_name")), required=True)
    id=fields.Integer(required=True)
    leave_type=fields.Str(required=True)
    leave_duration=fields.Str(required=True)
    start_date=fields.Date(required=True)
    end_date=fields.Date(required=True)
    total_days=fields.Float(required=True)
    file_attachment=fields.Str(required=True)
    reason=fields.Str(required=True)
    hod_status=fields.Str(required=True)
    hr_status=fields.Str(required=True)
    gm_status=fields.Str(required=True)