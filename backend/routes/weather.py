"""
routes/weather.py — WeatherAPI.com integration (real-time, no wait!)
"""
import asyncio, os, json, httpx, random
import os, json, httpx, random
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import WeatherCache, WeatherAlert, SavedLocation

router = APIRouter()

WEATHER_API_KEY = os.getenv("WEATHERAPI_KEY", "YOUR_KEY_HERE")
WEATHER_API_BASE = "https://api.weatherapi.com/v1"
CACHE_TTL = 10

class LocationCreate(BaseModel):
    city: str
    country_code: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    is_default: bool = False

def _wind_dir(deg: int) -> str:
    return ["U","TL","T","TG","S","BD","B","BL"][round(deg/45)%8]

def _uv_label(uv):
    if uv < 3: return "Rendah"
    if uv < 6: return "Sedang"
    if uv < 8: return "Tinggi"
    if uv < 11: return "Sangat Tinggi"
    return "Ekstrem"

async def _fetch_current(city: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(f"{WEATHER_API_BASE}/current.json", params={
            "key": WEATHER_API_KEY, "q": city, "lang": "id", "aqi": "no"
        })
        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail=r.json().get("error", {}).get("message", "Error"))
        return r.json()

async def _fetch_forecast(city: str, days: int = 7) -> dict:
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(f"{WEATHER_API_BASE}/forecast.json", params={
            "key": WEATHER_API_KEY, "q": city, "days": days, "lang": "id", "alerts": "yes", "aqi": "no"
        })
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail="Forecast gagal")
        return r.json()

def _mock_map_cities():
    return [
        {"city": "Jakarta",    "country": "ID", "lat": -6.21,  "lon": 106.85, "temp": 32, "condition": "Cerah Berawan"},
        {"city": "Surabaya",   "country": "ID", "lat": -7.25,  "lon": 112.75, "temp": 33, "condition": "Cerah"},
        {"city": "Bandung",    "country": "ID", "lat": -6.92,  "lon": 107.61, "temp": 26, "condition": "Berawan"},
        {"city": "Medan",      "country": "ID", "lat": 3.59,   "lon": 98.67,  "temp": 31, "condition": "Hujan Ringan"},
        {"city": "Semarang",   "country": "ID", "lat": -6.97,  "lon": 110.42, "temp": 32, "condition": "Cerah Berawan"},
        {"city": "Makassar",   "country": "ID", "lat": -5.14,  "lon": 119.43, "temp": 30, "condition": "Cerah"},
        {"city": "Yogyakarta", "country": "ID", "lat": -7.80,  "lon": 110.37, "temp": 29, "condition": "Gerimis"},
        {"city": "Denpasar",   "country": "ID", "lat": -8.65,  "lon": 115.22, "temp": 30, "condition": "Cerah"},
        {"city": "Palembang",  "country": "ID", "lat": -2.99,  "lon": 104.76, "temp": 33, "condition": "Hujan Lebat"},
        {"city": "Manado",     "country": "ID", "lat": 1.49,   "lon": 124.84, "temp": 28, "condition": "Berawan"},
        {"city": "Balikpapan", "country": "ID", "lat": -1.27,  "lon": 116.83, "temp": 31, "condition": "Cerah Berawan"},
        {"city": "Jayapura",   "country": "ID", "lat": -2.53,  "lon": 140.72, "temp": 29, "condition": "Hujan Ringan"},
    ]

def _mock_analytics(city):
    days_id = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"]
    temps, rain, wind = [], [], []
    for i in range(7):
        day = datetime.utcnow() - timedelta(days=6-i)
        label = days_id[day.weekday()]
        base = 31
        temps.append({"date": label, "max": round(base+random.uniform(0,4),1), "min": round(base-random.uniform(3,6),1), "avg": round(base+random.uniform(-1,2),1)})
        rain.append({"date": label, "value": random.randint(20, 80)})
        wind.append({"date": label, "speed": round(random.uniform(5, 25), 1)})
    return {"temperature": temps, "rain_probability": rain, "wind_speed": wind}


