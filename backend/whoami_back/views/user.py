from flask import session, jsonify, request
from flask import Blueprint

import whoami_back.manage as manage
import whoami_back.utils as utils


user = Blueprint('user', __name__)


@user.route('/user/authorized_media', methods=['GET'])
def get_authorized_media():
    rtn_val = {}

    if 'email' in session:
        rtn_val = manage.get_authorized_medium(session['email'])

        if rtn_val['status'] == True:
            for medium in rtn_val['authorized_medium']:
                medium.pop('access_token')
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find the user email in the session cookie"
    
    return jsonify(rtn_val)

@user.route('/user/profile', methods=['GET', 'POST'])
def user_profile():
    rtn_val = {}
    req = utils.get_req_data()

    if 'email' in session:
        if request.method == 'GET':
            rtn_val = manage.get_user_profile(session['email'])
        elif request.method == 'POST':
            if 'profile_image_url' in req and 'bio' in req and 'company' in req and \
                    'location' in req and 'website' in req and 'include_email' in req:
                rtn_val = manage.update_user_profile(session['email'],
                                                     req['profile_image_url'], req['bio'],
                                                     req['company'], req['location'],
                                                     req['website'], req['include_email'])
            else:
                rtn_val['status'] = False
                rtn_val['message'] = "Request is missing necessary"
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find the user email in the session cookie"

    return jsonify(rtn_val)
