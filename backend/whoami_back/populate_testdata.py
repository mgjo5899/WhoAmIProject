import whoami_back.manage as manage
import whoami_back.utils as utils

# Checking database
utils.reset_db()

# Populating fake user table
users = {
            'user1':['mgjo5899@gmail.com', '1000'],
            'user2':['mcho14@illinois.edu', '1000'],
            'user3':['mkc.k2580@google.com', '1000']
        }

for name in users:
    print('')
    print("Populating a user")
    print(name, users[name])
    user = users[name]
    print(manage.register_user(name, user[1], user[0]))
    print(manage.confirm_email(user[0]))
    print('')

utils.db_close()

# TODO: Create functions for testing out each of the following listed item:
#           1. Follower relationship
