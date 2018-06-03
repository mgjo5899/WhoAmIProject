from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
import models as dbHandler
import json

app = Flask(__name__)
CORS(app)

@app.route('/register', methods=['POST', 'GET', 'DELETE'])
def home():
    if request.method == 'POST':
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

        dbHandler.register_user(username, password)
        users = dbHandler.retrieve_users()
        rtn_val = {}
        rtn_val['status'] = "Success"
        rtn_val['users'] = users

        return jsonify(rtn_val)
    elif request.method == 'GET':
        users = dbHandler.retrieve_users()
        
        return jsonify(users)
    elif request.method == 'DELETE':
        return jsonify({'error':"Wrong request"})
    else:
        # Usually it gets handled automatically by Flask
        return jsonify({'error':"Wrong request"})
        

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
