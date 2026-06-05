from sqlalchemy import Column, Integer, Float, ForeignKey
from app.db.database import Base

class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    amount = Column(Float)