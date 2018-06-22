from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

def get_db_url():
    if 'MYSQL_USER' not in os.environ:
        print("Please set an environment variable MYSQL_USER")
        exit(1)
    
    user = os.environ['MYSQL_USER']

    if 'MYSQL_PW' in os.environ:
        pw = ':' + os.environ['MYSQL_PW']
        DB_URL =  "mysql+pymysql://{}{}@localhost/whoamiproject".format(user, pw)
    else:
        DB_URL =  "mysql+pymysql://{}@localhost/whoamiproject".format(user)
        

    return DB_URL

engine = create_engine(get_db_url())
Session = sessionmaker(bind=engine)
Base = declarative_base()