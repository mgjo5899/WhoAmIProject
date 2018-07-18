from sqlalchemy_utils.functions import create_database, drop_database
from sqlalchemy_utils.functions import database_exists
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail
import re

from models.base import Base, engine, get_db_url, Session
from models.user import User


HASH_METHOD = 'sha256'
SECRET_KEY = 'my_precious'
SECURITY_PASSWORD_SALT = 'my_precious_two'

# Regular expression search related
def valid_email_format(email):
    result = re.fullmatch('([a-zA-Z0-9\-%_\+]+(\.[a-zA-Z0-9\-%_\+]+)*)@([a-zA-Z0-9\-]+)\.([a-zA-Z0-9\-]{2,})', email)

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
    session = Session()
    meta = Base.metadata

    for table in reversed(meta.sorted_tables):
        if engine.dialect.has_table(engine, table.name):
            print('Clear table {}'.format(table.name))
            session.execute(table.delete())
    session.commit()
    session.close()

def reset_db():
    if not database_exists(get_db_url()):
        create_new_database()

    erase_tables()
    create_tables()


# Hashing related
def get_pw_hash(password):
    return generate_password_hash(password, HASH_METHOD)[7:]

def check_pw_hash(hash_str, password):
    return check_password_hash(hash_str, password)


# Confirmation token related
def generate_email_token(email):
    serializer = URLSafeTimedSerializer(SECRET_KEY)
    return serializer.dumps(email, salt=SECURITY_PASSWORD_SALT)

def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(SECRET_KEY)
    try:
        email = serializer.loads(
            token,
            salt=SECURITY_PASSWORD_SALT,
            max_age=expiration
        )
    except:
        return False
    return email
