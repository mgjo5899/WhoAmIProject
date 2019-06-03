from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base

from whoami_back.config import get_db_url


engine = create_engine(get_db_url())
session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)
db = Session()

Base = declarative_base()
