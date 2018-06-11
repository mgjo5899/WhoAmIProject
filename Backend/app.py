from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
import models as dbHandler
import json

from utils import valid_email_format

app = Flask(__name__)
CORS(app)

def valid_email_format(email):
    result = re.fullmatch('([a-zA-Z0-9\-%_\+]+(\.[a-zA-Z0-9\-%_\+]+)*)@([a-zA-Z0-9\-]+)\.([a-zA-Z0-9\-]{2,})', email)

    if result == None:
        return False
    elif result.group(0) == email:
        return True

@app.route('/signin', methods=['POST'])
def signin():
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

    if 'username' in req and 'password' in req:
        username = req['username']
        password = req['password']

        if not dbHandler.signin_user(username, password):
            rtn_val['status'] = "Failed"
            rtn_val['error'] = "There is no user with the given username and password"
        else:
            rtn_val['status'] = "Successful"
    else:
        rtn_val['status'] = "Failed"
        rtn_val['error'] = "Request is missing either username or password"

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

            if not dbHandler.modify_user(username, password, new_password):
                rtn_val['status'] = "Failed"
                rtn_val['error'] = "There is no user with the given username and \
                                                                         password"
            else:
                rtn_val['status'] = "Successful"

            users = dbHandler.retrieve_users()
            rtn_val['current users'] = users
        else:
            rtn_val['status'] = "Failed"
            rtn_val['error'] = "Request is missing either username, password, \
                                                                   or new_password"
            
    elif request.method == 'POST':
        if 'username' in req and 'password' in req and 'email' in req:
            username = req['username']
            password = req['password']
            email = req['email']

            if not valid_email_format(email):
                rtn_val['status'] = 'Failed'
                rtn_val['error'] = "Email is not in a valid format"
            elif not dbHandler.register_user(username, password, email):
                rtn_val['status'] = "Failed"
                rtn_val['error'] = "There is a user with the given username"
            else:
                rtn_val['status'] = "Successful"

            users = dbHandler.retrieve_users()
            rtn_val['current users'] = users
        else:
            rtn_val['status'] = "Failed"
            rtn_val['error'] = "Request is missing either username, password, or email"

    elif request.method == 'DELETE':
        if 'username' in req and 'password' in req:
            username = req['username']
            password = req['password']

            if not dbHandler.delete_user(username, password):
                rtn_val['status'] = "Failed"
                rtn_val['error'] = "There is no user with the given username"
            else:
                rtn_val['status'] = "Successful"

            users = dbHandler.retrieve_users()
            rtn_val['current users'] = users
        else:
            rtn_val['status'] = "Failed"
            rtn_val['error'] = "Request is missing either username or password"

    elif request.method == 'GET':
        users = dbHandler.retrieve_users()
        rtn_val = {}
        rtn_val['status'] = "Successful"
        rtn_val['users'] = users

    return jsonify(rtn_val)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')