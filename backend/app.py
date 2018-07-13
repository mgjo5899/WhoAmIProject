from flask import Flask, jsonify, request, redirect
from flask import render_template
from flask_cors import CORS
from flask_mail import Message, Mail
import json

from manage import register_user, signin_user, get_users
from manage import delete_user, modify_password
from manage import confirm_email, check_email
from utils import valid_email_format, db_checks
from utils import generate_confirmation_token, confirm_token

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'whoamiapp2580'
app.config['MAIL_PASSWORD'] = 'gnsalswjddma2580'

mail = Mail(app)
CORS(app)

MAIL_DEFAULT_SENDER = 'noreply@whoami.com'

def get_req_data():
    req = None

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

def send_email(email):
    token = generate_confirmation_token(email)
    confirm_url = 'http://127.0.0.1:8000/confirm/' + token
    template = render_template('activate.html', confirm_url=confirm_url)
    subject = "Please confirm your email"

    msg = Message(
            subject,
            recipients=[email],
            html=template,
            sender=MAIL_DEFAULT_SENDER
    )

    mail.send(msg)

@app.route('/confirm/<token>', methods=['GET'])
def email_confirmation(token):
    rtn_val = {}

    email = confirm_token(token)

    if not email:
        rtn_val['status'] = False
        rtn_val['message'] = "The confirmation link is invalid or has expired"
    else:
        rtn_val = confirm_email(email)

    if rtn_val['status']:
        # Confirmed
        redirect_url = 'http://127.0.0.1:3000/#/signin'
    else:
        # Not confirmed
        redirect_url = 'http://127.0.0.1:3000/#/signup'

    return redirect(redirect_url)

@app.route('/resend', methods=['POST'])
def resend_confirmation():
    rtn_val = {}
    req = get_req_data()

    if 'email' in req:
        email = req['email']
        rtn_val = check_email(email)

        if rtn_val['status']:
            send_email(email)
            rtn_val['message'] = "The confirmation email has been sent again"
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing email"

    return jsonify(rtn_val)

@app.route('/register', methods=['POST'])
def register():
    rtn_val = {}
    req = get_req_data()

    if 'username' in req and 'password' in req and 'email' in req:
        username = req['username']
        password = req['password']
        email = req['email']

        if not valid_email_format(email):
            rtn_val['status'] = False
            rtn_val['message'] = "Email is not in a valid format"
        else:
            rtn_val = register_user(username, password, email)

            if rtn_val['status']:
                send_email(email)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing either username, password, or email"

    return jsonify(rtn_val)

@app.route('/signin', methods=['POST'])
def signin():
    rtn_val = {}

    req = get_req_data()

    if 'email' in req and 'password' in req:
        email = req['email']
        password = req['password']

        rtn_val = signin_user(email, password)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing either email or password"

    return jsonify(rtn_val)

@app.route('/users', methods=['GET', 'DELETE', 'PUT'])
def home():
    rtn_val = {}

    req = get_req_data()

    if request.method == 'PUT':
        if 'email' in req and 'password' in req and 'new_password' in req:
            email = req['email']
            password = req['password']
            new_password = req['new_password']

            rtn_val = modify_password(email, password, new_password)
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing either email, password, \
                                                                   or new_password"
            
    elif request.method == 'DELETE':
        if 'email' in req and 'password' in req:
            email = req['email']
            password = req['password']

            rtn_val = delete_user(email, password)
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing either email or password"

    elif request.method == 'GET':
        rtn_val = get_users()

    return jsonify(rtn_val)

if __name__ == '__main__':
    print("Database checking...")
    db_checks()
    app.run(debug=True, host='0.0.0.0', port=8000)
