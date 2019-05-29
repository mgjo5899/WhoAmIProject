import whoami_back.manage as manage
import whoami_back.utils as utils

###############################################################################################
# RESETTING DATABASE
utils.reset_db()

###############################################################################################
# FAKE USER DATA
users = [
            {
                'username': 'user1',
                'email': 'user1@gmail.com',
                'password': '1000',
                'profile_image_url': 'https://i.imgur.com/9mUgJD7.png',
                'bio': "User1 bio",
                'company': "user1 company",
                'location': "user1 location",
                'website': "user1 website",
                'include_email': True
            },
            {
                'username': 'user2',
                'email': 'user2@gmail.com',
                'password': '1000',
                'profile_image_url': 'https://i.imgur.com/tmwpZp5.png',
                'bio': "User1 bio",
                'company': "user1 company",
                'location': "user1 location",
                'website': "user1 website",
                'include_email': True
            },
            {
                'username': 'user3',
                'email': 'user3@gmail.com',
                'password': '1000',
                'profile_image_url': 'https://i.imgur.com/UuhqYsu.png',
                'bio': "User1 bio",
                'company': "user1 company",
                'location': "user1 location",
                'website': "user1 website",
                'include_email': True
            }
        ]

###############################################################################################
# POPULATING USERS
print('')
print("Populating users")
for user in users:
    print(user)
    print(manage.register_user(user['username'], user['password'], user['email']))
    print(manage.confirm_email(user['email']))
    print('')

###############################################################################################
# ADDING FOLLOW RELATIONSHIP
print('')
print("Adding follow relationship")
for follower in users:
    for followed_user in users:
        if follower['username'] != followed_user['username']:
            print(manage.add_follower(follower['username'], followed_user['username']))
            print('')

###############################################################################################
# ADDING USER PROFILE
print('')
print("Adding user profile")
for user in users:
    print('')
    print(manage.update_user_profile(user['email'], user['profile_image_url'], user['bio'], \
                                     user['company'], user['location'], user['website'], \
                                     user['include_email']))

###############################################################################################
# FINAL DATABASE CLOSE
utils.db_close()
