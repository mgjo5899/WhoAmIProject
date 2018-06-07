from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS
import models as dbHandler

app = Flask(__name__)
CORS(app)

@app.route('/register', methods=['POST'])
def home():


    #username = request.form['username']
    #password = request.form['password']
    print('req')
    #dbHandler.register_user(username, password)
    #users = dbHandler.retrieve_users()

    return 'dd'#username#'ddd'#request.form#'ddd'#jsonify(users)


if __name__ == '__main__':
    app.run(debug=True)

home()