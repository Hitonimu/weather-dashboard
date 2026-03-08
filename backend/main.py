"""
Weather Insight Dashboard - FastAPI Backend
Main application entry point with CORS, database init, and route registration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import engine, Base
from routes import weather


# ── Lifespan: create DB tables on startup ───────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


# ── App factory ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="Weather Insight API",
    description="Real-time weather dashboard powered by OpenWeatherMap",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow all origins in dev; tighten in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers ─────────────────────────────────────────────────────────
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])


@app.get("/")
def root():
    return {"message": "Weather Insight API is running 🌤️"}
