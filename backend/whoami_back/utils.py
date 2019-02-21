from sqlalchemy_utils.functions import create_database
from sqlalchemy_utils.functions import database_exists
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer
from flask import request
from flask_mail import Message, Mail
import re
import json

from whoami_back.models.base import Base, engine, get_db_url, db
from whoami_back.models.user import User
from whoami_back.models.authorized_medium import AuthorizedMedium
import whoami_back.config as config


# Receive request data
def get_req_data():
    req = None

    if len(request.form) > 0:
        # Postman
        # request.data is empty with Postman
        print("Getting data from request.form")
        req = request.form
    elif len(request.data) > 0:
        # React
        # request.form is empty with react
        print("Getting data from request.data")
        req = json.loads(request.data.decode("utf-8"))
    elif len(request.args) > 0:
        # Redirect from social medium
        print("Getting data from request.args")
        req = {}

        for k in request.args.keys():
            req[k] = request.args.get(k)

    return req


# Sending email using SMTP server
mail = None

# Register application context to the mail object
def init_mail(app):
    global mail
    mail = Mail(app)

def send_email(email, template, subject):
    msg = Message(
            subject,
            recipients=[email],
            html=template
    )

    mail.send(msg)


# Regular expression search
def valid_email_format(email):
    result = re.fullmatch('([a-zA-Z0-9\-%_\+]+(\.[a-zA-Z0-9\-%_\+]+)*)@([a-zA-Z0-9\-]+)\.([a-zA-Z0-9\-]{2,})', \
                          email)

    if result == None:
        return False
    elif result.group(0) == email:
        return True


# DB related
def create_tables():
    print("Creating tables if not found")
    Base.metadata.create_all(bind=engine)

def create_new_database():
    print("Creating new whoamiproject database")
    create_database(get_db_url())

def db_checks():
    if not database_exists(get_db_url()):
        create_new_database()

    create_tables()

def db_close():
    engine.dispose()

def erase_tables():
    meta = Base.metadata

    for table in reversed(meta.sorted_tables):
        if engine.dialect.has_table(engine, table.name):
            print('Clear table {}'.format(table.name))
            db.execute(table.delete())

    db.commit()
    db.close()

def reset_db():
    if not database_exists(get_db_url()):
        create_new_database()

    erase_tables()
    create_tables()


# Hashing related
def get_pw_hash(password):
    return generate_password_hash(password, config.HASH_METHOD)[7:]

def check_pw_hash(hash_str, password):
    return check_password_hash(hash_str, password)


# Confirmation token related
def generate_email_token(email):
    serializer = URLSafeTimedSerializer(config.SECRET_KEY)
    return serializer.dumps(email, salt=config.SECURITY_PASSWORD_SALT)

def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(config.SECRET_KEY)
    try:
        email = serializer.loads(
            token,
            salt=config.SECURITY_PASSWORD_SALT,
            max_age=expiration
        )
    except:
        return False
    return email
