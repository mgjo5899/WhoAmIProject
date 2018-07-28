import os


# Email related
HASH_METHOD = 'sha256'
SECRET_KEY = 'my_precious'
SECURITY_PASSWORD_SALT = 'my_precious_two'
HOST_IP = '127.0.0.1'
FRONTEND_PORT = '3000'
BACKEND_PORT = '8000'
CREDENTIAL_MAX_TIME = '14400' # 4 hours in seconds

def get_mail_config():
    if 'MAIL_SERVER' not in os.environ:
        print("Please set an environment variable MAIL_SERVER")
        exit(1)

    if 'MAIL_PORT' not in os.environ:
        print("Please set an environment variable MAIL_PORT")
        exit(1)

    if 'MAIL_USERNAME' not in os.environ:
        print("Please set an environment variable MAIL_USERNAME")
        exit(1)

    if 'MAIL_PASSWORD' not in os.environ:
        print("Please set an environment variable MAIL_PASSWORD")
        exit(1)

    if 'MAIL_DEFAULT_SENDER' not in os.environ:
        print("Please set an environment variable MAIL_DEFAULT_SENDER")
        exit(1)

    mail_config = {}
    mail_config['MAIL_SERVER'] = os.environ['MAIL_SERVER']
    mail_config['MAIL_PORT'] = os.environ['MAIL_PORT']
    mail_config['MAIL_USERNAME'] = os.environ['MAIL_USERNAME']
    mail_config['MAIL_PASSWORD'] = os.environ['MAIL_PASSWORD']
    mail_config['MAIL_DEFAULT_SENDER'] = os.environ['MAIL_DEFAULT_SENDER']
    mail_config['MAIL_USE_TLS'] = True

    return mail_config


# DB related
def get_db_url():
    if 'MYSQL_USER' not in os.environ:
        print("Please set an environment variable MYSQL_USER")
        exit(1)

    if 'MYSQL_PASSWORD' not in os.environ:
        print("Please set an environment variable MYSQL_PASSWORD")
        exit(1)

    if 'MYSQL_HOST' not in os.environ:
        print("Please set an environment variable MYSQL_HOST")
        exit(1)

    if 'MYSQL_PORT' not in os.environ:
        print("Please set an environment variable MYSQL_HOST")
        exit(1)

    user = os.environ['MYSQL_USER']
    pw = os.environ['MYSQL_PASSWORD']
    db_host = os.environ['MYSQL_HOST']
    db_port = os.environ['MYSQL_PORT']

    return "mysql+pymysql://{}:{}@{}:{}/whoamiproject".format(user, pw, db_host, db_port)
