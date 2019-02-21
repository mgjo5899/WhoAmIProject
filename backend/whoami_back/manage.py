from sqlalchemy import and_
from datetime import datetime

from whoami_back.models.user import User
from whoami_back.models.authorized_medium import AuthorizedMedium
from whoami_back.models.instagram_data import InstagramData
from whoami_back.models.base import db
from whoami_back.config import HASH_METHOD
from whoami_back.utils import get_pw_hash, check_pw_hash


def get_authorized_medium(email):
    rtn_val = {}

    authorized_media = db.query(AuthorizedMedium).filter(AuthorizedMedium.email == email).all()

    if len(authorized_media) > 0:
        rtn_val['status'] = True
        rtn_val['authorized_medium'] = []

        for authorized_medium in authorized_media:
            curr_medium = {}
            curr_medium['email'] = email
            curr_medium['medium'] = authorized_medium.medium
            curr_medium['access_token'] = authorized_medium.access_token
            curr_medium['authorized_time'] = authorized_medium.authorized_time
            rtn_val['authorized_medium'].append(curr_medium)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find any authorized medium for the user with the given email"

    return rtn_val

def get_medium_access_token(email, medium):
    rtn_val = {}

    target_medium = get_medium(email, medium)

    if target_medium:
        rtn_val['status'] = True
        rtn_val['access_token'] = target_medium.access_token
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find target medium for the user with the given email"

    return rtn_val

def update_instagram_image(email, image_id, width, height, pos_x, pos_y, angle):
    rtn_val = {}

    image = db.query(InstagramData).filter(and_(InstagramData.email == email,\
                                                InstagramData.id == image_id)).first()

    if image == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no image with the image_id for the user"
        rtn_val['image_id'] = image_id
    else:
        image.width = width
        image.height = height
        image.pos_x = pos_x
        image.pos_y = pos_y
        image.angle = angle
        image.last_modified = datetime.now()
        db.commit()

        rtn_val['status'] = True
        rtn_val['modified_image'] = {}
        rtn_val['modified_image']['image_id'] = image_id
        rtn_val['modified_image']['last_modified'] = str(image.last_modified)

    return rtn_val

def delete_instagram_image(email, image_id):
    rtn_val = {}

    image = db.query(InstagramData).filter(and_(InstagramData.email == email,\
                                                InstagramData.id == image_id)).first()

    if image == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no image of the user with the image_id"
        rtn_val['image_id'] = image_id
    else:
        db.delete(image)
        db.commit()
        rtn_val['status'] = True
        rtn_val['deleted_image'] = {}
        rtn_val['deleted_image']['image_id'] = image.id
        rtn_val['deleted_image']['raw_image_url'] = image.raw_image_url

    return rtn_val

def add_new_instagram_image(email, image_id, instagram_url, raw_image_url, orig_width, orig_height):
    rtn_val = {}

    if db.query(InstagramData).filter(and_(InstagramData.id==image_id,\
                                           InstagramData.email==email)).first():
        rtn_val['status'] = False
        rtn_val['message'] = "Image already added"
    else:
        new_image = InstagramData(id=image_id, email=email,\
                                  instagram_url=instagram_url, raw_image_url=raw_image_url,\
                                  orig_width=orig_width, orig_height=orig_height)
        db.add(new_image)
        db.commit()

        rtn_val['status'] = True
    rtn_val['image_id'] = image_id

    return rtn_val

def get_medium(email, medium):
    return db.query(AuthorizedMedium).filter(and_(AuthorizedMedium.email == email,\
                                              AuthorizedMedium.medium == medium)).first()

def register_medium(medium, email, access_token):
    rtn_val = {}

    if check_email(email)['status'] == False:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find a user with the given email"
    else:
        target_medium = get_medium(email, medium)
        print('target_medium: ', target_medium)
        rtn_val['status'] = True

        if target_medium != None:
            # Overwrite the access_token and authorized time
            print('Found an existing authorization')
            target_medium.access_token = access_token
            target_medium.authorized_time = datetime.now()
            rtn_val['message'] = "Successfully updated Instagram access token for the user"
        else:
            # Need a new registration in the AuthorizedMedium table
            print('Authorizing a new medium')
            new_medium = AuthorizedMedium(email=email, medium='instagram', access_token=access_token)
            db.add(new_medium)
            rtn_val['message'] = "Successfully registered Instagram account for the user"
        db.commit()

    return rtn_val

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
            rtn_val['message'] = "Could not log into the account with the given password"

        if 'status' not in rtn_val:
            rtn_val['status'] = True
            rtn_val['user'] = {}
            rtn_val['user']['username'] = user.username
            rtn_val['user']['confirmed'] = user.confirmed
            rtn_val['user']['email'] = user.email
            rtn_val['user']['registered_on'] = user.registered_on
            rtn_val['user']['pw'] = user.password

    return rtn_val

def check_username_with_email(username, email):
    rtn_val = {}
    user = db.query(User).filter(and_(User.username == username, User.email == email)).first()

    if user == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no user with the given email and username"
    else:
        rtn_val['status'] = True

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
        user.confirmed_on = datetime.now()
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
        curr_user['registered_on'] = str(user.registered_on)
        curr_user['confirmed'] = user.confirmed
        rtn_val['users'].append(curr_user)

    return rtn_val

def delete_user(email, password):
    rtn_val = signin_user(email, password)

    if rtn_val['status']:
        user = db.query(User).filter(User.email == email).first()
        db.delete(user)
        db.commit()
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
        rtn_val['hashed_new_pw'] = hashed_pw
        db.commit()

    return rtn_val
