from sqlalchemy import Column, ForeignKey
from sqlalchemy import String, Integer

from whoami_back.models.base import Base
from whoami_back.models.user import User
from whoami_back.models.whiteboard_data import WhiteboardData


class UserFollowData(Base):
    __tablename__ = 'user_follow_data'

    # Unmodifiable information
    id = Column(Integer, primary_key=True, autoincrement=True)
    whiteboard_data_id = Column(Integer, ForeignKey(WhiteboardData.id), nullable=False)

    # Modifiable information
    curr_width = Column(Integer, nullable=True)
    curr_height = Column(Integer, nullable=True)
