from sqlalchemy import and_
from datetime import datetime

from whoami_back.models.user import User
from whoami_back.models.authorized_medium import AuthorizedMedium
from whoami_back.models.instagram_data import InstagramData
from whoami_back.models.facebook_data import FacebookData
from whoami_back.models.whiteboard_data import WhiteboardData
from whoami_back.models.user_profile import UserProfile
from whoami_back.models.user_profile_data import UserProfileData
from whoami_back.models.follow import Follow
from whoami_back.models.base import db
from whoami_back.config import HASH_METHOD
from whoami_back.utils import get_pw_hash, check_pw_hash


def get_following_users(follower_username):
    follower = get_user(username=follower_username)
    rtn_val = {}

    if follower['status'] == False:
        rtn_val = follower
    else:
        follower = follower['data']
        following_users = db.query(Follow).filter(Follow.follower_username == \
                                                  follower['username']).all()
        rtn_val['status'] = True
        rtn_val['following_users'] = []

        for following_user in following_users:
            rtn_val['following_users'].append(following_user.followed_user_username)

    return rtn_val

def get_followers(followed_user_username):
    followed_user = get_user(username=followed_user_username)
    rtn_val = {}

    if followed_user['status'] == False:
        rtn_val = followed_user
    else:
        followed_user = followed_user['data']
        followers = db.query(Follow).filter(Follow.followed_user_username == \
                                            followed_user['username']).all()
        rtn_val['status'] = True
        rtn_val['followers'] = []

        for follower in followers:
            rtn_val['followers'].append(follower.follower_username)

    return rtn_val

def remove_follower(follower_username, followed_user_username):
    follower = get_user(username=follower_username)
    followed_user = get_user(username=followed_user_username)
    rtn_val = {}

    if follower['status'] == False or followed_user['status'] == False:
        rtn_val['status'] = False
        rtn_val['message'] = "Either the follower, the followed user, or both do not exist"
    else:
        follower = follower['data']
        followed_user = followed_user['data']
        follow_relationship = db.query(Follow).filter(\
                       and_(Follow.follower_username == follower['username'], \
                            Follow.followed_user_username == followed_user['username'])).first()
        if follow_relationship == None:
            rtn_val['status'] = False
            rtn_val['message'] = "Could not find the given following relationship with" + \
                                 " the given information"
        else:
            db.delete(follow_relationship)
            db.commit()
            rtn_val['status'] = True
            rtn_val['message'] = "Successfully removed the given follower"
            rtn_val['follower_username'] = follower['username']
            rtn_val['followed_user_username'] = followed_user['username']

    return rtn_val

# TODO: When the privacy comes in act, we should check whether the followed user is public,
#       If it's not public account, then there needs to be a pending request phase of the follow 
#       system.
def add_follower(follower_username, followed_user_username):
    rtn_val = {}
    follower = get_user(username=follower_username)
    followed_user = get_user(username=followed_user_username)

    if follower['status'] == False or followed_user['status'] == False:
        rtn_val['status'] = False
        rtn_val['message'] = "Either the follower, the followed user, or both do not exist"
    elif follower['data']['username'] == followed_user['data']['username']:
        rtn_val['status'] = False
        rtn_val['message'] = "A user cannot follow himself/ herself"
    else:
        follower = follower['data']
        followed_user = followed_user['data']
        existing_follower = db.query(Follow).filter(\
                     and_(Follow.follower_username == follower['username'], \
                          Follow.followed_user_username == followed_user['username'])).first()

        if existing_follower == None:
            new_follower = Follow(followed_user_username=followed_user['username'], \
                                  follower_username=follower['username'])
            db.add(new_follower)
            db.commit()
            
            rtn_val['status'] = True
            rtn_val['message'] = "Successfully added a follower"
            rtn_val['follower_username'] = follower_username
            rtn_val['followed_user_username'] = followed_user_username
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "The given following relationship already exists."

    return rtn_val

