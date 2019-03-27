from sqlalchemy import Column
from sqlalchemy import Integer, String, Boolean, DateTime
from datetime import datetime

from whoami_back.models.base import Base


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(250), unique=True, nullable=False)
    username = Column(String(250), unique=True, nullable=False)
    password = Column(String(250), nullable=False)
    registered_on = Column(DateTime, default=datetime.now())
    confirmed = Column(Boolean, default=False)
    confirmed_on = Column(DateTime, nullable=True)
    last_signout = Column(DateTime, nullable=True)
    last_signin = Column(DateTime, nullable=True)
