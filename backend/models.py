"""
models.py
SQLAlchemy ORM models for the weather dashboard.

Tables
──────
  weather_cache   – cached API responses (avoids hammering OpenWeatherMap)
  weather_alert   – active severe-weather alerts
  saved_location  – user-saved cities
"""

from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean, Text
from database import Base


class WeatherCache(Base):
    """
    Stores the last known current-weather response for a city.
    TTL is enforced in the route layer (not the DB).
    """

    __tablename__ = "weather_cache"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), index=True, nullable=False)
    country_code = Column(String(10), nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)

    # Core weather
    temperature = Column(Float)
    feels_like = Column(Float)
    temp_min = Column(Float)
    temp_max = Column(Float)
    humidity = Column(Integer)
    pressure = Column(Integer)
    visibility = Column(Integer)          # metres
    weather_main = Column(String(50))     # e.g. "Clouds"
    weather_description = Column(String(100))
    weather_icon = Column(String(20))

    # Wind
    wind_speed = Column(Float)            # m/s
    wind_deg = Column(Integer)

    # Rain/snow
    rain_1h = Column(Float, default=0.0)
    snow_1h = Column(Float, default=0.0)

    # Meta
    fetched_at = Column(DateTime, default=datetime.utcnow)
    raw_json = Column(Text, nullable=True)   # full OWM response for debugging


class WeatherAlert(Base):
    """
    Severe-weather alerts pushed from OpenWeatherMap One Call API.
    """

    __tablename__ = "weather_alert"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), index=True)
    sender_name = Column(String(200))
    event = Column(String(200))            # e.g. "Thunderstorm Warning"
    start = Column(DateTime)
    end = Column(DateTime)
    description = Column(Text)
    severity = Column(String(50))          # extreme / severe / moderate / minor
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class SavedLocation(Base):
    """
    Cities the user has bookmarked.
    """

    __tablename__ = "saved_location"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), nullable=False)
    country_code = Column(String(10))
    lat = Column(Float)
    lon = Column(Float)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