def get_user_profile(email=None, username=None, internal_use=False):
    user = None
    rtn_val = {}

    if email == None and username == None:
        rtn_val['status'] = False
        rtn_val['message'] = "Missing necessary information"
    else:
        if email != None:
            user = get_user(email=email)
        else: # username != None
            user = get_user(username=username)

        if user['status'] == False:
            rtn_val = user
        else:
            user_profile = db.query(UserProfile).filter(UserProfile.email == email).first()

            if user_profile == None:
                rtn_val['status'] = False
                rtn_val['message'] = "Could not find a profile for the given user"
            else:
                rtn_val['status'] = True
                rtn_val['email'] = email
                rtn_val['profile'] = {}

                if internal_use == True:
                    rtn_val['profile']['id'] = user_profile.id

                if user_profile.bio != '':
                    rtn_val['profile']['bio'] = user_profile.bio
                if user_profile.company != '':
                    rtn_val['profile']['company'] = user_profile.company
                if user_profile.location != '':
                    rtn_val['profile']['location'] = user_profile.location
                if user_profile.website != '':
                    rtn_val['profile']['website'] = user_profile.website
                if user_profile.profile_image_url != '':
                    rtn_val['profile']['profile_image_url'] = user_profile.profile_image_url
                if user_profile.include_email == True:
                    rtn_val['profile']['email'] = user_profile.email

    return rtn_val

def update_user_profile(email, profile_image_url, bio, company, location, website, include_email):
    user = get_user(email=email)
    rtn_val = {}

    if user['status'] == False:
        rtn_val = user
    else:
        user_profile = db.query(UserProfile).filter(UserProfile.email == email).first()

        if user_profile == None: # New entry
            user_profile = UserProfile(email=email, profile_image_url=profile_image_url, \
                                       bio=bio, company=company, location=location, \
                                       website=website, include_email=include_email)
            db.add(user_profile)
        else:
            user_profile.profile_image_url = profile_image_url
            user_profile.bio = bio
            user_profile.company = company
            user_profile.location = location
            user_profile.website = website
            user_profile.include_email = include_email
        db.commit()

        rtn_val['status'] = True
        rtn_val['message'] = "Successfully updated the user profile"
        rtn_val['email'] = email
        rtn_val['profile'] = {}

        if profile_image_url != '':
            rtn_val['profile']['profile_image_url'] = profile_image_url
        if bio != '':
            rtn_val['profile']['bio'] = bio
        if company != '':
            rtn_val['profile']['company'] = company
        if location != '':
            rtn_val['profile']['location'] = location
        if website != '':
            rtn_val['profile']['website'] = website
        rtn_val['profile']['include_email'] = include_email

    return rtn_val

def add_whiteboard_whoami_profile(email, new_content):
    rtn_val = {}
    #############################################################################
    #############################################################################
    # TODO: Discuss with Junwon to see where he's getting those user profile UX flow
    user_profile = get_user_profile(email=email, internal_use=True)
    specifics = new_content['specifics']

    if user_profile['status'] == False:
        rtn_val = user_profile
    elif not ('curr_width' in specifics and 'curr_height' in specifics):
        rtn_val['status'] = False
        rtn_val['message'] = "Not enough information for a whoami content"
    elif len(get_whiteboard_data(email=email, medium=medium['medium'])['whiteboard_data']) > 0:
        rtn_val['status'] = False
        rtn_val['message'] = "User profile data already exists as a whiteboard content"
    else:
        new_whiteboard_content = WhiteboardData(email=email, type=new_content['type'], \
                                                medium=new_content['medium'], status=1, \
                                                pos_x=new_content['pos_x'], \
                                                pos_y=new_content['pos_y'])
        db.add(new_whiteboard_content)
        db.commit()

        whiteboard_data_id = new_whiteboard_content.id

        new_profile_data = UserProfileData(whiteboard_data_id=whiteboard_data_id, \
                                           user_profile_id=user_profile['profile']['id'], \
                                           curr_width=specifics['curr_width'], \
                                           curr_height=specifics['curr_height'])
        db.add(new_profile_data)
        db.commit()

        rtn_val['status'] = True
        rtn_val['id'] = whiteboard_data_id

    return rtn_val

