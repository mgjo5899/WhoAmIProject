import whoami_back.manage as manage
import whoami_back.utils as utils

# Checking database
utils.reset_db()

# Populating fake user table
users = {
            'user1':['user1@gmail.com', '1000'],
            'user2':['user2@gmail.com', '1000'],
            'user3':['user3@gmail.com', '1000']
        }

for username in users:
    print('')
    print("Populating a user")
    print(username, users[username])
    user = users[username]
    print(manage.register_user(username, user[1], user[0]))
    print(manage.confirm_email(user[0]))
    print('')

print('')
print("Adding follow relationship")
for follower in users:
    for followed_user in users:
        if follower != followed_user:
            print(manage.add_follower(follower, followed_user))
            print('')

utils.db_close()
