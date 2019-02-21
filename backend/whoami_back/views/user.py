from flask import session, jsonify, request
from flask import Blueprint

import whoami_back.manage as manage


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
