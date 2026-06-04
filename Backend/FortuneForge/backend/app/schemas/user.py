from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str

from pydantic import BaseModel

class IncomeUpdate(BaseModel):
    user_id: int
    income: float