from flask import session, Blueprint, jsonify, request
import json

import whoami_back.utils as utils
import whoami_back.manage as manage


instagram = Blueprint('instagram', __name__)

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
