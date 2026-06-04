from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.investment import Investment
from app.models.user import User

from app.schemas.investment import InvestmentCreate

router = APIRouter()


@router.post("/investments")
def add_investment(
    data: InvestmentCreate,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == data.user_id
    ).first()

    if not user:
        return {
            "error": "User not found"
        }

    current_investments = db.query(
        Investment
    ).filter(
        Investment.user_id == data.user_id
    ).all()

    total_invested = sum(
        investment.amount
        for investment in current_investments
    )

    if total_invested + data.amount > user.monthly_income:
        return {
            "error": "Investment exceeds monthly income"
        }

    investment = Investment(
        user_id=data.user_id,
        amount=data.amount
    )

    db.add(investment)
    db.commit()
    db.refresh(investment)

    return {
        "message": "Investment added",
        "amount": investment.amount,
        "total_invested": total_invested + data.amount
    }