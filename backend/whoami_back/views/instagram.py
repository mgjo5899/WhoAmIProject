from flask import session, Blueprint, jsonify, request, redirect
import requests
import json

import whoami_back.utils as utils
import whoami_back.instagram_config as instagram_conf
import whoami_back.manage as manage


instagram = Blueprint('instagram', __name__)


def access_token_api(client_id, client_secret, grant_type, redirect_uri, code):
    rtn_val = {}
    uri = instagram_conf.ACCESS_TOKEN_ENDPOINT
    payload = {
                'client_id'     : client_id,
                'client_secret' : client_secret,
                'grant_type'    : grant_type,
                'redirect_uri'  : redirect_uri,
                'code'          : code
              }

    r = requests.post(uri, data=payload)

    # When things are not working
    #rtn_val['status'] = True
    #rtn_val['access_token_data'] = json.loads(''.join([t.strip() for t in open('instagram_data.txt', 'r').readlines()]))

    if r.status_code == 200:
        rtn_val['status'] = True
        rtn_val['access_token_data'] = json.loads(r.text)
    else:
        rtn_val['status'] = False
        rtn_val['error_message'] = json.loads(r.text)

    return rtn_val

def get_user_contents(access_token):
    rtn_val = {}
    uri = instagram_conf.USER_MEDIA_ENDPOINT
    r = requests.get(uri + '/?access_token=' + access_token)

    if r.status_code == 200:
        rtn_val['status'] = True
        rtn_val['user_contents'] = json.loads(r.text)
    else:
        rtn_val['status'] = False
        rtn_val['error_message'] = json.loads(r.text)

    return rtn_val

def refine_raw_data(raw_contents_data):
    contents = []

    for raw_content in raw_contents_data:
        # Get standard_resolution
        content = {}
        content['orig_width'] = raw_content['images']['standard_resolution']['width']
        content['orig_height'] = raw_content['images']['standard_resolution']['height']
        content['raw_content_url'] = raw_content['images']['standard_resolution']['url']
        content['instagram_url'] = raw_content['link']
        content['type'] = raw_content['type']
        contents.append(content)

    return contents

@instagram.route('/instagram/user_data', methods=['GET'])
def get_user_data():
    rtn_val = {}

    if 'email' in session:
        access_token = manage.get_medium_access_token(session['email'], 'instagram')

        if access_token['status'] == True:
            raw_user_data = get_user_contents(access_token['access_token'])

            if raw_user_data['status'] == True:
                # Refine the data
                refined_contents = refine_raw_data(raw_user_data['user_contents']['data'])
                existing_instagram_contents = manage.get_whiteboard_data(session['email'], 'instagram')['whiteboard_data']

                # Check if there's any unavailable contents and if there are, mark their status as 3
                # Also check if there's any existing used (1) or unused (2) content
                # If there is, retrieve necessary information
                for existing_content in existing_instagram_contents:
                    available = False

                    for curr_content in refined_contents:
                        if existing_content['raw_content_url'] == curr_content['raw_content_url']:
                            available = True
                            curr_content['id'] = existing_content['id']
                            curr_content['pos_x'] = existing_content['pos_x']
                            curr_content['pos_y'] = existing_content['pos_y']
                            curr_content['last_modified'] = existing_content['last_modified']
                            curr_content['curr_width'] = existing_content['curr_width']
                            curr_content['curr_height'] = existing_content['curr_height']
                            curr_content['status'] = existing_content['status']
                            break

                    if available == False:
                        marking_result = manage.mark_content_unavailable(existing_content['id'])
                        print(marking_result)
                rtn_val['status'] = True
                rtn_val['instagram_contents'] = refined_contents
                rtn_val['email'] = session['email']
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Could not find Instagram access token for the user with the given email"
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find the user email in the session cookie"

    return jsonify(rtn_val)

@instagram.route('/instagram/get_access_token', methods=['GET'])
def get_access_token():
    rtn_val = {}
    req = utils.get_req_data()

    if 'code' in req:
        rtn_val = access_token_api(instagram_conf.CLIENT_ID,
                                   instagram_conf.CLIENT_SECRET,
                                   instagram_conf.GRANT_TYPE,
                                   instagram_conf.ACCESS_TOKEN_REDIRECT_URI,
                                   req['code'])

        if rtn_val['status'] == True:
            if 'email' in session:
                access_token_data = rtn_val['access_token_data']
                rtn_val = { 'status' : True }
                rtn_val['access_token'] = access_token_data['access_token']
            else:
                rtn_val = { 'status' : False }
                rtn_val['message'] = "Could not find the user email in the session cookie"
                rtn_val['error_code'] = 3
        else:
            rtn_val['error_code'] = 2
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Failed to get code."
        rtn_val['error_message'] = req
        rtn_val['error_code'] = 1

    if rtn_val['status'] == True:
        rtn_val = manage.register_medium('instagram', session['email'], rtn_val['access_token'])

        if rtn_val['status'] == False:
            rtn_val['error_code'] = 4

    notification = '{}?medium={}&status={}'.format(
                                                    instagram_conf.OAUTH_RESULT_ENDPOINT,
                                                    'instagram',
                                                    str(rtn_val['status']).lower()
                                                  )
    if rtn_val['status'] == False:
        notification += '&errorcode={}'.format(rtn_val['error_code'])

    return redirect(notification)
