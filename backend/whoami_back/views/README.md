# WhoAmI API Documentation

- [Authentication](#authentication)  
- [Whiteboard](#whiteboard)
- [Instagram](#instagram)
- [User Data](#user-data)

## Authentication

## User Signin [/signin]

### Check user credential with session [GET]

Once you have successfully authenticated the user, session should
contain user's email and hashed_password.  This API checks if current session
contains correct user credential.

+ Response 200 (application/json)

        {
            "status": true,
            "message": "User already signed in",
            "user": {
                "confirmed": true,
                "email": "someone@email.com",
                "registered_on": "Fri, 01 Feb 2019 16:19:17 GMT",
                "username": "someone"
            }
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
            "message": "User successfully signed in",
            "user": {
                "confirmed": true,
                "email": "someone@email.com",
                "registered_on": "Fri, 01 Feb 2019 16:19:17 GMT",
                "username": "someone"
            }
        }


## User Signout [/signout]

### Signing out by removing session data [GET]

Signing out by removing session data.

+ Response 200 (application/json)

        {
            "status": true,
            "message": "User successfully signed out",
            "email": "someone@email.com"
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

+ Request Body (application/json)

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


## Whiteboard

## Get user's published data [/whiteboard/published_data]

This API returns whiteboard contents data related to the given user.

+ Request Body (application/json)

        {
            "username": "someusername",
            "secret_key": "somesecretkey"
        }

+ Response (application/json)

        {
            "status": true,
            "whiteboard_data": [
                {
                    "curr_height": 200,
                    "curr_width": 200,
                    "id": 3,
                    "instagram_url": "https://www.instagram.com/p/BsgqgMIFOLYtWUVgkt6d9v6McEw7x99KFerztw0/",
                    "last_modified": "Tue, 19 Mar 2019 21:54:41 GMT",
                    "medium": "instagram",
                    "orig_height": 640,
                    "orig_width": 640,
                    "pos_x": 381,
                    "pos_y": 56,
                    "raw_content_url": "https://scontent.cdninstagram.com/vp/9f4a41d8a9add1cf3e6efc75df0e6ef4/5D20C069/t51.2885-15/sh0.08/e35/s640x640/49759352_2281406505226870_3927099686951390228_n.jpg?_nc_ht=scontent.cdninstagram.com",
                    "status": 1,
                    "type": "image"
                }
            ]
        }


## User Data on the Whiteboard [/whiteboard/user_data]

### Get user data that's on the whiteboard [GET]

This API returns data related to the user contents on the user's whiteboard.  It requires the user credential in the session cookie.

+ Response (application/json)

        {
            "status": true,
            "whiteboard_data": [
                {
                    "curr_height": 480,
                    "curr_width": 640,
                    "id": 2,
                    "instagram_url": "https://www.instagram.com/p/Bu7vYu-F9z0/",
                    "last_modified": "Wed, 13 Mar 2019 21:20:39 GMT",
                    "medium": "instagram",
                    "orig_height": 480,
                    "orig_width": 640,
                    "pos_x": 10,
                    "pos_y": 10,
                    "raw_content_url": "https://scontent.cdninstagram.com/vp/9572fc0348077bef240769a0e6c06c34/5D0B6328/t51.2885-15/sh0.08/e35/s640x640/53199887_348952865719289_2176542923815712269_n.jpg?_nc_ht=scontent.cdninstagram.com",
                    "status": 1,
                    "type": "image"
                }
            ]
        }

### Add contents [POST]

This API lets you add whiteboard data.  It requires the user crerdential in the session cookie.

+ Request Body (application/json)

        {
            "new_contents": [
                {
                    # General information
                    "type": "image",
                    "medium": "instagram",
                    "pos_x": 10,
                    "pos_y": 10,

                    # Medium specific information
                    "instagram_specific": {
                        "raw_content_url": "https://scontent.cdninstagram.com/vp/9572fc0348077bef240769a0e6c06c34/5D0B6328/t51.2885-15/sh0.08/e35/s640x640/53199887_348952865719289_2176542923815712269_n.jpg?_nc_ht=scontent.cdninstagram.com",
                        "instagram_url": "https://www.instagram.com/p/Bu7vYu-F9z0/",
                        "orig_width": 640,
                        "orig_height": 480,
                        "curr_width": 640,
                        "curr_height": 480
                    }
                }
            ]
        }

+ Response (application/json)

        {
            "status": true,
            "addition_results": [
                {
                    "status": true,
                    "id": 2,
                    "medium": "instagram",
                    "email": "mgjo5899@gmail.com"
                }
            ]
        }

### Updating whiteboard data [PUT]

This API lets the whiteboard data to be updated.  It requirers the user crerdential in the session cookie.

+ Request Body (application/json)

        {
            "updated_contents": [
                {
                    "id": 1,
                    "medium": "instagram",
                    "pos_x": 10,
                    "pos_y": 10,
                    "curr_width": 640,
                    "curr_height": 480
                }
            ]
        }

+ Response (application/json)

        {
            "status": true,
            "update_results": [
                {
                    "status": true,
                    "id": 1,
                    "medium": "instagram",
                    "email": "mgjo5899@gmail.com"
                }
            ]
        }

### Deleting whiteboard data [DELETE]

This API lets the whiteboard data to be deleted.  It requirers the user crerdential in the session cookie.

+ Request Body (application/json)

        {
            "deleted_contents": [
                1
            ]
        }

+ Response (application/json)

        {
            "status": true,
            "delete_results": [
                {
                    "status": true,
                    "id": 1,
                    "medium": "instagram",
                    "email": "mgjo5899@gmail.com"
                }
            ]
        }


## Instagram User Data Related [/instagram/user_data]

## Get User Data [GET]

This API returns the Instagram data of the user who is signed in at the current session.

+ Response (application/json)

        {
            "status": true,
            "email": "mgjo5899@gmail.com"
            "instagram_contents": [
                {
                    "orig_width": 640,
                    "orig_height": 480,
                    "raw_content_url": "https://scontent.cdninstagram.com/vp/9572fc0348077bef240769a0e6c06c34/5D0B6328/t51.288515/sh0.08/e35/s640x640/53199887_348952865719289_2176542923815712269_n.jpg?_nc_ht=scontent.cdninstagram.com",
                    "instagram_url": "https://www.instagram.com/p/Bu7vYu-F9z0/",
                    "type": "image"
								},
                {
                    "orig_width": 640,
                    "orig_height": 640,
                    "raw_content_url": "https://scontent.cdninstagram.com/vp/a9bd4032f373574b6b2182d47e722a9d/5D0FFEFA/t51.2885-15/sh0.08/e35/s640x640/53109635_123344238777449_8694827121769313550_n.jpg?_nc_ht=scontent.cdninstagram.com",
                    "instagram_url": "https://www.instagram.com/p/BuwxR1vFjBm/",
                    "type": 'image'
                }
            ]
      }


## User Data

## Authorized Social Media

### Get authorized social media [GET]

(Credential in session required) This API gets social media that are linked to the given user.

+ Response 200 (application/json)

        {
            "authorized_medium": [
                {
                    "authorized_time": "Thu, 21 Feb 2019 15:38:51 GMT",
                    "email": "mgjo5899@gmail.com",
                    "medium": "instagram"
                }
            ],
            "status": true
        }
