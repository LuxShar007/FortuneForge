from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True)

    monthly_income = Column(Float, default=0)

    total_xp = Column(Integer, default=0)

    level = Column(Integer, default=1)