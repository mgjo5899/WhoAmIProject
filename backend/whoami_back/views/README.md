# WhoAmI API Documentation

## User Signin [/signin]

### Check user credential with session [GET]

Once you have successfully authenticated the user, session should
contain user's email and hashed_password.  This API checks if current session
contains correct user credential.

+ Response 200 (application/json)

        {
            "status": true,
            "message": "Already signed in",
            "email": "someone@email.com"
        }

### Authenticate user [POST]

You can use this to authenticate users.  If the server receives a correct
credential for a user, it saves his/her email and hashed password in
the session.

+ Request Body (application/json)
    
        {
            "email": "someone@email.com",
            "password": "somepassword"
        }

+ Response 200 (application/json)

        {
            "status": true,
            "username": "someone",
            "confirmed": true
        }


## User Management [/users]

### Get all the user information [GET]

This is only here for testing purpose.

+ Response 200 (application/json)

        {
            "status": true,
            "users": [
                {
                    "email": "someone@email.com",
                    "username": "someone",
                    "registered_on": 2018-10-02 06:28:08.427133,
                    "confirmed": true
                },
                {
                    "email": "someone2@email.com",
                    "username": "someone2",
                    "registered_on": 2018-10-02 06:28:08.427133,
                    "confirmed": true
                },
                {
                    "email": "someone3@email.com",
                    "username": "someone3",
                    "registered_on": 2018-10-02 06:28:08.427133,
                    "confirmed": false
                }
            ]
        }

### Delete a user [DELETE]

+ Request Body (application/json)

        {
            "email": "someone@email.com",
            "password": "somepassword"
        }

+ Response 200 (application/json)

        {
            "status": true,
            "deleted_user": {
                "username": "someone",
                "email": "someone@email.com"
            }
        }


## User Registration [/register]

### Register a user [POST]

After the user signs up, the server sends a confirmation email to the
given email address.

+ Request Body (application/json)
	
        {
            "username": "someone",
            "password": "somepassword",
            "email" : "someone@email.com"
        }

+ Response 200 (application/json)

        {
            "status": true
        }


## Resending User Confirmation Email [/resend]

### Resend a confirmation email to the user [POST]

This API has been implemented specifically for situations where a user has
already registered himself/herself but not yet confirmed his/her email address.
When such user visits WhoAmI website, it should give them a choice to send
the confirmation email again.

+ Request Body (application/json)
    
        {
            "email": "someone@email.com",
        }

+ Response 200 (application/json)

        {
            "status": true,
            "message": "The confirmation email has been sent again"
        }


## Email Confirmation [/confirm/{token}]

### Confirm user email address [GET]

This API is only used in the situation when a user presses confirm button from
his/her confirmation email and that directs him/her to this end-point. It then
redirects the user to either /signin page or /signup page accordingly.


## Password Reset Email Generation [/send_pwreset_email]

### Sends an email to reset a user's password [POST]

This API sends a password reset email to the requested user.

+ Request Body (application/json)

        {
            "email": "someone@email.com"
        }

+ Response (application/json)

        {
            "status": true,
            "message": "The password reset email has been sent"
        }


## Password Reset [/reset_pw]

### Resets a user's password [PUT]

This endpoint resets a user's password.  When a user presses reset button in password
reset email and his/her token is correct, then it directs the user to this endpoint.
It checks on session for the user email so the user should have already logged in so
the session contains his/her email prior to this call.

+ Request (application/json)

        {
            "new_password": "somenewpassword"
        }

+ Response (application/json)

        {
            "status": true
        }


## Password Reset Confirm [/password_reset_confirm/{token}]

### Confirms on password reset [GET]

This API redirects the user to either to /signin, /reset_pw or /signup accordingly.  This
endpoint is only used when a user presses reset button in password reset email.  If the token
is valid, then it redirects to /reset_pw.
