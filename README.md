# 🌤️ Weather Insight Dashboard

A full-stack weather monitoring dashboard with real-time data, interactive maps, analytics charts, and weather alerts.

![Stack](https://img.shields.io/badge/Frontend-React%20+%20Vite%20+%20Tailwind-blue)
![Stack](https://img.shields.io/badge/Backend-FastAPI%20+%20SQLite-green)

---

## 📁 Project Structure

```
weather-app/
├── backend/
│   ├── main.py              # FastAPI app + CORS + lifespan
│   ├── database.py          # SQLAlchemy engine & session
│   ├── models.py            # ORM models (WeatherCache, Alert, Location)
│   ├── routes/
│   │   └── weather.py       # All /api/weather/* endpoints
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx       # Icon sidebar navigation
    │   │   ├── Navbar.jsx        # Top bar with search
    │   │   ├── WeatherCard.jsx   # Hero temperature card
    │   │   ├── ForecastCard.jsx  # Daily & hourly forecast cards
    │   │   ├── WeatherChart.jsx  # Recharts: temp, rain, wind
    │   │   ├── StatCard.jsx      # Metric glass card
    │   │   ├── AlertCard.jsx     # Weather alert card
    │   │   └── LoadingSpinner.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx     # Main dashboard
    │   │   ├── Forecast.jsx      # 7-day + hourly forecast
    │   │   ├── Map.jsx           # React-Leaflet weather map
    │   │   ├── Analytics.jsx     # Charts & statistics
    │   │   ├── Alerts.jsx        # Weather warnings
    │   │   └── Settings.jsx      # User settings
    │   ├── services/
    │   │   └── api.js            # Axios API layer
    │   ├── context/
    │   │   └── WeatherContext.jsx # Global city/theme state
    │   ├── hooks/
    │   │   └── useFetch.js       # Data fetching hook
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

---

### Backend Setup

```bash
cd backend

# 1. Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env and add your OpenWeatherMap API key (optional — mock data works without it)

# 4. Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

---

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Configure environment (optional)
cp .env.example .env

# 3. Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

The Vite dev server automatically proxies `/api` requests to `http://localhost:8000`.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather/current?city=London` | Current weather |
| GET | `/api/weather/forecast?city=London` | 7-day forecast |
| GET | `/api/weather/hourly?city=London` | 24-hour hourly |
| GET | `/api/weather/alerts?city=London` | Active alerts |
| GET | `/api/weather/analytics?city=London` | Analytics data |
| GET | `/api/weather/map-cities` | Multi-city map data |
| POST | `/api/weather/locations` | Save a city |
| GET | `/api/weather/locations` | List saved cities |
| DELETE | `/api/weather/locations/{id}` | Remove saved city |

---

## 🗄️ Database Schema

### `weather_cache`
Caches current weather API responses to reduce API calls.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | Auto-increment |
| city | VARCHAR | City name |
| temperature | FLOAT | °C |
| humidity | INTEGER | % |
| pressure | INTEGER | hPa |
| wind_speed | FLOAT | m/s |
| fetched_at | DATETIME | Cache timestamp |

### `weather_alert`
Stores active severe weather warnings.

### `saved_location`
User-bookmarked cities with coordinates.

---

## 🔑 Adding an OpenWeatherMap API Key

1. Register at [openweathermap.org](https://openweathermap.org/api)
2. Copy your API key
3. Add to `backend/.env`:
   ```
   OPENWEATHERMAP_API_KEY=your_key_here
   ```
4. Restart the backend server

**Without a key**, the app uses realistic mock data for all endpoints.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Charts | Recharts |
| Maps | React-Leaflet |
| HTTP client | Axios |
| Backend | FastAPI |
| Database | SQLite + SQLAlchemy |
| Weather data | OpenWeatherMap API |

---

## 📦 Production Build

```bash
# Frontend
cd frontend && npm run build   # outputs to frontend/dist/

# Backend (example with gunicorn)
cd backend && gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 🎨 Features

- **Dark/Light mode** — toggle in sidebar
- **City search** — type any city in the top search bar
- **Temperature units** — switch °C/°F
- **Weather map** — Leaflet map with city markers
- **Analytics** — 7-day trend charts for temp, rain, wind
- **Alert system** — severity-filtered weather warnings with dismiss
- **Saved locations** — bookmark cities in Settings
- **Response caching** — SQLite cache reduces API calls
- **Glassmorphism UI** — frosted-glass card design system
