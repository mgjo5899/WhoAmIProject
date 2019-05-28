from flask import session, jsonify, request
from flask import Blueprint

import whoami_back.manage as manage
import whoami_back.utils as utils


util_apis = Blueprint('util_apis', __name__)


@util_apis.route('/utils/get_profile_images', methods=['POST'])
def get_profile_images():
    rtn_val = {}
    req = utils.get_req_data()

    if request.method == 'POST':
        if 'usernames' not in req or 'secret_key' not in req:
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing necessary data"
        elif utils.check_secret_api_key(req['secret_key']) == False:
            rtn_val['status'] = False
            rtn_val['message'] = "Given secret_key is incorrect"
        else:
            rtn_val = manage.get_profile_images(req['usernames'])


    return jsonify(rtn_val)