def add_whiteboard_whomai_follow(email, new_content):
    rtn_val = {}
    specifics = new_content['specifics']

    if not ('curr_width' in specifics and 'curr_height' in specifics):
        rtn_val['status'] = False
        rtn_val['message'] = "Not enough information for a whoami content"
    else:
        new_whiteboard_content = WhiteboardData(email=email, type=new_content['type'], \
                                                medium=new_content['medium'], status=1, \
                                                pos_x=new_content['pos_x'], \
                                                pos_y=new_content['pos_y'])
        db.add(new_whiteboard_content)
        db.commit()

        whiteboard_data_id = new_whiteboard_content.id

        new_follow_data = UserFollowData(whiteboard_data_id=whiteboard_data_id, \
                                         curr_width=specifics['curr_width'], \
                                         curr_height=specifics['curr_height'])
        db.add(new_follow_data)
        db.commit()

        rtn_val['status'] = True
        rtn_val['id'] = whiteboard_data_id

    return rtn_val

def add_whiteboard_whoami(email, new_content):
    rtn_val = {}

    # Keep adding types for whoami contents
    if new_content['type'] == 'profile':
        rtn_val = add_whiteboard_whoami_profile(email, new_content)
    elif new_content['type'] == 'follow':
        rtn_val = add_whiteboard_whoami_follow(email, new_content)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Unknown content type"

    rtn_val['medium'] = new_content['medium']
    rtn_val['email'] = email
    rtn_val['type'] = new_content['type']

    return rtn_val

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
        rtn_val['message'] = "Could not find any authorized medium for the \
                              user with the given email"

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

def get_whiteboard_data_whoami_user_profile(user):
    user_profile = None
    user_email = user['email']
    profile_data = db.query(WhiteboardData, UserProfileData, UserProfile)\
                      .filter(and_(WhiteboardData.email == user_email, \
                                   WhiteboardData.medium == 'whoami'))\
                      .filter(UserProfile.email == user_email)\
                      .filter(UserProfileData.whiteboard_data_id == WhiteboardData.id)\
                      .first()

    # profile_data[0] is WhiteboardData, profile_data[1] is UserProfileData
    # and profile_data[2] is UserProfile.
    if profile_data and len(profile_data) == 3:
        user_profile = {}
        user_profile['id'] = profile_data[0].id
        user_profile['type'] = profile_data[0].type
        user_profile['medium'] = profile_data[0].medium
        user_profile['pos_x'] = profile_data[0].pos_x
        user_profile['pos_y'] = profile_data[0].pos_y
        user_profile['last_modified'] = profile_data[0].last_modified
        user_profile['status'] = profile_data[0].status
        user_profile['specifics'] = {}
        user_profile['specifics']['curr_width'] = profile_data[1].curr_width
        user_profile['specifics']['curr_height'] = profile_data[1].curr_height

        if profile_data[2].profile_image_url != '':
            user_profile['specifics']['profile_image_url'] = profile_data[2].profile_image_url
        if profile_data[2].bio != '':
            user_profile['specifics']['bio'] = profile_data[2].bio
        if profile_data[2].company != '':
            user_profile['specifics']['company'] = profile_data[2].company
        if profile_data[2].location != '':
            user_profile['specifics']['location'] = profile_data[2].location
        if profile_data[2].website != '':
            user_profile['specifics']['website'] = profile_data[2].website
        if profile_data[2].include_email == True:
            user_profile['specifics']['email'] = user_email

    return user_profile

def get_whiteboard_data_follow(user):
    follow_relationship = None
    user_email = user['email']

    follow_data = db.query(WhiteboardData, UserFollowData)\
                     .filter(and_(WhiteboardData.email == user_email, \
                                  WhiteboardData.medium == 'whoami'))\
                     .filter(UserFollowData.whiteboard_data_id == WhiteboardData.id)\
                     .first()

    if follow_data and len(follow_data) == 2:
        follow_relationship = {}
        follow_relationship['id'] = follow_data[0].id
        follow_relationship['type'] = follow_data[0].type
        follow_relationship['medium'] = follow_data[0].medium
        follow_relationship['pos_x'] = follow_data[0].pos_x
        follow_relationship['pos_y'] = follow_data[0].pos_y
        follow_relationship['last_modified'] = follow_data[0].last_modified
        follow_relationship['status'] = follow_data[0].status
        follow_relationship['specifics'] = {}
        followers = get_followers(user['username'])['followers']
        following_users = get_following_users(user['username'])['following_users']
        follow_relationship['specifics']['number_of_followers'] = len(followers)
        follow_relationship['specifics']['number_of_following_users'] = len(following_users)

    return follow_relationship

