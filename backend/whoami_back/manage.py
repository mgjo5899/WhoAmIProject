import time

from models.user import User
from models.base import db
from utils import HASH_METHOD
from utils import get_pw_hash, check_pw_hash


def signin_user(email, password, hashed=False):
    rtn_val = {}
    user = db.query(User).filter(User.email == email).first()

    # No user with the given username
    if user == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no user with the given email address"
    else:
        if not hashed:
            hash_str = '{}${}'.format(HASH_METHOD, user.password)

            if not check_pw_hash(hash_str, password):
                rtn_val['status'] = False
                rtn_val['message'] = "Could not log into the account with the given password"
        elif hashed and password != user.password:
            rtn_val['status'] = False

        if 'status' not in rtn_val:
            rtn_val['status'] = True
            rtn_val['username'] = user.username
            rtn_val['confirmed'] = user.confirmed
            rtn_val['pw'] = user.password

    return rtn_val

def check_username(username):
    rtn_val = {}
    user = db.query(User).filter(User.username == username).first()

    # No user with the given username
    if user == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no user with the given username"
    else:
        rtn_val['status'] = True

    return rtn_val

def check_email(email):
    rtn_val = {}
    user = db.query(User).filter(User.email == email).first()

    # No user with the given username
    if user == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no user with the given email address"
    else:
        rtn_val['status'] = True

    return rtn_val

def confirm_email(email):
    rtn_val = check_email(email)

    if rtn_val['status']:
        user = db.query(User).filter(User.email == email).first()
        user.confirmed = True
        user.confirmed_on = time.strftime('%Y-%m-%d %H:%M:%S')
        db.commit()

    return rtn_val

def register_user(username, password, email):
    rtn_val = {}

    if check_email(email)['status']:
        rtn_val['status'] = False
        rtn_val['message'] = "The given email already exists"
    elif check_username(username)['status']:
        rtn_val['status'] = False
        rtn_val['message'] = "The given username already exists"
    else:
        # Hashing
        hashed_pw = get_pw_hash(password)

        new_user = User(username=username, email=email, password=hashed_pw)
        db.add(new_user)
        db.commit()

        rtn_val['status'] = True

    return rtn_val

def get_users():
    rtn_val = {}
    users = db.query(User).all()
    
    rtn_val['status'] = True
    rtn_val['users'] = []

    for user in users:
        curr_user = {}
        curr_user['email'] = user.email
        curr_user['username'] = user.username
        curr_user['registered_on'] = user.registered_on
        curr_user['confirmed'] = user.confirmed
        rtn_val['users'].append(curr_user)

    return rtn_val

def delete_user(email, password):
    rtn_val = signin_user(email, password)

    if rtn_val['status']:
        user = db.query(User).filter(User.email == email).first()
        session.delete(user)
        session.commit()
        rtn_val['deleted_user'] = {}
        rtn_val['deleted_user']['username'] = user.username
        rtn_val['deleted_user']['email'] = user.email

    return rtn_val

def modify_password(email, new_password):
    rtn_val = check_email(email)

    if rtn_val['status']:
        user = db.query(User).filter(User.email == email).first()
        
        # Hashing
        hashed_pw = get_pw_hash(new_password)
        user.password = hashed_pw
        session.commit()

    return rtn_val
