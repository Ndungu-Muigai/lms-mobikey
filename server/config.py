from dotenv import load_dotenv
import os
import redis

load_dotenv()

class AppConfig:
    #Configuring the session
    SECRET_KEY=os.environ["SECRET_KEY"]
    SESSION_TYPE="redis"
    SESSION_PERMANENT=True
    SESSION_USER_SIGNER=False
    SESSION_REDIS=redis.from_url("redis://127.0.0.1:6379")

    #Configuring the database
    SQLALCHEMY_TRACK_MODIFICATION=False
    SQLALCHEMY_ECHO=False
    SQLALCHEMY_DATABASE_URI="sqlite:///lms.db"

    #Configuring the file uploads
    UPLOAD_FOLDER='/Uploads'