def get_whiteboard_data_whoami(user):
    whoami_contents = []

    # User Profile
    user_profile = get_whiteboard_data_whoami_user_profile(user)
    if user_profile != None:
        whoami_contents.append(user_profile)

    # Follow Relationship
    follow_relationship = get_whiteboard_data_follow(user)
    if follow_relationship != None:
        whoami_contents.append(follow_relationship)

    return whoami_contents

def get_whiteboard_data_instagram(user):
    instagram_contents = []
    user_email = user['email']
    instagram_data = db.query(WhiteboardData, InstagramData)\
                        .filter(and_(WhiteboardData.email == user_email,\
                                     WhiteboardData.medium == 'instagram',\
                                     WhiteboardData.status != 3))\
                        .filter(InstagramData.whiteboard_data_id == WhiteboardData.id)\
                        .all()

    # content_data[0] is WhiteboardData
    # content_data[1] is InstagramData
    for content_data in instagram_data:
        curr_insta_data = {}
        curr_insta_data['id'] = content_data[0].id
        curr_insta_data['type'] = content_data[0].type
        curr_insta_data['medium'] = content_data[0].medium
        curr_insta_data['pos_x'] = content_data[0].pos_x
        curr_insta_data['pos_y'] = content_data[0].pos_y
        curr_insta_data['last_modified'] = content_data[0].last_modified
        curr_insta_data['status'] = content_data[0].status
        curr_insta_data['specifics'] = {}
        curr_insta_data['specifics']['raw_content_url'] = content_data[1].raw_content_url
        curr_insta_data['specifics']['content_url'] = content_data[1].content_url
        curr_insta_data['specifics']['orig_width'] = content_data[1].orig_width
        curr_insta_data['specifics']['orig_height'] = content_data[1].orig_height
        curr_insta_data['specifics']['curr_width'] = content_data[1].curr_width
        curr_insta_data['specifics']['curr_height'] = content_data[1].curr_height
        instagram_contents.append(curr_insta_data)

    return instagram_contents

def get_whiteboard_data_facebook(user):
    facebook_contents = []
    user_email = user['email']
    facebook_data = db.query(WhiteboardData, FacebookData)\
                             .filter(and_(WhiteboardData.email == user_email,\
                                          WhiteboardData.medium == 'facebook',\
                                          WhiteboardData.status != 3))\
                             .filter(FacebookData.whiteboard_data_id == WhiteboardData.id)\
                             .all()

    # content_data[0] is WhiteboardData
    # content_data[1] is FacebookData
    for content_data in facebook_data:
        curr_facebook_data = {}
        curr_facebook_data['id'] = content_data[0].id
        curr_facebook_data['type'] = content_data[0].type
        curr_facebook_data['medium'] = content_data[0].medium
        curr_facebook_data['pos_x'] = content_data[0].pos_x
        curr_facebook_data['pos_y'] = content_data[0].pos_y
        curr_facebook_data['last_modified'] = content_data[0].last_modified
        curr_facebook_data['status'] = content_data[0].status
        curr_facebook_data['specifics'] = {}
        curr_facebook_data['specifics']['raw_content_url'] = content_data[1].raw_content_url
        curr_facebook_data['specifics']['content_url'] = content_data[1].content_url
        curr_facebook_data['specifics']['orig_width'] = content_data[1].orig_width
        curr_facebook_data['specifics']['orig_height'] = content_data[1].orig_height
        curr_facebook_data['specifics']['curr_width'] = content_data[1].curr_width
        curr_facebook_data['specifics']['curr_height'] = content_data[1].curr_height
        facebook_contents.append(curr_facebook_data)

    return facebook_contents

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
    user = user['data']
    rtn_val = {}

    for curr in db.query(AuthorizedMedium).filter(AuthorizedMedium.email==user['email']).all():
        authorized_media.append(curr.medium)

    whiteboard_data = []

    # Keep adding social medium
    if medium == None or medium == 'whoami':
        whoami_contents = get_whiteboard_data_whoami(user)
        whiteboard_data.extend(whoami_contents)

    if (medium == None or medium == 'instagram') and 'instagram' in authorized_media:
        instagram_contents = get_whiteboard_data_instagram(user)
        whiteboard_data.extend(instagram_contents)

    if (medium == None or medium == 'facebook') and 'facebook' in authorized_media:
        facebook_contents = get_whiteboard_data_facebook(user)
        whiteboard_data.extend(facebook_contents)

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

