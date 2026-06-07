from typing import Optional
from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    google_id: Mapped[Optional[str]] = mapped_column(String, unique=True, nullable=True)
    monthly_income: Mapped[float] = mapped_column(Float, default=0.0)
    expenses: Mapped[float] = mapped_column(Float, default=0.0)
    risk_profile: Mapped[str] = mapped_column(String, default="")
    character_class: Mapped[str] = mapped_column(String, default="")
    baseline_configured: Mapped[int] = mapped_column(Integer, default=0)
    total_xp: Mapped[int] = mapped_column(Integer, default=350) # Start with 350 XP matching local config
    level: Mapped[int] = mapped_column(Integer, default=1)
    profile_picture: Mapped[str] = mapped_column(String, default="")
    completed_quests: Mapped[str] = mapped_column(String, default="")