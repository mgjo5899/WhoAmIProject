from flask import Flask
from flask import jsonify
from flask import request
import models as dbHandler

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def home():
    if request.method=='POST':
        username = request.form['username']
        password = request.form['password']
        dbHandler.register_user(username, password)
        users = dbHandler.retrieve_users()

        return jsonify(users)
    else:
        return jsonify(errcode="wrong_request_method")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