def add_whiteboard_facebook(email, new_content):
    rtn_val = {}
    specifics = new_content['specifics']
    medium = new_content['medium']

    # Keep adding types for Facebook contents
    if new_content['type'] == 'image':
        if not ('raw_content_url' in specifics and 'content_url' in specifics and \
                'orig_width' in specifics and 'orig_height' in specifics and \
                'curr_width' in specifics and 'curr_height' in specifics):
            rtn_val['status'] = False
            rtn_val['message'] = "Not enough information for a facebook content"
        elif db.query(FacebookData)\
                .filter(FacebookData.raw_content_url == specifics['raw_content_url'])\
                .first():
            rtn_val['status'] = False
            rtn_val['message'] = "The given raw content URL already exists"
        else:
            new_whiteboard_content = WhiteboardData(email=email, type=new_content['type'], \
                                                    medium=medium, status=1, \
                                                    pos_x=new_content['pos_x'], \
                                                    pos_y=new_content['pos_y'])
            db.add(new_whiteboard_content)
            db.commit()

            whiteboard_data_id = new_whiteboard_content.id

            new_facebook_content = FacebookData(whiteboard_data_id=whiteboard_data_id, \
                                                  raw_content_url=specifics['raw_content_url'], \
                                                  content_url=specifics['content_url'], \
                                                  orig_width=specifics['orig_width'], \
                                                  orig_height=specifics['orig_height'], \
                                                  curr_width=specifics['curr_width'], \
                                                  curr_height=specifics['curr_height'])
            db.add(new_facebook_content)
            db.commit()

            rtn_val['status'] = True
            rtn_val['id'] = whiteboard_data_id
    else:
        rtn_val['status'] = False
        rtn_Val['message'] = "Unknown content type"

    rtn_val['type'] = new_content['type']
    rtn_val['medium'] = medium
    rtn_val['email'] = email

    return rtn_val

def add_whiteboard_instagram(email, new_content):
    rtn_val = {}
    specifics = new_content['specifics']
    medium = new_content['medium']

    # Keep adding types for Instagram contents
    if new_content['type'] == 'image':
        if not ('raw_content_url' in specifics and 'content_url' in specifics and \
                'orig_width' in specifics and 'orig_height' in specifics and \
                'curr_width' in specifics and 'curr_height' in specifics):
            rtn_val['status'] = False
            rtn_val['message'] = "Not enough information for an instagram content"
        elif db.query(InstagramData)\
                .filter(InstagramData.raw_content_url == specifics['raw_content_url'])\
                .first():
            rtn_val['status'] = False
            rtn_val['message'] = "The given raw content URL already exists"
        else:
            new_whiteboard_content = WhiteboardData(email=email, type=new_content['type'], \
                                                    medium=medium, status=1, \
                                                    pos_x=new_content['pos_x'], \
                                                    pos_y=new_content['pos_y'])
            db.add(new_whiteboard_content)
            db.commit()

            whiteboard_data_id = new_whiteboard_content.id

            new_instagram_content = InstagramData(whiteboard_data_id=whiteboard_data_id, \
                                                  raw_content_url=specifics['raw_content_url'], \
                                                  content_url=specifics['content_url'], \
                                                  orig_width=specifics['orig_width'], \
                                                  orig_height=specifics['orig_height'], \
                                                  curr_width=specifics['curr_width'], \
                                                  curr_height=specifics['curr_height'])
            db.add(new_instagram_content)
            db.commit()

            rtn_val['status'] = True
            rtn_val['id'] = whiteboard_data_id
    else:
        rtn_val['status'] = False
        rtn_Val['message'] = "Unknown content type"

    rtn_val['type'] = new_content['type']
    rtn_val['medium'] = medium
    rtn_val['email'] = email

    return rtn_val

