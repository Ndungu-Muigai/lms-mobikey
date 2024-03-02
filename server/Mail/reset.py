import sib_api_v3_sdk
from config import AppConfig
from dotenv import load_dotenv
import os

load_dotenv()

configuration=sib_api_v3_sdk.Configuration()
configuration.api_key["api-key"] = os.environ["SENDINBLUE_API_KEY"]
api_instance=sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

def send_otp(email, otp, first_name, last_name):
    subject="One Time Password"
    sender={"name": AppConfig.SENDER_NAME, "email": AppConfig.SENDER_EMAIL}

    content=f"""
    <p style="color: black;">Greetings {first_name} {last_name},</p>
    <p style="color: black;">Your One-Time Password (OTP) is: <b>{otp}</b></p>
    <b style="color: black;">This OTP expires after 15minutes. Kindly use it before then.</b>
    <p style="color: black;">Please use this OTP to reset your account password</p>
    <b style="color: black;">If this request was not initiated by you, please <a href='https://mobikey-lms.vercel.app/' target='_blank'>update your password</a> immediately to protect your account</b>
	"""
    to= [{"name": f"{first_name} {last_name}", "email": email}]
    send_email=sib_api_v3_sdk.SendSmtpEmail(to=to, html_content=content,sender=sender, subject=subject)

    api_instance.send_transac_email(send_email)