from sqlalchemy import Column, ForeignKey
from sqlalchemy import String, Integer

from whoami_back.models.base import Base
from whoami_back.models.whiteboard_data import WhiteboardData
from whoami_back.models.user_profile import UserProfile


class UserProfileData(Base):
    __tablename__ = 'user_profile_data'

    # Unfodifiable information
    id = Column(Integer, primary_key=True, autoincrement=True)
    whiteboard_data_id = Column(Integer, ForeignKey(WhiteboardData.id), nullable=False)
    user_profile_id = Column(Integer, ForeignKey(UserProfile.id), nullable=False)

    # Modifiable information
    curr_width = Column(Integer, nullable=True)
    curr_height = Column(Integer, nullable=True)
