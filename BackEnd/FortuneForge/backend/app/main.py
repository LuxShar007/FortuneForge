from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

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

# Enable CORS for frontend origins (Local, GitHub Pages, and Vercel domains)
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://luxshar007.github.io"
]

# Read ALLOWED_ORIGINS env variable if configured on Render
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    allowed_origins.extend([origin.strip() for origin in env_origins.split(",") if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex="https://.*\.vercel\.app",  # Automatically allow Vercel previews & production
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