from sqlalchemy import and_
from datetime import datetime

from whoami_back.models.user import User
from whoami_back.models.authorized_medium import AuthorizedMedium
from whoami_back.models.instagram_data import InstagramData
from whoami_back.models.whiteboard_data import WhiteboardData
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

def get_whiteboard_data(username=None, email=None, medium=None):
    user = {}

    if username != None:
        user = get_user(username=username)
    elif email != None:
        user = get_user(email=email)
    else:
        user = {'status', False}
        user['message'] = "Could not find username or email"

    if user['status'] == False:
        return user

    authorized_media = []
    user_email = user['data']['email']
    rtn_val = {}

    for curr in db.query(AuthorizedMedium).filter(AuthorizedMedium.email == user_email).all():
        authorized_media.append(curr.medium)

    whiteboard_data = []

    # Keep adding new type of social medium
    if (medium == None or medium == 'instagram') and 'instagram' in authorized_media:
        whiteboard_contents = db.query(WhiteboardData).filter(and_(\
                                       WhiteboardData.email == user_email,\
                                       WhiteboardData.medium == 'instagram',\
                                       WhiteboardData.status != 3)).all()

        for content in whiteboard_contents:
            curr_insta_data = {}
            curr_insta_data['id'] = content.id
            curr_insta_data['type'] = content.type
            curr_insta_data['medium'] = content.medium
            curr_insta_data['pos_x'] = content.pos_x
            curr_insta_data['pos_y'] = content.pos_y
            curr_insta_data['last_modified'] = content.last_modified
            curr_insta_data['status'] = content.status

            insta_content = db.query(InstagramData).filter(InstagramData.whiteboard_data_id == content.id).first()

            if insta_content == None:
                print("Something is wrong! There is a whiteboard data for \
                        the following content but there's no Instagram data")
                print('curr_insta_data:', curr_insta_data)
            else:
                curr_insta_data['raw_content_url'] = insta_content.raw_content_url
                curr_insta_data['instagram_url'] = insta_content.instagram_url
                curr_insta_data['orig_width'] = insta_content.orig_width
                curr_insta_data['orig_height'] = insta_content.orig_height
                curr_insta_data['curr_width'] = insta_content.curr_width
                curr_insta_data['curr_height'] = insta_content.curr_height
                whiteboard_data.append(curr_insta_data)

    rtn_val['status'] = True
    rtn_val['whiteboard_data'] = whiteboard_data

    return rtn_val

def mark_content_unavailable(content_id):
    rtn_val = {}

    content = db.query(WhiteboardData).filter(whiteboardData.id == content_id).first()

    if content:
        content.status = 3
        content.last_modified = datetime.now()
        db.commit()

        rtn_val['status'] = True
        rtn_val['message'] = "Successfully marked the content as unavailable"
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find the content with the given content id"
    rtn_val['id'] = content_id

    return rtn_val

def add_instagram_content(email, type, pos_x, pos_y, raw_content_url, instagram_url, \
                                            orig_width, orig_height, curr_width, curr_height):
    rtn_val = {}

    # TODO: Find a way to make this query faster
    if db.query(InstagramData).filter(InstagramData.raw_content_url == raw_content_url).first():
        rtn_val['status'] = False
        rtn_val['message'] = "The given raw content URL already exists"
    else:
        rtn_val['status'] = True

        # TODO: Find a way to group these queries into a single session (single DB interaction)
        new_whiteboard_content = WhiteboardData(email=email, type=type, medium='instagram', status=1,\
                                                pos_x=pos_x, pos_y=pos_y)
        db.add(new_whiteboard_content)
        db.commit()

        # TODO: Find a way to get generated ID instantly once the whiteboard data has been added
        whiteboard_data_id = new_whiteboard_content.id

        new_instagram_content = InstagramData(whiteboard_data_id=whiteboard_data_id, \
                                              raw_content_url=raw_content_url, \
                                              instagram_url=instagram_url, \
                                              orig_width=orig_width, orig_height=orig_height, \
                                              curr_width=curr_width, curr_height=curr_height)
        db.add(new_instagram_content)
        db.commit()

        rtn_val['id'] = whiteboard_data_id

    rtn_val['medium'] = 'instagram'
    rtn_val['email'] = email

    return rtn_val

def update_instagram_content(email, whiteboard_data_id, pos_x=None, pos_y=None, curr_width=None, curr_height=None):
    rtn_val = {'id':whiteboard_data_id, 'email':email}

    whiteboard_data = db.query(WhiteboardData).filter(and_(WhiteboardData.email == email, \
                                                           WhiteboardData.id == whiteboard_data_id)).first()

    if whiteboard_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no whiteboard data with the given id for the given user"
    else:
        instagram_data = db.query(InstagramData).filter(InstagramData.whiteboard_data_id == whiteboard_data_id).first()

        if instagram_data == None:
            rtn_val['status'] = False
            rtn_val['message'] = "There is no instagram data with the given id for the given user"
        else:
            instagram_data.curr_width = curr_width
            instagram_data.curr_height = curr_height
            whiteboard_data.pos_x = pos_x
            whiteboard_data.pos_y = pos_y
            whiteboard_data.last_modified = datetime.now()
            db.commit()

            rtn_val['status'] = True
            rtn_val['medium'] = 'instagram'

    return rtn_val