@router.get("/current")
async def get_current(city: str = Query("Jakarta"), db: Session = Depends(get_db)):
    cutoff = datetime.utcnow() - timedelta(minutes=CACHE_TTL)
    cached = db.query(WeatherCache).filter(
        WeatherCache.city.ilike(city), WeatherCache.fetched_at > cutoff
    ).first()
    if cached:
        return {
            "source": "cache", "city": cached.city, "country": cached.country_code,
            "lat": cached.lat, "lon": cached.lon,
            "temperature": cached.temperature, "feels_like": cached.feels_like,
            "temp_min": cached.temp_min, "temp_max": cached.temp_max,
            "humidity": cached.humidity, "pressure": cached.pressure,
            "visibility": cached.visibility,
            "weather_main": cached.weather_main,
            "weather_description": cached.weather_description,
            "weather_icon": cached.weather_icon,
            "wind_speed": cached.wind_speed,
            "wind_direction": _wind_dir(cached.wind_deg or 0),
            "rain_1h": cached.rain_1h,
            "uv_index": 7, "uv_label": "Tinggi", "rain_chance": 45,
            "fetched_at": cached.fetched_at.isoformat(),
        }

    data = await _fetch_current(city)
    loc = data["location"]
    cur = data["current"]

    temp_min = cur["temp_c"] - 4
    temp_max = cur["temp_c"] + 3
    rain_chance = 45

    try:
        fc = await _fetch_forecast(city, days=1)
        today = fc["forecast"]["forecastday"][0]["day"]
        temp_min = today["mintemp_c"]
        temp_max = today["maxtemp_c"]
        rain_chance = today.get("daily_chance_of_rain", 45)
    except:
        pass

    e = WeatherCache(
        city=loc["name"], country_code="ID",
        lat=loc["lat"], lon=loc["lon"],
        temperature=cur["temp_c"], feels_like=cur["feelslike_c"],
        temp_min=temp_min, temp_max=temp_max,
        humidity=cur["humidity"], pressure=cur["pressure_mb"],
        visibility=cur["vis_km"],
        weather_main=cur["condition"]["text"],
        weather_description=cur["condition"]["text"],
        weather_icon=cur["condition"]["icon"],
        wind_speed=cur["wind_kph"],
        wind_deg=cur["wind_degree"],
        rain_1h=0.0,
        raw_json=json.dumps(data),
    )
    db.add(e); db.commit(); db.refresh(e)

    return {
        "source": "live",
        "city": e.city, "country": e.country_code,
        "lat": e.lat, "lon": e.lon,
        "temperature": e.temperature, "feels_like": e.feels_like,
        "temp_min": e.temp_min, "temp_max": e.temp_max,
        "humidity": e.humidity, "pressure": e.pressure,
        "visibility": e.visibility,
        "weather_main": e.weather_main,
        "weather_description": e.weather_description,
        "weather_icon": e.weather_icon,
        "wind_speed": e.wind_speed,
        "wind_direction": _wind_dir(e.wind_deg or 0),
        "rain_1h": e.rain_1h,
        "uv_index": cur.get("uv", 7),
        "uv_label": _uv_label(cur.get("uv", 7)),
        "rain_chance": rain_chance,
        "fetched_at": e.fetched_at.isoformat(),
    }


@router.get("/forecast")
async def get_forecast(city: str = Query("Jakarta")):
    data = await _fetch_forecast(city, days=7)
    days_id = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"]
    forecast = []
    for fd in data["forecast"]["forecastday"]:
        dt = datetime.strptime(fd["date"], "%Y-%m-%d")
        d = fd["day"]
        forecast.append({
            "date": fd["date"],
            "day_name": days_id[dt.weekday()],
            "temp_max": d["maxtemp_c"],
            "temp_min": d["mintemp_c"],
            "condition": d["condition"]["text"],
            "icon": d["condition"]["icon"],
            "rain_probability": d.get("daily_chance_of_rain", 0),
            "humidity": d["avghumidity"],
            "wind_speed": d["maxwind_kph"],
        })
    return {"city": city, "forecast": forecast}


@router.get("/hourly")
async def get_hourly(city: str = Query("Jakarta")):
    data = await _fetch_forecast(city, days=1)
    hourly = []
    for h in data["forecast"]["forecastday"][0]["hour"]:
        dt = datetime.fromtimestamp(h["time_epoch"])
        hourly.append({
            "time": dt.strftime("%H:%M"),
            "timestamp": dt.isoformat(),
            "temp": h["temp_c"],
            "feels_like": h["feelslike_c"],
            "condition": h["condition"]["text"],
            "icon": h["condition"]["icon"],
            "rain_probability": h.get("chance_of_rain", 0),
            "wind_speed": h["wind_kph"],
            "humidity": h["humidity"],
        })
    return {"city": city, "hourly": hourly}


