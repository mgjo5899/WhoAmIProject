from flask import session, jsonify, request
from flask import Blueprint

import whoami_back.manage as manage
import whoami_back.utils as utils


util_apis = Blueprint('util_apis', __name__)


@util_apis.route('/utils/get_followers', methods=['POST'])
def get_followers():
    rtn_val = {}
    req = utils.get_req_data()

    if request.method == 'POST':
        if not ('username' in req or 'secret_key' in req):
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing necessary data"
        elif utils.check_secret_api_key(req['secret_key']) == False:
            rtn_val['status'] = False
            rtn_val['message'] = "Given secret_key is incorrect"
        else:
            rtn_val = manage.get_followers(req['username'])

    return jsonify(rtn_val)

@util_apis.route('/utils/get_following_users', methods=['POST'])
def get_following_users():
    rtn_val = {}
    req = utils.get_req_data()

    if request.method == 'POST':
        if not ('username' in req or 'secret_key' in req):
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing necessary data"
        elif utils.check_secret_api_key(req['secret_key']) == False:
            rtn_val['status'] = False
            rtn_val['message'] = "Given secret_key is incorrect"
        else:
            rtn_val = manage.get_following_users(req['username'])

    return jsonify(rtn_val)
