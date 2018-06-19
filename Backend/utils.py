from sqlalchemy_utils.functions import create_database, drop_database
from sqlalchemy_utils.functions import database_exists
import re

from db.base import Base, engine, get_db_url
from db.user import User

HASH_METHOD = 'sha256'

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
    Base.metadata.create_all(engine)

def create_new_database():
    print("Creating new whoamiproject database")
    create_database(get_db_url())

def rm_database():
    print("Removing whoamiproject database")
    drop_database(get_db_url())

def db_checks():
    if not database_exists(get_db_url()):
        create_new_database()

    create_tables()

def reset_db():
    if database_exists(db_url):
        rm_database()

    new_database()
    create_tables()

# Hashing related
def get_pw_hash(password):
    return sec.generate_password_hash(password, HASH_METHOD)[7:]

def check_pw_hash(has_str, password):
    return sec.check_password_hash(has_str, password)
