import manage
import utils

# Checking database
utils.db_checks()

# Populating fake user table
users = {
            'joseph':['mgjo5899@gmail.com', '1000'],
            'cho':['mgjo58991@gmail.com', '1000'],
            'kim':['mgjo58992@gmail.com', '1000'],
            'jo':['mgjo58993@gmail.com', '1000'],
            'yj':['mgjo58994@gmail.com', '1000'],
            'yjk':['mgjo58995@gmail.com', '1000'],
            'jocho':['mgjo58969@gmail.com', '1000'],
            'lee':['mgjo58997@gmail.com', '1000'],
            'park':['mgjo58989@gmail.com', '1000'],
            'mkc':['mgjo58999@gmail.com', '1000']
        }

for name in users:
    print(name, users[name])
    user = users[name]
    print(manage.register_user(name, user[1], user[0]))
