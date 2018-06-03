from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
import models as dbHandler
import json

app = Flask(__name__)
CORS(app)

@app.route('/users', methods=['POST', 'GET', 'DELETE', 'PUT'])
def home():
    if request.method == 'PUT':
        if len(request.form) > 0:
            # Postman
            # request.data is empty with Postman
            print("request form: " + str(request.form))
            username = request.form['username']
            password = request.form['password']
            new_password = request.form['new_password']
        else:
            # React
            # request.form is empty with react
            req = json.loads(request.data.decode("utf-8"))
            print("request data: " + str(req))
            username = req['username']
            password = req['password']
            new_password = req['new_password']

        rtn_val = {}

        if not dbHandler.modify_user(username, password, new_password):
            rtn_val['status'] = "Fail"
            rtn_val['error'] = "There is no user with the given username"
        else:
            rtn_val['status'] = "Success"

        users = dbHandler.retrieve_users()
        rtn_val['current users'] = users

        return jsonify(rtn_val)
            
    elif request.method == 'POST' or request.method == 'DELETE':
        if len(request.form) > 0:
            # Postman
            # request.data is empty with Postman
            print("request form: " + str(request.form))
            username = request.form['username']
            password = request.form['password']
        else:
            # React
            # request.form is empty with react
            req = json.loads(request.data.decode("utf-8"))
            print("request data: " + str(req))
            username = req['username']
            password = req['password']

        rtn_val = {}

        if request.method == 'POST':
            if not dbHandler.register_user(username, password):
                rtn_val['status'] = "Fail"
                rtn_val['error'] = "There is a user with the given username"
            else:
                rtn_val['status'] = "Success"
        elif  request.method == 'DELETE':
            if not dbHandler.delete_user(username, password):
                rtn_val['status'] = "Fail"
                rtn_val['error'] = "There is no user with the given username"
            else:
                rtn_val['status'] = "Success"
        users = dbHandler.retrieve_users()
        rtn_val['current users'] = users

        return jsonify(rtn_val)

    elif request.method == 'GET':
        users = dbHandler.retrieve_users()
        rtn_val = {}
        rtn_val['status'] = "Success"
        rtn_val['users'] = users
        
        return jsonify(rtn_val)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
