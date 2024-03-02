import sib_api_v3_sdk
from config import AppConfig
from dotenv import load_dotenv
import os

load_dotenv()

configuration=sib_api_v3_sdk.Configuration()
configuration.api_key["api-key"] = os.environ["SENDINBLUE_API_KEY"]
api_instance=sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

def send_login_credentials(first_name, last_name, email, username, password):
    subject="Login credentials"
    sender={"name": AppConfig.SENDER_NAME, "email": AppConfig.SENDER_EMAIL}
    email_content=f"""
    <p>Dear {first_name} {last_name},</p>
    <p>Your Leave Management System account has been created successfully.</p>
    <p>Use the login credentials below to login: </p>
    <h4>Username: {username}</h4>
    <h4>Password: {password}</h4>
    <h4>Login Link: <a href='https://mobikey-lms.vercel.app/' target='_blank'>Leave Management System</a></h4>
    <b>Kindly do not share your login details</b><br><br>

    <b>NB:This is an system generated email. Please DO NOT reply to this email thread.</b>
    """

    to= [{"name": f"{first_name} {last_name}", "email": email}]

    send_email=sib_api_v3_sdk.SendSmtpEmail(to=to, html_content=email_content,sender=sender, subject=subject)

    api_instance.send_transac_email(send_email)
