from sqlalchemy import Column, ForeignKey, Boolean
from sqlalchemy import String, Integer

from whoami_back.models.base import Base
from whoami_back.models.user import User


class UserProfile(Base):
    __tablename__ = 'user_profile'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(250), ForeignKey(User.email), nullable=False)

    profile_image_url = Column(String(300), nullable=False)
    bio = Column(String(300), nullable=False)
    company = Column(String(250), nullable=False)
    location = Column(String(250), nullable=False)
    website = Column(String(250), nullable=False)
    include_email = Column(Boolean, default=False, nullable=False)
