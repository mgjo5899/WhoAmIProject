from flask import session, Blueprint, jsonify, request, redirect
import requests
import json

import whoami_back.utils as utils
import whoami_back.manage as manage


whiteboard = Blueprint('whiteboard', __name__)


@whiteboard.route('/whiteboard/user_data', methods=['GET', 'POST', 'PUT', 'DELETE'])
def whiteboard_user_data():
    rtn_val = {}
    req = utils.get_req_data()

    if 'email' in session:
        if request.method == 'GET':
            rtn_val = manage.get_whiteboard_data(session['email'])
        elif request.method == 'POST':
            new_contents = req['new_contents']

            rtn_val['status'] = True
            rtn_val['addition_results'] = []

            for new_content in new_contents:
                add_status = manage.add_whiteboard_content(session['email'], new_content)

                # Debugging purpose
                if add_status['status'] == False:
                    print("new_content: ", new_content)
                    print(add_status)

                rtn_val['addition_results'].append(add_status)
        elif request.method == 'PUT':
            updated_contents = req['updated_contents']

            rtn_val['status'] = True
            rtn_val['update_results'] = []

            for updated_content in updated_contents:
                update_status = manage.update_whiteboard_content(session['email'], updated_content)

                # Debugging purpose
                if update_status['status'] == False:
                    print("updated_content: ", updated_content)
                    print(update_status)

                rtn_val['update_results'].append(update_status)
        elif request.method == 'DELETE':
            deleted_contents = req['deleted_contents']

            rtn_val['status'] = True
            rtn_val['delete_results'] = []

            for deleted_content_id in deleted_contents:
                delete_status = manage.delete_whiteboard_content(session['email'], deleted_content_id)

                if delete_status['status'] == False:
                    print("deleted_content_id: ", deleted_content_id)
                    print(delete_status)

                rtn_val['delete_results'].append(delete_status)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Could not find the user email in the session cookie"

    return jsonify(rtn_val)
