from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
    monthly_income = Column(Float, default=0.0)
    expenses = Column(Float, default=0.0)
    risk_profile = Column(String, default="")
    character_class = Column(String, default="")
    baseline_configured = Column(Integer, default=0)
    total_xp = Column(Integer, default=350) # Start with 350 XP matching local config
    level = Column(Integer, default=1)
    profile_picture = Column(String, default="")
    completed_quests = Column(String, default="")