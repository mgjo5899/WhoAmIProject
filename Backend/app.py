from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
from models import check_user, register_user, signin_user, get_users
from models import delete_user, modify_password
import json

from utils import valid_email_format

app = Flask(__name__)
CORS(app)

def get_req_data():
    if len(request.form) > 0:
        # Postman
        # request.data is empty with Postman
        print("Getting data from request.form")
        req = request.form
    elif len(request.data) > 0:
        # React
        # request.form is empty with react
        print("Getting data from request.data")
        req = json.loads(request.data.decode("utf-8"))

    return req


@app.route('/signin', methods=['POST'])
def signin():
    rtn_val = {}

    req = get_req_data()

    if 'username' in req and 'password' in req:
        username = req['username']
        password = req['password']

        rtn_val = signin_user(username, password)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing either username or password"

    return jsonify(rtn_val)


@app.route('/users', methods=['POST', 'GET', 'DELETE', 'PUT'])
def home():
    rtn_val = {}

    if len(request.form) > 0:
        # Postman
        # request.data is empty with Postman
        print("Getting data from request.form")
        req = request.form
    elif len(request.data) > 0:
        # React
        # request.form is empty with react
        print("Getting data from request.data")
        req = json.loads(request.data.decode("utf-8"))
    else:
        print("Possibly GET request")

    if request.method == 'PUT':
        if 'username' in req and 'password' in req and 'new_password' in req:
            username = req['username']
            password = req['password']
            new_password = req['new_password']

            rtn_val = modify_password(username, password, new_password)
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing either username, password, \
                                                                   or new_password"
            
    elif request.method == 'POST':
        if 'username' in req and 'password' in req and 'email' in req:
            username = req['username']
            password = req['password']
            email = req['email']

            if not valid_email_format(email):
                rtn_val['status'] = False
                rtn_val['message'] = "Email is not in a valid format"
            elif not register_user(username, password, email):
                rtn_val['status'] = False
                rtn_val['message'] = "There is a user with the given username"
            else:
                rtn_val['status'] = True

            users = get_users()
            rtn_val['current users'] = users
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing either username, password, or email"

    elif request.method == 'DELETE':
        if 'username' in req and 'password' in req:
            username = req['username']
            password = req['password']

            rtn_val = delete_user(username,password)
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing either username or password"

    elif request.method == 'GET':
        rtn_val = get_users()

    return jsonify(rtn_val)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
