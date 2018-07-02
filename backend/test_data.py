import models
import utils

# Checking database
utils.db_checks()

# Populating fake user table
users = {
            'joseph':['mgjo5899@gmail.com', '1000'],
            'cho':['mgjo5899@gmail.com', '1000'],
            'kim':['mgjo5899@gmail.com', '1000'],
            'jo':['mgjo5899@gmail.com', '1000'],
            'yj':['mgjo5899@gmail.com', '1000'],
            'yjk':['mgjo5899@gmail.com', '1000'],
            'jocho':['mgjo5899@gmail.com', '1000'],
            'lee':['mgjo5899@gmail.com', '1000'],
            'park':['mgjo5899@gmail.com', '1000'],
            'mkc':['mgjo5899@gmail.com', '1000']
        }

for name in users:
    print(name, users[name])
    user = users[name]
    print(models.register_user(name, user[1], user[0]))
