# WhoAmI API Documentation

- [Authentication](#authentication)  
- [Whiteboard](#whiteboard)
- [Instagram](#instagram)
- [Facebook](#facebook)
- [User Data](#user-data)

## Authentication

## User Signin [/signin]

### Check user credential with session [GET]


(Credential in session required) This API signs a user in if correct session found

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

(Credential in session required) Signing out by removing session data.

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

(Credential in session required) This endpoint resets a user's password.
When a user presses reset button in password
reset email and his/her token is correct, then it directs the user to this endpoint.

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
                    "id": 3,
                    "medium": "instagram",
                    "type": "image",
                    "pos_x": 381,
                    "pos_y": 56,
                    "status": 1,
                    "last_modified": "Tue, 19 Mar 2019 21:54:41 GMT",
                    "specifics": {
                        "orig_height": 640,
                        "orig_width": 640,
                        "curr_height": 200,
                        "curr_width": 200,
                        "content_url": "https://www.instagram.com/p/BsgqgMIFOLYtWUVgkt6d9v6McEw7x99KFerztw0/",
                        "raw_content_url": "https://scontent.cdninstagram.com/vp/9f4a41d8a9add1cf3e6efc75df0e6ef4/5D20C069/t51.2885-15/sh0.08/e35/s640x640/49759352_2281406505226870_3927099686951390228_n.jpg?_nc_ht=scontent.cdninstagram.com"
                    }
                },
                {
                    "id": 1,
                    "medium": "whoami",
                    "type": "profile",
                    "pos_x": 33,
                    "pos_y": 33,
                    "status": 1,
                    "last_modified": "Thu, 25 Apr 2019 16:35:16 GMT",
                    "specifics": {
                        "curr_height": 100,
                        "curr_width": 100,
                        "bio": "something bio",
                        "company": "some company",
                        "location": "some location",
                        "profile_image_url": "https://hi.com",
                        "website": "https://somewebsite.com",
                        "email": "mgjo5899@gmail.com"
                    }
                }
            ]
        }


## User Data on the Whiteboard [/whiteboard/user_data]

### Get user data that's on the whiteboard [GET]

(Credential in session required) This API returns data related to the user contents on the user's whiteboard.

+ Response (application/json)

        {
            "status": true,
            "whiteboard_data": [
                {
                    "id": 3,
                    "medium": "instagram",
                    "type": "image",
                    "pos_x": 381,
                    "pos_y": 56,
                    "status": 1,
                    "last_modified": "Tue, 19 Mar 2019 21:54:41 GMT",
                    "specifics": {
                        "orig_height": 640,
                        "orig_width": 640,
                        "curr_height": 200,
                        "curr_width": 200,
                        "content_url": "https://www.instagram.com/p/BsgqgMIFOLYtWUVgkt6d9v6McEw7x99KFerztw0/",
                        "raw_content_url": "https://scontent.cdninstagram.com/vp/9f4a41d8a9add1cf3e6efc75df0e6ef4/5D20C069/t51.2885-15/sh0.08/e35/s640x640/49759352_2281406505226870_3927099686951390228_n.jpg?_nc_ht=scontent.cdninstagram.com"
                    }
                },
                {
                    "id": 1,
                    "medium": "whoami",
                    "type": "profile",
                    "pos_x": 33,
                    "pos_y": 33,
                    "status": 1,
                    "last_modified": "Thu, 25 Apr 2019 16:35:16 GMT",
                    "specifics": {
                        "curr_height": 100,
                        "curr_width": 100,
                        "bio": "something bio",
                        "company": "some company",
                        "location": "some location",
                        "profile_image_url": "https://hi.com",
                        "website": "https://somewebsite.com",
                        "email": "mgjo5899@gmail.com"
                    }
                }
            ]
        }

### Add contents [POST]

(Credential in session required) This API lets you add whiteboard data.

+ Request Body (application/json)

        {
            "new_contents": [
                {
                    "type": "image",
                    "medium": "instagram",
                    "pos_x": 10,
                    "pos_y": 10,
                    "specifics": {
                        "raw_content_url": "https://scontent.cdninstagram.com/vp/9572fc0348077bef240769a0e6c06c34/5D0B6328/t51.2885-15/sh0.08/e35/s640x640/53199887_348952865719289_2176542923815712269_n.jpg?_nc_ht=scontent.cdninstagram.com",
                        "content_url": "https://www.instagram.com/p/Bu7vYu-F9z0/",
                        "orig_width": 640,
                        "orig_height": 480,
                        "curr_width": 640,
                        "curr_height": 480
                    }
                },
                {
                    "medium": "whoami",
                    "type": "profile",
                    "pos_x": 33,
                    "pos_y": 33,
                    "specifics": {
                        "curr_height": 100,
                        "curr_width": 100
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
                },
                {
                    "status": true,
                    "id": 3,
                    "medium": "whoami",
                    "email": "mgjo5899@gmail.com"
                }
            ]
        }

### Updating whiteboard data [PUT]

(Credential in session required) This API lets the whiteboard data to be updated.

+ Request Body (application/json)

        {
            "updated_contents": [
                {
                    "id": 1,
                    "medium": "instagram",
                    "pos_x": 10,
                    "pos_y": 10,
                    "specifics": {
                        "curr_width": 640,
                        "curr_height": 480
                    }
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

(Credential in session required) This API lets the whiteboard data to be deleted.

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


## Facebook

## Facebook Access Token [/facebook/get_accesstoken]

## Get User Access Token [GET]

(Credential in session required) This API is the initial step for OAuth 2.0 sign in.  It lets a user to sign in to their account through Facebook's GUI login system.  After a successful sign in, the user could give our service a permission to use his/ her contents.  It responds by redirecting the OAuth page to `/oauth_redirect` URI with medium, facebook, and status, either true or false.  If the status is false, it provides an error code for a debugging purpose.

## Facebook User Data Related [/facebook/user_data]

## Get User Data [GET]

(Credential in session required) This API returns the Facebook data of the user who is signed in at the current session.

+ Response (application/json)

        {
            "status": true,
            "email": "mgjo5899@gmail.com"
            "contents": [
                {
                    "orig_width": 640,
                    "orig_height": 640,
                    "raw_content_url": "https://scontent.cdninstagram.com/vp/a9bd4032f373574b6b2182d47e722a9d/5D0FFEFA/t51.2885-15/sh0.08/e35/s640x640/53109635_123344238777449_8694827121769313550_n.jpg?_nc_ht=scontent.cdninstagram.com",
                    "content_url": "https://www.instagram.com/p/BuwxR1vFjBm/",
                    "type": "image"
                },
                {
                    # Contents saved in whoami
                    "id": 1,
                    "pos_x": 100,
                    "pos_y": 100,
                    "last_modified": "Tue, 19 Mar 2019 21:54:41 GMT",
                    "status": 1,
                    "curr_width": 320,
                    "curr_height": 320,

                    "orig_width": 640,
                    "orig_height": 640,
                    "raw_content_url": "https://scontent.cdninstagram.com/vp/a9bd4032f373574b6b2182d47e722a9d/5D0FFEFA/t51.2885-15/sh0.08/e35/s640x640/53109635_123344238777449_8694827121769313550_n.jpg?_nc_ht=scontent.cdninstagram.com",
                    "content_url": "https://www.instagram.com/p/BuwxR1vFjBm/",
                    "type": "image"
                }
            ]
        }

## Instagram

## Instagram Access Token [/instagram/get_access_token]

## Get User Access Token [GET]

(Credential in session required) This API is the initial step for OAuth 2.0 sign in.  It lets a user to sign in to their account through Instagram's GUI login system.  After a successful sign in, the user could give our service a permission to use his/ her contents.  It responds by redirecting the OAuth page to `/oauth_redirect` URI with medium, instagram, and status, either true or false.  If the status is false, it provides an error code for a debugging purpose.

## Instagram User Data Related [/instagram/user_data]

## Get User Data [GET]

(Credential in session required) This API returns the Instagram data of the user who is signed in at the current session.

+ Response (application/json)

        {
            "status": true,
            "email": "mgjo5899@gmail.com"
            "contents": [
                {
                    # Contents new to whoami
                    "orig_width": 640,
                    "orig_height": 640,
                    "raw_content_url": "https://scontent.cdninstagram.com/vp/a9bd4032f373574b6b2182d47e722a9d/5D0FFEFA/t51.2885-15/sh0.08/e35/s640x640/53109635_123344238777449_8694827121769313550_n.jpg?_nc_ht=scontent.cdninstagram.com",
                    "content_url": "https://www.instagram.com/p/BuwxR1vFjBm/",
                    "type": "image"
                },
                {
                    # Contents saved in whoami
                    "id": 1,
                    "pos_x": 100,
                    "pos_y": 100,
                    "last_modified": "Tue, 19 Mar 2019 21:54:41 GMT",
                    "status": 1,
                    "curr_width": 320,
                    "curr_height": 320,

                    "orig_width": 640,
                    "orig_height": 640,
                    "raw_content_url": "https://scontent.cdninstagram.com/vp/a9bd4032f373574b6b2182d47e722a9d/5D0FFEFA/t51.2885-15/sh0.08/e35/s640x640/53109635_123344238777449_8694827121769313550_n.jpg?_nc_ht=scontent.cdninstagram.com",
                    "content_url": "https://www.instagram.com/p/BuwxR1vFjBm/",
                    "type": "image"
                }
            ]
        }


## User Data

## Follower [/user/followers]

### Get the followers [GET]

(Credential in session required) This API gets followers of the given user.

+ Response 200 (application/json)

        {
            "status": true,
            "followers": [
                "some",
                "user",
                "that",
                "iknow"
            ]
        }

### Remove a follower [DELETE]

(Credential in session required) This API removes the given follower.

+ Request Body (application/json)
    
        {
            "follower_username": "some_follower_username"
        }

+ Response 200 (application/json)

        {
            "status": true,
            "message": "Successfully removed the given follower",
            "follower_username": "some_follower_username",
            "followed_user_username": "my_username"
        }

## Following user [/user/following_users]

### Get the following users [GET]

(Credential in session required) This API gets following users of the given user.

+ Response 200 (application/json)

        {
            "status": true,
            "following_users": [
                "some",
                "user",
                "that",
                "iknow"
            ]
        }

### Follow a user [POST]

(Credential in session required) This API lets the given user to follow another user.

+ Request Body (application/json)
    
        {
            "followed_user_username": "some_user_that_i_wanna_follow"
        }

+ Response 200 (application/json)

        {
            "status": true,
            "message": "Successfully added a follower",
            "follower_username": "my_username",
            "followed_user_username": "some_user_that_i_wanna_follow"
        }

### Unfollow a user [DELETE]

(Credential in session required) This API lets the given user to unfollow another user.

+ Request Body (application/json)
    
        {
            "followed_user_username": "some_user_i_wanna_unfollow"
        }

+ Response 200 (application/json)

        {
            "status": true,
            "message": "Successfully removed the given follower",
            "follower_username": "follower_email@gmail.com",
            "followed_user_username": "some_user_i_wanna_unfollow"
        }

## Authorized Social Media [/user/authorized_media]

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

## User Profile [/user/profile]

### Get user profile [GET]

(Credential in session required) This API gets user profile.

+ Response 200 (application/json)

        {
            "profile": {
                # Ones with an empty string as its value won't be returned
                # If include_email is set to False, email won't be returned in the profile
                "profile_image_url": "https://www.some_url.com/some_image",
                "bio": "I am someone from somewhere for something and hi.",
                "company": "whoami",
                "location": "Champaign, IL, USA",
                "website": "https://www.somewebiste.com",
                "email": "mgjo5899@gmail.com"
            },
            "email": "mgjo5899@gmail.com",
            "status": true
        }

## Update profile [POST]
(Credential in session required) This API updates a user's profile.

+ Request Body (application/json)
    
        {
            "profile_image_url": "https://www.some_url.com/some_image",
            "bio": "I am someone from somewhere for something and hi.",
            "company": "", # Could be an empty string
            "location": "Champaign, IL, USA",
            "website": "https://www.somewebiste.com",
            "include_email": True
        }

+ Response 200 (application/json)

        {
            "profile": {
                # Ones with an empty string as its value won't be returned
                "profile_image_url": "https://www.some_url.com/some_image",
                "bio": "I am someone from somewhere for something and hi.",
                "location": "Champaign, IL, USA",
                "website": "https://www.somewebiste.com",
                "email": "mgjo5899@gmail.com"
            },
            "email": "mgjo5899@gmail.com",
            "status": true,
            "message": "Successfully updated the user profile"
        }
