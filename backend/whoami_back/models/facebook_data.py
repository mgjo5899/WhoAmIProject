from sqlalchemy import Column, ForeignKey
from sqlalchemy import String, Integer

from whoami_back.models.base import Base
from whoami_back.models.whiteboard_data import WhiteboardData


class FacebookData(Base):
    __tablename__ = 'facebook_data'

    # Unmodifiable information
    id = Column(Integer, primary_key=True, autoincrement=True)
    whiteboard_data_id = Column(Integer, ForeignKey(WhiteboardData.id), nullable=False)
    raw_content_url = Column(String(300), nullable=False)
    facebook_url = Column(String(300), nullable=False)
    orig_width = Column(Integer, nullable=False)
    orig_height = Column(Integer, nullable=False)

    # Modifiable information
    curr_width = Column(Integer, nullable=True)
    curr_height = Column(Integer, nullable=True)
