from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base
from app.db.database import engine

from app.models.user import User
from app.models.investment import Investment

from app.routes.user import router as user_router
from app.routes.auth import router as auth_router

from app.routes.investment import router as investment_router
from app.routes.ai import router as ai_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FortuneForge"
)

# Enable CORS for frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "FortuneForge Running"
    }

app.include_router(investment_router)

app.include_router(ai_router)