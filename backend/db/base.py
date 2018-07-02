from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

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

    user = os.environ['MYSQL_USER']
    pw = os.environ['MYSQL_PASSWORD']
    db_host = os.environ['MYSQL_HOST']

    DB_URL =  "mysql+pymysql://{}:{}@{}/whoamiproject".format(user, pw, db_host)

    return DB_URL

engine = create_engine(get_db_url())
Session = sessionmaker(bind=engine)
Base = declarative_base()