@router.get("/alerts")
async def get_alerts(city: str = Query("Jakarta"), db: Session = Depends(get_db)):
    try:
        data = await _fetch_forecast(city, days=1)
        raw_alerts = data.get("alerts", {}).get("alert", [])
        alerts = [{"id": i+1, "event": a.get("event",""), "severity": a.get("severity","moderate").lower(),
                   "description": a.get("desc",""), "start": a.get("effective",""),
                   "end": a.get("expires",""), "sender": a.get("senderName","BMKG")}
                  for i, a in enumerate(raw_alerts)]
        if not alerts:
            alerts = [{"id": 1, "event": "Tidak Ada Peringatan Aktif", "severity": "minor",
                       "description": "Kondisi cuaca normal. Tidak ada peringatan aktif saat ini.",
                       "start": datetime.utcnow().isoformat(),
                       "end": (datetime.utcnow()+timedelta(hours=24)).isoformat(),
                       "sender": "BMKG"}]
        return {"city": city, "alerts": alerts}
    except:
        return {"city": city, "alerts": []}


@router.get("/analytics")
async def get_analytics(city: str = Query("Jakarta")):
    try:
        data = await _fetch_forecast(city, days=7)
        days_id = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"]
        temps, rain, wind = [], [], []
        for fd in data["forecast"]["forecastday"]:
            dt = datetime.strptime(fd["date"], "%Y-%m-%d")
            label = days_id[dt.weekday()]
            d = fd["day"]
            temps.append({"date": label, "max": d["maxtemp_c"], "min": d["mintemp_c"], "avg": d["avgtemp_c"]})
            rain.append({"date": label, "value": d.get("daily_chance_of_rain", 0)})
            wind.append({"date": label, "speed": d["maxwind_kph"]})
        return {"city": city, "temperature": temps, "rain_probability": rain, "wind_speed": wind}
    except:
        return {"city": city, **_mock_analytics(city)}


@router.get("/map-cities")
async def get_map_cities():
    cities_list = ["Jakarta","Surabaya","Bandung","Medan","Semarang","Makassar","Yogyakarta","Denpasar","Palembang","Manado","Balikpapan","Jayapura"]
    coords = {
        "Jakarta": (-6.21, 106.85), "Surabaya": (-7.25, 112.75),
        "Bandung": (-6.92, 107.61), "Medan": (3.59, 98.67),
        "Semarang": (-6.97, 110.42), "Makassar": (-5.14, 119.43),
        "Yogyakarta": (-7.80, 110.37), "Denpasar": (-8.65, 115.22),
        "Palembang": (-2.99, 104.76), "Manado": (1.49, 124.84),
        "Balikpapan": (-1.27, 116.83), "Jayapura": (-2.53, 140.72),
    }

    async def fetch_city(client, city):
        lat, lon = coords.get(city, (0, 0))
        try:
            r = await client.get(f"{WEATHER_API_BASE}/current.json", params={
                "key": WEATHER_API_KEY, "q": city, "lang": "id", "aqi": "no"
            })
            if r.status_code == 200:
                d = r.json()
                return {
                    "city": city, "country": "ID", "lat": lat, "lon": lon,
                    "temp": d["current"]["temp_c"],
                    "condition": d["current"]["condition"]["text"],
                    "icon": d["current"]["condition"]["icon"],
                }
        except:
            pass
        return {"city": city, "country": "ID", "lat": lat, "lon": lon, "temp": 30, "condition": "Cerah", "icon": ""}

    async with httpx.AsyncClient(timeout=15) as c:
        results = await asyncio.gather(*[fetch_city(c, city) for city in cities_list])

    return {"cities": [r for r in results if r]}


@router.post("/locations", status_code=201)
def save_location(payload: LocationCreate, db: Session = Depends(get_db)):
    loc = SavedLocation(**payload.model_dump())
    db.add(loc); db.commit(); db.refresh(loc)
    return loc

@router.get("/locations")
def list_locations(db: Session = Depends(get_db)):
    return db.query(SavedLocation).all()

@router.delete("/locations/{loc_id}", status_code=204)
def delete_location(loc_id: int, db: Session = Depends(get_db)):
    loc = db.query(SavedLocation).filter(SavedLocation.id == loc_id).first()
    if not loc: raise HTTPException(status_code=404, detail="Tidak ditemukan")
    db.delete(loc); db.commit()