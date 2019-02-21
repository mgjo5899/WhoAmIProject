from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy import PrimaryKeyConstraint
from sqlalchemy.types import TIMESTAMP
from datetime import datetime

from whoami_back.models.base import Base
from whoami_back.models.user import User


class AuthorizedMedium(Base):
    __tablename__ = 'authorized_medium'
    __table_args__ = (PrimaryKeyConstraint('email', 'medium'),)

    email = Column(String(250), ForeignKey(User.email), nullable=False)
    medium = Column(String(250), nullable=False)
    access_token = Column(String(500), nullable=True)
    authorized_time = Column(DateTime, default=datetime.now())
