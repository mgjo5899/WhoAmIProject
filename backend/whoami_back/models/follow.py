from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy import PrimaryKeyConstraint

from whoami_back.models.base import Base
from whoami_back.models.user import User


class Follow(Base):
    __tablename__ = 'follow'
    __table_args__ = (PrimaryKeyConstraint('followed_user_username', 'follower_username'),)

    followed_user_username = Column(String(250), ForeignKey(User.username), nullable=False)
    follower_username = Column(String(250), ForeignKey(User.username), nullable=False)
    status = Column(Integer, nullable=True) # For pending following request purpose
