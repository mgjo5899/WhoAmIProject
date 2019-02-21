# WhoAmI API Documentation

- [Authentication Related](#authentication-related)  
- [Instagram Related](#instagram-related)
- [User Data Related](#user-related)

## Authentication Related

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


## Instagram Related 

## Instagram Registration [/instagram/register]

### Registers user's Instagram account [POST]

This endpoint lets our server know that the user linked his/her Instagram account with us.
It uses email and hashed password from session.

+ Request Body (application/json)

        {
            "username": "someone"
        }

+ Response (application/json)

        {
            "status": true,
            "authorized_time": 2018-10-02 06:28:08.427133,
            "message": "Successfully registered Instagram account for the user"
        }


## Instagram User Data Related [/instagram/user_data]

## Get User Data [GET]

This API returns the Instagram data of the user who is signed in at the current session.

+ Response (application/json)

        {
            "status": true,
            "user_contents": {
                "data": [
                    {
                        "attribution": null,
                        "caption": {
                            "created_time": "1543101854",
                            "from": {
                                "full_name": "Joseph",
                                "id": "8042456766",
                                "profile_picture": "https://scontent.cdninstagram.com/vp/9899a40ccd4f9765d75e355c5739f352/5D07C873/t51.2885-19/s150x150/44831401_184970409123036_7553494893973209088_n.jpg?_nc_ht=scontent.cdninstagram.com",
                                "username": "jocho5899"
                            },
                            "id": "17972641885146331",
                            "text": "With a “French” baguette"
                        },
                        "comments": {
                            "count": 3
                        },
                        "created_time": "1543101854",
                        "filter": "Normal",
                        "id": "1919999970989366104_8042456766",
                        "images": {
                            "low_resolution": {
                                "height": 399,
                                "url": "https://scontent.cdninstagram.com/vp/09897749bd656fe3a87e54503616096b/5D04A991/t51.2885-15/e35/p320x320/45485924_2144074302280621_5191338174935045848_n.jpg?_nc_ht=scontent.cdninstagram.com",
                                "width": 320
                            },
                            "standard_resolution": {
                                "height": 799,
                                "url": "https://scontent.cdninstagram.com/vp/eb6f1d65cce1c7b255367d199dd554c3/5CF3976C/t51.2885-15/sh0.08/e35/p640x640/45485924_2144074302280621_5191338174935045848_n.jpg?_nc_ht=scontent.cdninstagram.com",
                                "width": 640
                            },
                            "thumbnail": {
                                "height": 150,
                                "url": "https://scontent.cdninstagram.com/vp/031cae442f2d951069e4eef3e82cad40/5D211E9D/t51.2885-15/e35/c0.134.1080.1080/s150x150/45485924_2144074302280621_5191338174935045848_n.jpg?_nc_ht=scontent.cdninstagram.com",
                                "width": 150
                            }
                        },
                        "likes": {
                            "count": 44
                        },
                        "link": "https://www.instagram.com/p/BqlNc0PlNtY/",
                        "location": {
                            "id": 129643084,
                            "latitude": 43.7034,
                            "longitude": 7.2663,
                            "name": "Nice, France"
                        },
                        "tags": [],
                        "type": "image",
                        "user": {
                            "full_name": "Joseph",
                            "id": "8042456766",
                            "profile_picture": "https://scontent.cdninstagram.com/vp/9899a40ccd4f9765d75e355c5739f352/5D07C873/t51.2885-19/s150x150/44831401_184970409123036_7553494893973209088_n.jpg?_nc_ht=scontent.cdninstagram.com",
                            "username": "jocho5899"
                        },
                        "user_has_liked": false,
                        "users_in_photo": [
                            {
                                "position": {
                                    "x": 0.4293333333,
                                    "y": 0.5386666667000001
                                },
                                "user": {
                                    "username": "daily.baguette"
                                }
                            }
                        ]
                    }
                ],
                "meta": {
                    "code": 200
                },
                "pagination": {}
            }
        }

## Instagram Update [/instagram/update]

### Data Addition Or Deletion [POST]

This API gets called when there are things to add or delete from the user's Instagram DB
regarding the images.  It uses email and hashed password from session.

+ Request Body (application/json)

        {
            "addition": [
                {
                    "id": "1839568314821633189_8042456766",
                    "instagram_url": "https://www.instagram.com/p/BmHdaLJAeSl/",
                    "raw_image_url": "https://scontent.cdninstagram.com/vp/a218bc14fedb259d5e22b8bd58e5b47d/5BF6828E/t51.2885-15/sh0.08/e35/s640x640/37930134_844689042390902_1407567392577421312_n.jpg",
                    "orig_width": 640,
                    "orig_height": 479
                }
            ],
            "deletion": [
                "1839568314821633189_8042456766",  # Image ID
                "1839568314821633189_8042456766",
                ...
            ]
        }

+ Response (application/json)

        {
            "additions": [
                {
                    "status": true,
                    "image_id": "1839568314821633189_8042456766",
                },
                {
                    "status": false,
                    "message": "Image already added",
                    "image_id": "1839568314821633189_8042456766",
                }
            ],
            "deletions": [
                {
                    "status": true,
                    "deleted_image": {
                        "image_id": "1839568314821633189_8042456766",
                        "raw_image_url": "https://scontent.cdninstagram.com/vp/a218bc14fedb259d5e22b8bd58e5b47d/5BF6828E/t51.2885-15/sh0.08/e35/s640x640/37930134_844689042390902_1407567392577421312_n.jpg"
                    }
                },
                {
                    "status": false,
                    "message": "There is no image of the user with the image_id",
                    "image_id": "1839568314821633189_8042456766"
                }
            ]
        }


## User Related

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
