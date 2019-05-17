from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy import PrimaryKeyConstraint

from whoami_back.models.base import Base
from whoami_back.models.user import User


class Follow(Base):
    __tablename__ = 'follow'
    __table_args__ = (PrimaryKeyConstraint('followed_user_email', 'follower_email'),)

    followed_user_email = Column(String(250), ForeignKey(User.email), nullable=False)
    follower_email = Column(String(250), ForeignKey(User.email), nullable=False)
    status = Column(Integer, nullable=True)
