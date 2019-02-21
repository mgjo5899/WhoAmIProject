import whoami_back.manage as manage
import whoami_back.utils as utils

# Checking database
utils.reset_db()

# Populating fake user table
users = {
            '{username}':['{email}', '{password}']
        }

for name in users:
    print(name, users[name])
    user = users[name]
    print(manage.register_user(name, user[1], user[0]))
    print(manage.confirm_email(user[0]))

utils.db_close()
