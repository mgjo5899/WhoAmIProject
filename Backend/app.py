from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
import models as dbHandler
import json

app = Flask(__name__)
CORS(app)

@app.route('/register', methods=['POST'])
def home():
    req = json.loads(request.data.decode("utf-8"))
    username = req['username']
    password = req['password']
    dbHandler.register_user(username, password)
    users = dbHandler.retrieve_users()

    return jsonify(users)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
