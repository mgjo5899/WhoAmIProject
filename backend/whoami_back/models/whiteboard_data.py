from sqlalchemy import Column, ForeignKey
from sqlalchemy import String, Integer, DateTime
from datetime import datetime

from whoami_back.models.base import Base
from whoami_back.models.user import User


class WhiteboardData(Base):
    __tablename__ = 'whiteboard_data'
    
    # Unmodifiable information
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(250), ForeignKey(User.email), nullable=False)
    type = Column(String(250), nullable=False)
    medium = Column(String(250), nullable=False)

    # Modifiable information
    status = Column(Integer, nullable=True) # 1: being used, 2: not being used, 3: unavailable
    # TODO: Need to make status as some sort of global varialbe so we could access them with their Names not number directly
    pos_x = Column(Integer, nullable=True)
    pos_y = Column(Integer, nullable=True)
    last_modified = Column(DateTime, default=datetime.now())
