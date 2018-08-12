from sqlalchemy import Column, ForeignKey
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.types import TIMESTAMP
from datetime import datetime

from whoami_back.models.base import Base
from whoami_back.models.user import User


class InstagramData(Base):
    __tablename__ = 'instagram_data'
    
    # Unmodifiable information
    id = Column(String(250), primary_key=True, nullable=False)
    email = Column(String(250), ForeignKey(User.email), nullable=False)
    raw_image_url = Column(String(300), nullable=False)
    instagram_url = Column(String(300), nullable=False)
    orig_width = Column(Integer, nullable=False)
    orig_height = Column(Integer, nullable=False)

    # Modifiable information
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    pos_x = Column(Integer, nullable=True)
    pos_y = Column(Integer, nullable=True)
    angle = Column(Integer, nullable=True)
    last_modified = Column(DateTime, default=datetime.now())
