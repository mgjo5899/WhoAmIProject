from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, Boolean, DateTime
import time

from models.base import Base

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(250), unique=True, nullable=False)
    username = Column(String(250), unique=True, nullable=False)
    password = Column(String(250), nullable=False)
    registered_on = Column(DateTime, nullable=False, default=time.strftime('%Y-%m-%d %H:%M:%S'))
    confirmed = Column(Boolean, nullable=False, default=False)
    confirmed_on = Column(DateTime, nullable=True)
