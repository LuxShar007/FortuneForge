from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.user import User
from app.models.investment import Investment

from app.services.xp_service import (
    calculate_percent,
    calculate_xp,
    calculate_level
)

from app.services.ai_coach import get_ai_advice

router = APIRouter()


@router.get("/ai/advice/{user_id}")
def ai_advice(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        return {
            "error": "User not found"
        }

    investments = db.query(
        Investment
    ).filter(
        Investment.user_id == user_id
    ).all()

    total_invested = sum(
        investment.amount
        for investment in investments
    )

    percent = calculate_percent(
        user.monthly_income,
        total_invested
    )

    xp = calculate_xp(percent)

    level = calculate_level(xp)

    advice = get_ai_advice(
        user.monthly_income,
        total_invested,
        percent,
        xp,
        level
    )

    return {
        "advice": advice
    }