def delete_instagram_content(whiteboard_data_id):
    rtn_val = {}

    instagram_data = db.query(InstagramData).filter(InstagramData.whiteboard_data_id == whiteboard_data_id).first()

    if instagram_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no instagram data with the given id for the given user"
    else:
        db.delete(instagram_data)
        db.commit()
        rtn_val['status'] = True
        rtn_val['medium'] = 'instagram'

    return rtn_val

def delete_whiteboard_content(email, whiteboard_data_id):
    rtn_val = {}

    whiteboard_data = db.query(WhiteboardData).filter(and_(WhiteboardData.email == email, \
                                                           WhiteboardData.id == whiteboard_data_id)).first()

    if whiteboard_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no whiteboard data with the given id for the given user"
    else:
        if whiteboard_data.medium == 'instagram':
            rtn_val = delete_instagram_content(whiteboard_data_id)

            if rtn_val['status'] == True:
                db.delete(whiteboard_data)
                db.commit()

    rtn_val['id'] = whiteboard_data_id
    rtn_val['email'] = email

    return rtn_val

def update_whiteboard_content(email, update):
    rtn_val = {}

    if 'medium' not in update or 'id' not in update:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find medium or id in the given data"
    else:
        if update['medium'] == 'instagram':
            rtn_val = update_instagram_content(email, update['id'], update['pos_x'], update['pos_y'], \
                                               update['curr_width'], update['curr_height'])
        else:
            # Medium provided not found
            rtn_val['message'] = "Could not find the given medium"
            rtn_val['status'] = False

    return rtn_val

def add_whiteboard_content(email, new_content):
    rtn_val = {}

    if 'medium' not in new_content:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find medium in the given data"
    else:
        if new_content['medium'] == 'instagram':
            if not ('type' in new_content and 'pos_x' in new_content and 'pos_y' in new_content \
                    and 'instagram_specific' in new_content):
                rtn_val['status'] = False
                rtn_val['message'] = "Not enough information for a new whiteboard content"
            else:
                insta_data = new_content['instagram_specific']

                if not ('raw_content_url' in insta_data and 'instagram_url' in insta_data and \
                        'orig_width' in insta_data and 'orig_height' in insta_data and \
                        'curr_width' in insta_data and 'curr_height' in insta_data):
                    rtn_val['status'] = False
                    rtn_val['message'] = "Not enough information for a instagram content"
                else:
                    rtn_val = add_instagram_content(email,
                                                    new_content['type'],
                                                    new_content['pos_x'],
                                                    new_content['pos_y'],
                                                    insta_data['raw_content_url'],
                                                    insta_data['instagram_url'],
                                                    insta_data['orig_width'],
                                                    insta_data['orig_height'],
                                                    insta_data['curr_width'],
                                                    insta_data['curr_height'])
        else:
            # Medium provided not found
            rtn_val['message'] = "Could not find the given medium"
            rtn_val['status'] = False

    return rtn_val

def get_medium(email, medium):
    return db.query(AuthorizedMedium).filter(and_(AuthorizedMedium.email == email,\
                                              AuthorizedMedium.medium == medium)).first()

def register_medium(medium, email, access_token):
    rtn_val = {}

    if get_user(email=email)['status'] == False:
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

def get_user(username=None, email=None):
    rtn_val = {}

    if username != None:
        user = db.query(User).filter(User.username == username).first()
    elif email != None:
        user = db.query(User).filter(User.email == email).first()
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find username or email"

    if user == None:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find a user with the given information"
    else:
        rtn_val['status'] = True
        rtn_val['data'] = {}
        rtn_val['data']['email'] = user.email
        rtn_val['data']['username'] = user.username
        rtn_val['data']['registered_on'] = user.registered_on
        rtn_val['data']['confirmed'] = user.confirmed
        rtn_val['data']['confirmed_on'] = user.confirmed_on

    return rtn_val

def confirm_email(email):
    user = get_user(email=email)
    rtn_val = {}

    if user['status']:
        rtn_val['status'] = True
        rtn_val['message'] = "Email confirmed"
        user = db.query(User).filter(User.email == email).first()
        user.confirmed = True
        user.confirmed_on = datetime.now()
        db.commit()
    else:
        rtn_val = user

    return rtn_val

def register_user(username, password, email):
    rtn_val = {}

    if get_user(email=email)['status']:
        rtn_val['status'] = False
        rtn_val['message'] = "The given email already exists"
    elif get_user(username=username)['status']:
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
    user = get_user(email=email)
    rtn_val = {}

    if user['status']:
        rtn_val['status'] = True
        rtn_val['message'] = "Password modified successfully"
        user = db.query(User).filter(User.email == email).first()
        
        # Hashing
        hashed_pw = get_pw_hash(new_password)
        user.password = hashed_pw
        rtn_val['hashed_new_pw'] = hashed_pw
        db.commit()
    else:
        rtn_val = user

    return rtn_val
