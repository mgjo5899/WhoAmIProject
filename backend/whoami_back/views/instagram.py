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

@instagram.route('/instagram/user_data', methods=['GET'])
def get_user_data():
    rtn_val = {}

    if 'email' in session:
        access_token = manage.get_medium_access_token(session['email'], 'instagram')

        if access_token['status'] == True:
            rtn_val = get_user_contents(access_token['access_token'])
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
        print('code: ' + req['code'])

        rtn_val = access_token_api(instagram_conf.CLIENT_ID,
                                   instagram_conf.CLIENT_SECRET,
                                   instagram_conf.GRANT_TYPE,
                                   instagram_conf.ACCESS_TOKEN_REDIRECT_URI,
                                   req['code'])

        if rtn_val['status'] == True:
            if 'email' in session:
                access_token_data = rtn_val['access_token_data']
                print('access_token_data: ', access_token_data)
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

"""
@instagram.route('/instagram/register', methods=['POST'])
def register():
    rtn_val = {}
    req = utils.get_req_data()

    if 'email' in session and 'password' in session and 'username' in req:
        if manage.signin_user(session['email'], session['password'], hashed=True)['status']:
            rtn_val = manage.check_username_with_email(req['username'], session['email'])

            if rtn_val['status']:
                rtn_val = manage.register_instagram(session['email'])
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Incorrect credential in session token"
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is either missing user credential or username"

    return jsonify(rtn_val)
"""

@instagram.route('/instagram/update', methods=['POST', 'PUT'])
def update():
    rtn_val = {}
    req = utils.get_req_data()

    if 'email' in session and 'password' in session and 'username' in req:
        if manage.signin_user(session['email'], session['password'], hashed=True)['status']:
            rtn_val = manage.check_username_with_email(req['username'], session['email'])

            if rtn_val['status']:
                # TODO: Need to check with how react sends dictionary or JSON formatted string
                if request.method == 'POST':
                    if 'addition' in req:
                        added = []
                        additions = json.loads(req['addition'])

                        for img in additions:
                            added.append(manage.add_new_instagram_image(session['email'], img['id'], \
                                                           img['instagram_url'], img['raw_image_url'], \
                                                           img['orig_width'], img['orig_height']))
                        rtn_val['additions'] = added

                    if 'deletion' in req:
                        deleted = []
                        deletion = json.loads(req['deletion'])

                        for image_id in deletion:
                            deleted.append(manage.delete_instagram_image(session['email'], image_id))
                        rtn_val['deletions'] = deleted
                elif request.method == 'PUT':
                    if 'modification' in req:
                        modified = []
                        modifications = json.loads(req['modification'])

                        for img in modifications:
                            modified.append(manage.update_instagram_image(session['email'], img['id'], \
                                    img['width'], img['height'], img['pos_x'], img['pos_y'], img['angle']))
                        rtn_val['modifications'] = modified
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Incorrect credential in session token"
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is either missing user credential or username"

    return jsonify(rtn_val)
