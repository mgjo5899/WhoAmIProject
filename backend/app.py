from flask import Flask, session, jsonify, request, redirect
from flask import render_template
from flask_cors import CORS
from flask_mail import Message, Mail
import json

from manage import register_user, signin_user, get_users
from manage import delete_user, modify_password
from manage import confirm_email, check_email
from utils import valid_email_format, db_checks, db_close
from utils import generate_email_token, confirm_token


app = Flask(__name__)
app.secret_key = b'gkdlakdlspdladlwmwhtpq'       # secret key for session
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'whoamiapp2580'    # project username in gmail
app.config['MAIL_PASSWORD'] = 'gnsalswjddma2580' # 훈민정음2580

MAIL_DEFAULT_SENDER = 'noreply@whoami.com'
HOST_IP = '127.0.0.1'
FRONTEND_PORT = '3000'
BACKEND_PORT = '8000'
CREDENTIAL_MAX_TIME = '14400' # 4 hours

mail = Mail(app)
CORS(app=app, supports_credentials=True, max_age=CREDENTIAL_MAX_TIME)


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

def send_email(email, template, subject):
    msg = Message(
            subject,
            recipients=[email],
            html=template,
            sender=MAIL_DEFAULT_SENDER
    )

    mail.send(msg)

@app.route('/password_reset_confirm/<token>', methods=['GET'])
def password_reset(token):
    email = confirm_token(token)

    if not email:
        # Email wasn't found or time expired
        # Come up with an error page for this
        redirect_url = 'http://{}:{}/#/signin'.format(HOST_IP, FRONTEND_PORT)
    else:
        rtn_val = check_email(email)

        if rtn_val['status']:
            # Found email was valid; let the user reset the password
            redirect_url = 'http://{}:{}/#/reset_password'.format(HOST_IP, FRONTEND_PORT)
            session['email'] = email
        else:
            # Not a valid email
            redirect_url = 'http://{}:{}/#/signup'.format(HOST_IP, FRONTEND_PORT)

    return redirect(redirect_url)

@app.route('/reset_pw', methods=['PUT'])
def reset_password():
    rtn_val = {}
    req = get_req_data()

    if 'email' in session and 'new_password' in req:
        email = session['email']
        new_password = req['new_password']

        rtn_val = modify_password(email, password, new_password)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing either email, password, \
                                                                   or new_password"

    return jsonify(rtn_val)

@app.route('/send_pwreset_email', methods=['POST'])
def send_pwreset_email():
    rtn_val = {}
    req = get_req_data()

    if 'email' in req:
        email = req['email']
        rtn_val = check_email(email)

        if rtn_val['status']:
            token = generate_email_token(email)
            pwreset_url = 'http://{}:{}/password_reset_confirm/{}'.format(HOST_IP, BACKEND_PORT, token)
            template = render_template('pwreset.html', pwreset_url=pwreset_url)
            subject = "Reset your whoami password"

            send_email(email, template, subject)
            rtn_val['message'] = "The password reset email has been sent"
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing email"

    return jsonify(rtn_val)

@app.route('/confirm/<token>', methods=['GET'])
def email_confirmation(token):
    email = confirm_token(token)

    if not email:
        # Invalid email or time expired
        # Come up with an error page for this
        redirect_url = 'http://{}:{}/#/signin'.format(HOST_IP, FRONTEND_PORT)
    else:
        rtn_val = confirm_email(email)

        if rtn_val['status']:
            # Confirmed
            redirect_url = 'http://{}:{}/#/signin'.format(HOST_IP, FRONTEND_PORT)
        else:
            # Not confirmed
            redirect_url = 'http://{}:{}/#/signup'.format(HOST_IP, FRONTEND_PORT)

    return redirect(redirect_url)

@app.route('/resend', methods=['POST'])
def resend_confirmation():
    rtn_val = {}
    req = get_req_data()

    if 'email' in req:
        email = req['email']
        rtn_val = check_email(email)

        if rtn_val['status']:
            token = generate_email_token(email)
            confirm_url = 'http://{}:{}/confirm/{}'.format(HOST_IP, BACKEND_PORT, token)
            template = render_template('activate.html', confirm_url=confirm_url)
            subject = "Please confirm your email"

            send_email(email, template, subject)
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
                token = generate_email_token(email)
                confirm_url = 'http://{}:{}/confirm/{}'.format(HOST_IP, BACKEND_PORT, token)
                template = render_template('activate.html', confirm_url=confirm_url)
                subject = "Please confirm your email"

                send_email(email, template, subject)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing either username, password, or email"

    return jsonify(rtn_val)

@app.route('/signin', methods=['GET', 'POST'])
def signin():
    rtn_val = {}
    req = get_req_data()
    print(session)
    print(req)

    if request.method == 'GET':
        if 'email' in session and 'password' in session:
            if signin_user(session['email'], session['password'], hashed=True):
                rtn_val['status'] = True
                rtn_val['message'] = "Already signed in"
                rtn_val['email'] = session['email']
            else:
                rtn_val['status'] = False
                rtn_val['message'] = "Incorrect credential in session token"
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Not signed in"
    elif request.method == 'POST':
        req = get_req_data()

        if 'email' in req and 'password' in req:
            email = req['email']
            password = req['password']

            rtn_val = signin_user(email, password)

            if rtn_val['status']:
                session['email'] = email
                session['password'] = rtn_val['pw']
                _ = rtn_val.pop('pw')
                print("Successfully put email and password in session")
                print(session)
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing either email or password"

    return jsonify(rtn_val)

@app.route('/users', methods=['GET', 'DELETE'])
def home():
    rtn_val = {}

    req = get_req_data()

    if request.method == 'DELETE':
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
    db_close()
