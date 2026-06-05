from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.investment import Investment

from app.schemas.user import UserCreate
from app.schemas.user import IncomeUpdate

from app.services.xp_service import (
    calculate_percent,
    calculate_xp,
    calculate_level
)

router = APIRouter()


@router.post("/users")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    new_user = User(
        name=user.name,
        email=user.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }


@router.post("/users/income")
def set_income(
    data: IncomeUpdate,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        return {
            "error": "User not found"
        }

    user.monthly_income = data.income

    db.commit()

    return {
        "message": "Income updated",
        "income": user.monthly_income
    }


@router.get("/users/{user_id}/stats")
def get_stats(
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

    return {
        "income": user.monthly_income,
        "invested": total_invested,
        "investment_percent": percent,
        "xp": xp,
        "level": level
    }