def update_whiteboard_whoami(email, update):
    rtn_val = {'id':update['id'], 'email':email}
    medium = update['medium']
    specifics = update['specifics']
    whiteboard_data = db.query(WhiteboardData)\
                          .filter(and_(WhiteboardData.email == email, \
                                       WhiteboardData.id == update['id']))\
                          .filter(WhiteboardData.medium == medium)\
                          .first()

    if whiteboard_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "No matching whiteboard data found"
    else:
        # Keep adding types for whoami contents
        if whiteboard_data.type == 'profile':
            profile_data = db.query(UserProfileData)\
                              .filter(UserProfileData.whiteboard_data_id==update['id'])\
                              .first()
            if profile_data == None:
                rtn_val['status'] = False
                rtn_val['message'] = "There is no user profile data with the given id"
            else:
                profile_data.curr_width = specifics['curr_width']
                profile_data.curr_height = specifics['curr_height']
                whiteboard_data.pos_x = update['pos_x']
                whiteboard_data.pos_y = update['pos_y']
                whiteboard_data.last_modified = datetime.now()
                db.commit()

                rtn_val['status'] = True
                rtn_val['medium'] = medium
                rtn_val['type'] = whiteboard_data.type
        elif whiteboard_data.type == 'follow':
            # TODO: SOMETHING
            print("update follow content")
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Unknown contrent type"

    return rtn_val

def update_whiteboard_facebook(email, update):
    rtn_val = {'id':update['id'], 'email':email}
    medium = update['medium']
    specifics = update['specifics']
    whiteboard_data = db.query(WhiteboardData)\
                          .filter(and_(WhiteboardData.email == email, \
                                       WhiteboardData.id == update['id']))\
                          .filter(WhiteboardData.medium == medium)\
                          .first()

    if whiteboard_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "No matching whiteboard data found"
    else:
        # Keep adding types for Facebook contents
        if whiteboard_data.type == 'image':
            facebook_data = db.query(FacebookData)\
                               .filter(FacebookData.whiteboard_data_id == update['id'])\
                               .first()

            if facebook_data == None:
                rtn_val['status'] = False
                rtn_val['message'] = "There is no facebook data with the given id"
            else:
                facebook_data.curr_width = specifics['curr_width']
                facebook_data.curr_height = specifics['curr_height']
                whiteboard_data.pos_x = update['pos_x']
                whiteboard_data.pos_y = update['pos_y']
                whiteboard_data.last_modified = datetime.now()
                db.commit()

                rtn_val['status'] = True
                rtn_val['medium'] = medium
                rtn_val['type'] = whiteboard_data.type

    return rtn_val

def update_whiteboard_instagram(email, update):
    rtn_val = {'id':update['id'], 'email':email}
    medium = update['medium']
    specifics = update['specifics']
    whiteboard_data = db.query(WhiteboardData)\
                          .filter(and_(WhiteboardData.email == email, \
                                       WhiteboardData.id == update['id']))\
                          .filter(WhiteboardData.medium == medium)\
                          .first()

    if whiteboard_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "No matching whiteboard data found"
    else:
        # Keep adding types for Instagram contents
        if whiteboard_data.type == 'image':
            instagram_data = db.query(InstagramData)\
                                .filter(InstagramData.whiteboard_data_id == update['id'])\
                                .first()

            if instagram_data == None:
                rtn_val['status'] = False
                rtn_val['message'] = "There is no instagram data with the given id"
            else:
                instagram_data.curr_width = specifics['curr_width']
                instagram_data.curr_height = specifics['curr_height']
                whiteboard_data.pos_x = update['pos_x']
                whiteboard_data.pos_y = update['pos_y']
                whiteboard_data.last_modified = datetime.now()
                db.commit()

                rtn_val['status'] = True
                rtn_val['medium'] = medium
                rtn_val['type'] = whiteboard_data.type

    return rtn_val

def delete_facebook_content(whiteboard_data_id):
    rtn_val = {}

    facebook_data = db.query(FacebookData).filter(FacebookData.whiteboard_data_id == \
                                                  whiteboard_data_id).first()

    if facebook_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no facebook data with the given id"
    else:
        db.delete(facebook_data)
        db.commit()
        rtn_val['status'] = True
        rtn_val['medium'] = 'facebook'

    return rtn_val

