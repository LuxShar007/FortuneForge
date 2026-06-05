from pydantic import BaseModel

class InvestmentCreate(BaseModel):
    user_id: int
    amount: float