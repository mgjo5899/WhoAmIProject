import manage
import utils

# Checking database
utils.reset_db()

# Populating fake user table
users = {
            'joseph':['mgjo5899@gmail.com', '1000']
        }

for name in users:
    print(name, users[name])
    user = users[name]
    print(manage.register_user(name, user[1], user[0]))
    print(manage.confirm_email(user[0]))

utils.db_close()