def delete_instagram_content(whiteboard_data_id):
    rtn_val = {}

    instagram_data = db.query(InstagramData).filter(InstagramData.whiteboard_data_id == \
                                                    whiteboard_data_id).first()

    if instagram_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no instagram data with the given id"
    else:
        db.delete(instagram_data)
        db.commit()
        rtn_val['status'] = True
        rtn_val['medium'] = 'instagram'

    return rtn_val

def delete_whoami_content(whiteboard_data_id):
    rtn_val = {}

    profile_data = db.query(UserProfileData)\
                                 .filter(UserProfileData.whiteboard_data_id == \
                                         whiteboard_data_id)\
                                 .first()

    if profile_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no user profile data with the given id"
    else:
        db.delete(profile_data)
        db.commit()
        rtn_val['status'] = True
        rtn_val['medium'] = 'whoami'

    return rtn_val

def delete_whiteboard_content(email, whiteboard_data_id):
    rtn_val = {}

    whiteboard_data = db.query(WhiteboardData).filter(and_(WhiteboardData.email == email, \
                                             WhiteboardData.id == whiteboard_data_id)).first()

    if whiteboard_data == None:
        rtn_val['status'] = False
        rtn_val['message'] = "There is no whiteboard data with the given id"
    else:
        if whiteboard_data.medium == 'instagram':
            rtn_val = delete_instagram_content(whiteboard_data_id)
        elif whiteboard_data.medium == 'facebook':
            rtn_val = delete_facebook_content(whiteboard_data_id)
        elif whiteboard_data.medium == 'whoami':
            rtn_val = delete_whoami_content(whiteboard_data_id)
        else:
            # Medium provided not found
            rtn_val['status'] = False
            rtn_val['message'] = "Could not find the given medium"

        if rtn_val['status'] == True:
            db.delete(whiteboard_data)
            db.commit()

    rtn_val['id'] = whiteboard_data_id
    rtn_val['email'] = email

    return rtn_val

def update_whiteboard_content(email, update):
    rtn_val = {}

    if not ('medium' in update and 'id' in update and 'specifics' in update):
        rtn_val['status'] = False
        rtn_val['message'] = "Not enough information to update a whiteboard content"
    else:
        # Keep adding social media here
        if update['medium'] == 'instagram':
            rtn_val = update_whiteboard_instagram(email, update)
        elif update['medium'] == 'facebook':
            rtn_val = update_whiteboard_facebook(email, update)
        elif update['medium'] == 'whoami':
            rtn_val = update_whiteboard_whoami(email, update)
        else:
            # Medium provided not found
            rtn_val['message'] = "Could not find the given medium"
            rtn_val['status'] = False

    return rtn_val

def add_whiteboard_content(email, new_content):
    rtn_val = {}

    if not ('type' in new_content and 'pos_x' in new_content and 'pos_y' in new_content \
            and 'specifics' in new_content and 'medium' in new_content):
        rtn_val['status'] = False
        rtn_val['message'] = "Not enough information for a new whiteboard content"
    else:
        # Keep adding social media here
        if new_content['medium'] == 'instagram':
            rtn_val = add_whiteboard_instagram(email, new_content)
        elif new_content['medium'] == 'facebook':
            rtn_val = add_whiteboard_facebook(email, new_content)
        elif new_content['medium'] == 'whoami':
            rtn_val = add_whiteboard_whoami(email, new_content)
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
            new_medium = AuthorizedMedium(email=email, medium=medium, \
                                          access_token=access_token)
            db.add(new_medium)
            rtn_val['message'] = "Successfully registered Instagram account for the user"
        db.commit()

    return rtn_val

def check_credential(email, password, hashed=False):
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
            user.last_signin = datetime.now()
            db.commit()

    return rtn_val

def signin_user(email, password):
    rtn_val = {}
    rtn_val = check_credential(email, password)

    if rtn_val['status'] == True:
        user = db.query(User).filter(User.email == email).first()
        user.last_signin = datetime.now()
        db.commit()

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
    rtn_val = check_credential(email, password)

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

def update_last_signout(email):
    user = get_user(email=email)
    rtn_val = {}

    if user['status']:
        rtn_val['status'] = True
        rtn_val['message'] = "Successfully updated last_signout of the user"
        user = db.query(User).filter(User.email == email).first()
        user.last_signout = datetime.now()
        db.commit()
    else:
        rtn_val = user

    return rtn_val
