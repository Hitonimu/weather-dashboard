/**
 * pages/Dashboard.jsx
 * Main dashboard: current weather hero, stat cards, and temperature chart.
 */

import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import { useFetch } from '../hooks/useFetch'
import { getCurrentWeather, getAnalytics } from '../services/api'
import WeatherCard from '../components/WeatherCard'
import StatCard from '../components/StatCard'
import { TemperatureChart } from '../components/WeatherChart'
import { DailyForecastCard } from '../components/ForecastCard'
import { useFetch as useF } from '../hooks/useFetch'
import { getForecast } from '../services/api'

const PAGE_VARIANTS = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } },
}

export default function Dashboard() {
  const { city, formatTemp } = useWeather()

  const { data: weather, loading: wLoading, error: wError, refetch: wRefetch } =
    useFetch(() => getCurrentWeather(city), [city])

  const { data: analytics, loading: aLoading } =
    useF(() => getAnalytics(city), [city])

  const { data: forecastData, loading: fLoading } =
    useF(() => getForecast(city), [city])

  // Stat definitions derived from weather data
  const stats = weather
    ? [
        { icon: '💧', label: 'Humidity',    value: weather.humidity,     unit: '%',    subtitle: 'Normal Range',     color: 'blue'    },
        { icon: '💨', label: 'Wind',        value: weather.wind_speed,   unit: 'km/h', subtitle: weather.wind_direction, color: 'cyan' },
        { icon: '🔵', label: 'Pressure',    value: weather.pressure,     unit: 'hPa',  subtitle: 'Stable',           color: 'indigo'  },
        { icon: '👁️',  label: 'Visibility', value: weather.visibility,  unit: 'km',   subtitle: 'Clear View',       color: 'emerald' },
        { icon: '☀️',  label: 'UV Index',   value: weather.uv_index,     unit: '',     subtitle: weather.uv_label,   color: 'orange'  },
        { icon: '☂️',  label: 'Rain Chance',value: weather.rain_chance,  unit: '%',    subtitle: 'Low Chance',       color: 'blue'    },
      ]
    : []

  return (
    <motion.div
      variants={PAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-8 space-y-6 min-h-full"
    >
      {/* Page title */}
      <motion.div variants={PAGE_VARIANTS}>
        <h1 className="text-2xl font-extrabold font-display text-slate-800 dark:text-slate-100">
          Weather Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time conditions for {city}
        </p>
      </motion.div>

      {/* Hero grid: weather card + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather hero card */}
        <motion.div variants={PAGE_VARIANTS} className="lg:col-span-1">
          <WeatherCard
            weather={weather?.city ? weather : null}
            loading={wLoading}
            error={wError}
            onRefresh={wRefetch}
          />
        </motion.div>

        {/* Stat cards */}
        <motion.div variants={PAGE_VARIANTS} className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-full">
            {wLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card p-5 animate-pulse h-24" />
                ))
              : stats.map((s, i) => (
                  <StatCard key={s.label} {...s} index={i} />
                ))}
          </div>
        </motion.div>
      </div>

      {/* Temperature chart + mini forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Temperature trend */}
        <motion.div variants={PAGE_VARIANTS} className="lg:col-span-3 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display text-slate-800 dark:text-slate-100">
              Temperature Trend
            </h3>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              Last 7 days
            </span>
          </div>
          {aLoading
            ? <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            : <TemperatureChart data={analytics?.temperature} />
          }
        </motion.div>

        {/* 7-day mini forecast */}
        <motion.div variants={PAGE_VARIANTS} className="lg:col-span-2 glass-card p-6">
          <h3 className="font-bold font-display text-slate-800 dark:text-slate-100 mb-4">
            7-Day Outlook
          </h3>
          <div className="space-y-2">
            {fLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
                ))
              : forecastData?.forecast?.slice(0, 7).map((day, i) => (
                  <div
                    key={day.date}
                    className="flex items-center gap-3 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <span className="text-xs font-semibold text-slate-500 w-8 shrink-0">
                      {i === 0 ? 'Today' : day.day_name.slice(0, 3)}
                    </span>
                    <span className="text-lg flex-shrink-0">
                      {day.condition.includes('Rain') ? '🌧️'
                        : day.condition.includes('Cloud') ? '⛅'
                        : day.condition.includes('Thunder') ? '⛈️'
                        : '☀️'}
                    </span>
                    <span className="flex-1 text-xs text-slate-400 truncate">{day.condition}</span>
                    <div className="flex gap-1.5 text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-200">{formatTemp(day.temp_max)}</span>
                      <span className="text-slate-400">{formatTemp(day.temp_min)}</span>
                    </div>
                  </div>
                ))
            }
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
