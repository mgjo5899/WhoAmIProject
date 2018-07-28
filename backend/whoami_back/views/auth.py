from flask import Flask, session, jsonify, request, redirect
from flask import render_template, Blueprint
from flask_cors import CORS
import json

import whoami_back.manage as manage
import whoami_back.utils as utils
import whoami_back.config as config


auth = Blueprint('auth', __name__)


@auth.route('/password_reset_confirm/<token>', methods=['GET'])
def password_reset(token):
    email = utils.confirm_token(token)

    if not email:
        # Email wasn't found or time expired
        # Come up with an error page for this
        redirect_url = 'http://{}:{}/#/signin'.format(config.HOST_IP, config.FRONTEND_PORT)
    else:
        rtn_val = manage.check_email(email)

        if rtn_val['status']:
            # Found email was valid; let the user reset the password
            redirect_url = 'http://{}:{}/#/reset_password'.format(config.HOST_IP, config.FRONTEND_PORT)
            session['email'] = email
        else:
            # Not a valid email
            redirect_url = 'http://{}:{}/#/signup'.format(config.HOST_IP, config.FRONTEND_PORT)

    return redirect(redirect_url)

@auth.route('/reset_pw', methods=['PUT'])
def reset_password():
    rtn_val = {}
    req = utils.get_req_data()

    if 'email' in session and 'new_password' in req:
        email = session['email']
        new_password = req['new_password']

        rtn_val = manage.modify_password(email, new_password)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing either email, password, or new_password"

    return jsonify(rtn_val)

@auth.route('/send_pwreset_email', methods=['POST'])
def send_pwreset_email():
    rtn_val = {}
    req = utils.get_req_data()

    if 'email' in req:
        email = req['email']
        rtn_val = manage.check_email(email)

        if rtn_val['status']:
            token = utils.generate_email_token(email)
            pwreset_url = 'http://{}:{}/password_reset_confirm/{}'.format(config.HOST_IP, config.BACKEND_PORT, token)
            template = render_template('pwreset.html', pwreset_url=pwreset_url)
            subject = "Reset your whoami password"

            utils.send_email(email, template, subject)
            rtn_val['message'] = "The password reset email has been sent"
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing email"

    return jsonify(rtn_val)

@auth.route('/confirm/<token>', methods=['GET'])
def email_confirmation(token):
    email = utils.confirm_token(token)

    if not email:
        # Invalid email or time expired
        # Come up with an error page for this
        redirect_url = 'http://{}:{}/#/signin'.format(config.HOST_IP, config.FRONTEND_PORT)
    else:
        rtn_val = manage.confirm_email(email)

        if rtn_val['status']:
            # Confirmed
            redirect_url = 'http://{}:{}/#/signin'.format(config.HOST_IP, config.FRONTEND_PORT)
        else:
            # Not confirmed
            redirect_url = 'http://{}:{}/#/signup'.format(config.HOST_IP, config.FRONTEND_PORT)

    return redirect(redirect_url)

@auth.route('/resend', methods=['POST'])
def resend_confirmation():
    rtn_val = {}
    req = utils.get_req_data()

    if 'email' in req:
        email = req['email']
        rtn_val = manage.check_email(email)

        if rtn_val['status']:
            token = utils.generate_email_token(email)
            confirm_url = 'http://{}:{}/confirm/{}'.format(config.HOST_IP, config.BACKEND_PORT, token)
            template = render_template('activate.html', confirm_url=confirm_url)
            subject = "Please confirm your email"

            utils.send_email(email, template, subject)
            rtn_val['message'] = "The confirmation email has been sent again"
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing email"

    return jsonify(rtn_val)

@auth.route('/register', methods=['POST'])
def register():
    rtn_val = {}
    req = utils.get_req_data()

    if 'username' in req and 'password' in req and 'email' in req:
        username = req['username']
        password = req['password']
        email = req['email']

        if not utils.valid_email_format(email):
            rtn_val['status'] = False
            rtn_val['message'] = "Email is not in a valid format"
        else:
            rtn_val = manage.register_user(username, password, email)

            if rtn_val['status']:
                token = utils.generate_email_token(email)
                confirm_url = 'http://{}:{}/confirm/{}'.format(config.HOST_IP, config.BACKEND_PORT, token)
                template = render_template('activate.html', confirm_url=confirm_url)
                subject = "Please confirm your email"

                utils.send_email(email, template, subject)
    else:
        rtn_val['status'] = False
        rtn_val['message'] = "Request is missing either username, password, or email"

    return jsonify(rtn_val)

@auth.route('/signin', methods=['GET', 'POST'])
def signin():
    rtn_val = {}
    req = utils.get_req_data()
    print(session)
    print(req)

    if request.method == 'GET':
        if 'email' in session and 'password' in session:
            if manage.signin_user(session['email'], session['password'], hashed=True):
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
        req = utils.get_req_data()

        if 'email' in req and 'password' in req:
            email = req['email']
            password = req['password']

            rtn_val = manage.signin_user(email, password)

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

@auth.route('/users', methods=['GET', 'DELETE'])
def home():
    rtn_val = {}

    req = utils.get_req_data()

    if request.method == 'DELETE':
        if 'email' in req and 'password' in req:
            email = req['email']
            password = req['password']

            rtn_val = manage.delete_user(email, password)
        else:
            rtn_val['status'] = False
            rtn_val['message'] = "Request is missing either email or password"

    elif request.method == 'GET':
        rtn_val = manage.get_users()

    return jsonify(rtn_val)

if __name__ == '__main__':
    print("Database checking...")
    utils.db_checks()
    app.run(debug=True, host='0.0.0.0', port=8000)
    utils.db_close()