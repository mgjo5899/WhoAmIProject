from flask import session, Blueprint, jsonify, request, redirect
import requests
import json

import whoami_back.facebook_config as facebook_conf
import whoami_back.utils as utils
import whoami_back.manage as manage


facebook = Blueprint('facebook', __name__)
MEDIUM = 'facebook'


def access_token_api(code):
    rtn_val = {}
    uri = facebook_conf.ACCESS_TOKEN_ENDPOINT
    payload = { 'client_id'     : facebook_conf.CLIENT_ID,
                'client_secret' : facebook_conf.CLIENT_SECRET,
                'redirect_uri'  : facebook_conf.ACCESS_TOKEN_REDIRECT_URI,
                'code'          : code }

    r = requests.post(uri, data=payload)

    if r.status_code == 200:
        rtn_val['status'] = True
        rtn_val['access_token_data'] = json.loads(r.text)
    else:
        rtn_val['status'] = False
        rtn_val['error_message'] = json.loads(r.text)

    return rtn_val

def get_user_contents(access_token):
    rtn_val = {}
    uri = facebook_conf.USER_PHOTOS_ENDPOINT
    payload = { 'access_token': access_token,
                'fields': facebook_conf.FIELDS,
                'type': facebook_conf.TYPE }
    r = requests.get(uri, payload)
    
    while True:
        if r.status_code == 200:
            result = json.loads(r.text)

            if 'user_contents' not in rtn_val:
                rtn_val['user_contents'] = result['data']
            else:
                rtn_val['user_contents'] += result['data']

            if 'next' in result:
                r = requests.get(result['next'], payload)
            else:
                rtn_val['status'] = True
                break
        else:
            rtn_val = { 'status': False }
            rtn_val['error_message'] = json.loads(r.text)
            break

    return rtn_val

def refine_raw_data(raw_contents_data):
    contents = []

    for raw_content in raw_contents_data:
        content = {}
        content['content_url'] = raw_content['link']
        content['orig_width'] = raw_content['images'][0]['width']
        content['orig_height'] = raw_content['images'][0]['height']
        content['raw_content_url'] = raw_content['images'][0]['source']

        for image in raw_content['images'][1:]:
            if image['width'] > content['orig_width']:
                content['orig_width'] = image['width']
                content['orig_height'] = image['height']
                content['raw_content_url'] = image['source']

        content['type'] = 'image'
        contents.append(content)

    return contents

@facebook.route('/facebook/user_data', methods=['GET'])
def get_user_facebook_data():
    rtn_val = {}

    if 'email' not in session:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find the user email in the session cookie"
    else:
        access_token = manage.get_medium_access_token(session['email'], MEDIUM)

        if access_token['status'] != True:
            rtn_val['status'] = False
            rtn_val['message'] = "Could not find Instagram access token for the user with the given email"
        else:
            raw_user_data = get_user_contents(access_token['access_token'])

            if raw_user_data['status'] != True:
                rtn_val = raw_user_data
                rtn_val['message'] = "Could not get user's Facebook contents"
            else:
                # Refine the data
                refined_contents = refine_raw_data(raw_user_data['user_contents'])
                existing_contents = manage.get_whiteboard_data(email=session['email'], medium=MEDIUM)['whiteboard_data']

                # Check if there's any unavailable contents and if there are, 
                # mark them unavailable (3)
                # Also check if there's any existing used (1) or unused (2) content
                # If there is, retrieve necessary information
                for existing_content in existing_contents:
                    available = False

                    for curr_content in refined_contents:
                        if existing_content['specifics']['raw_content_url'] == \
                                            curr_content['raw_content_url']:
                            available = True
                            curr_content['id'] = existing_content['id']
                            curr_content['pos_x'] = existing_content['pos_x']
                            curr_content['pos_y'] = existing_content['pos_y']
                            curr_content['last_modified'] = existing_content['last_modified']
                            curr_content['status'] = existing_content['status']
                            curr_content['curr_width'] = \
                                               existing_content['specifics']['curr_width']
                            curr_content['curr_height'] = \
                                               existing_content['specifics']['curr_height']
                            break

                    if available == False:
                        marking_result = manage.mark_content_unavailable(existing_content['id'])
                        print(marking_result)

                rtn_val['status'] = True
                rtn_val['contents'] = refined_contents
                rtn_val['email'] = session['email']

    return jsonify(rtn_val)

@facebook.route('/facebook/get_access_token', methods=['GET'])
def get_facebook_access_token():
    rtn_val = {}
    req = utils.get_req_data()

    if 'email' not in session:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find the user email in the session cookie"
        rtn_val['error_code'] = 3
    elif not ('code' in req and 'state' in req):
        rtn_val['status'] = False
        rtn_val['message'] = "Failed to get code"
        rtn_val['error_message'] = req
        rtn_val['error_code'] = 1
    elif req['state'] != facebook_conf.STATE:
        rtn_val['status'] = False
        rtn_val['message'] = "Failed to get the correct state"
        rtn_val['error_message'] = req
        rtn_val['error_code'] = 5
    else:
        rtn_val = access_token_api(req['code'])

        if rtn_val['status'] == False:
            rtn_val['error_code'] = 2
        else:
            access_token = rtn_val['access_token_data']['access_token']
            rtn_val = manage.register_medium(MEDIUM, session['email'], access_token)

            if rtn_val['status'] == False:
                rtn_val['error_code'] = 4

    notification = '{}?medium={}&status={}'.format(facebook_conf.OAUTH_RESULT_ENDPOINT, \
                                                   MEDIUM, \
                                                   str(rtn_val['status']).lower())

    if rtn_val['status'] == False:
        notification += '&errorcode={}'.format(rtn_val['error_code'])

    return redirect(notification)
