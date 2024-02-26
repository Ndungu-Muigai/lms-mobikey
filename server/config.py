from dotenv import load_dotenv
import os
import redis
from datetime import timedelta

load_dotenv()

class AppConfig:
    #Configuring the session
    SECRET_KEY=os.environ["SECRET_KEY"]
    SESSION_TYPE="redis"
    SESSION_PERMANENT=True
    SESSION_USER_SIGNER=False
    SESSION_REDIS=redis.from_url("redis://127.0.0.1:6379")
    PERMANENT_SESSION_LIFETIME=timedelta(minutes=30)

    #Configuring the database
    SQLALCHEMY_TRACK_MODIFICATION=False
    SQLALCHEMY_ECHO=False
    SQLALCHEMY_DATABASE_URI="sqlite:///lms.db"

    #Configuring the file uploads
    UPLOAD_FOLDER='./static/Uploads'

    #Email API configuration
    SENDINBLUE_API_KEY = "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"

    #Email sender congiguration
    SENDER_NAME = "Leave Management System"
    SENDER_EMAIL = "lms@mobikey.co.ke"