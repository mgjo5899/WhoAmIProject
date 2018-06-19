from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from db.user import User
from db.base import Session
from utils import HASH_METHOD
from utils import get_pw_hash, check_pw_hash

# GOOD
def check_user(username, password=None):
    session = Session()
    rtn_val = {}
    user = session.query(User).filter(User.username == username).first()

    # No user with the given username
    if user == None:
        rtn_val['status'] = False
        rtn_val['error'] = "There is no user with the given username"
    # Password is not matching
    elif password != None:
        hash_str = '{}${}'.format(HASH_METHOD, user.password)

        if not check_pw_hash(hash_str, password):
            rtn_val['status'] = False
            rtn_val['error'] = "The given password does not match with the user's password"

    if 'error' not in rtn_val:
        rtn_val['status'] = True

    session.close()

    return rtn_val

# GOOD
def register_user(username, password, email):
    session = Session()
    rtn_val = {}

    if check_user(username)['status']:
        rtn_val['status'] = False
        rtn_val['error'] = "Given username already exists"
    else:
        # Hashing
        hashed_pw = get_pw_hash(password)

        new_user = User(username=username, email=email, password=hashed_pw)
        session.add(new_user)
        session.commit()

        rtn_val['status'] = True

    session.close()

    return rtn_val

# Good
def signin_user(username, password):
    return check_user(username, password=password)

# Good
def get_users():
    session = Session()
    rtn_val = {}
    users = session.query(User).all()
    
    rtn_val['status'] = True
    rtn_val['users'] = []

    for user in users:
        curr_user = {}
        curr_user['username'] = user.username
        curr_user['email'] = user.email
        rtn_val['users'].append(curr_user)

    session.close()

    return rtn_val

# Good
def delete_user(username, password):
    session = Session()
    rtn_val = check_user(username, password)

    if rtn_val['status']:
        user = session.query(User).filter(User.username == username).first()
        session.delete(user)
        session.commit()
        rtn_val['deleted_user'] = {}
        rtn_val['deleted_user']['username'] = user.username
        rtn_val['deleted_user']['email'] = user.email

    session.close()

    return rtn_val

# Good
def modify_password(username, password, new_password):
    session = Session()
    rtn_val = check_user(username, password)

    if check_user(username):
        user = session.query(User).filter(User.username == username).first()
        
        # Hashing
        hashed_pw = get_pw_hash(new_password)
        user.password = hashed_pw
        session.commit()

    session.close()

    return rtn_val
