/**
 * components/WeatherCard.jsx
 * Hero weather card showing temperature, condition, and hi/lo.
 */

import { motion } from 'framer-motion'
import { MapPin, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { useWeather } from '../context/WeatherContext'

// Map OWM icon codes to emoji + gradient
const CONDITION_MAP = {
  '01d': { emoji: '☀️', gradient: 'from-amber-400 via-orange-400 to-yellow-300', bg: 'sunny-gradient' },
  '01n': { emoji: '🌙', gradient: 'from-indigo-600 via-blue-800 to-slate-900', bg: 'storm-gradient' },
  '02d': { emoji: '⛅', gradient: 'from-sky-400 via-blue-500 to-blue-600', bg: 'weather-gradient' },
  '02n': { emoji: '🌙', gradient: 'from-slate-600 via-blue-800 to-slate-900', bg: 'storm-gradient' },
  '03d': { emoji: '🌥️', gradient: 'from-slate-400 via-slate-500 to-blue-500', bg: 'weather-gradient' },
  '04d': { emoji: '☁️', gradient: 'from-slate-400 via-slate-500 to-slate-600', bg: 'storm-gradient' },
  '09d': { emoji: '🌧️', gradient: 'from-blue-500 via-blue-600 to-indigo-700', bg: 'rain-gradient' },
  '10d': { emoji: '🌦️', gradient: 'from-blue-400 via-blue-500 to-indigo-600', bg: 'rain-gradient' },
  '11d': { emoji: '⛈️', gradient: 'from-slate-600 via-slate-700 to-slate-900', bg: 'storm-gradient' },
  '13d': { emoji: '❄️', gradient: 'from-sky-200 via-blue-300 to-indigo-400', bg: 'weather-gradient' },
  '50d': { emoji: '🌫️', gradient: 'from-slate-300 via-slate-400 to-slate-500', bg: 'storm-gradient' },
}

const DEFAULT_CONDITION = {
  emoji: '🌤️',
  gradient: 'from-sky-400 via-blue-500 to-blue-600',
}

export default function WeatherCard({ weather, loading, error, onRefresh }) {
  const { formatTemp } = useWeather()

  if (loading) {
    return (
      <div className="rounded-3xl h-64 bg-gradient-to-br from-sky-400 to-blue-600 animate-pulse shadow-2xl shadow-blue-500/20" />
    )
  }

  if (error) {
    return (
      <div className="glass-card p-8 flex flex-col items-center justify-center h-64 gap-3">
        <span className="text-4xl">⚠️</span>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium text-center">{error}</p>
        <button onClick={onRefresh} className="btn-primary text-sm">Try Again</button>
      </div>
    )
  }

  if (!weather) return null

  const icon = weather.weather_icon || '02d'
  const condition = CONDITION_MAP[icon] || DEFAULT_CONDITION

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`
        relative overflow-hidden rounded-3xl p-8 text-white flex flex-col justify-between
        bg-gradient-to-br ${condition.gradient}
        shadow-2xl shadow-blue-500/25 cursor-default
        min-h-[260px]
      `}
    >
      {/* Background decorative emoji */}
      <span className="absolute -right-6 -top-6 text-[180px] opacity-15 select-none pointer-events-none weather-icon-float">
        {condition.emoji}
      </span>

      {/* Top row */}
      <div className="z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="opacity-80" />
            <h2 className="text-2xl font-bold font-display">{weather.city}</h2>
            <span className="text-sm opacity-70">{weather.country}</span>
          </div>
          <p className="text-sm opacity-70">{format(new Date(), 'EEEE, d MMMM yyyy')}</p>
        </div>
        <motion.button
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.4 }}
          onClick={onRefresh}
          className="p-2 rounded-xl hover:bg-white/20 transition-colors opacity-70 hover:opacity-100"
        >
          <RefreshCw size={16} />
        </motion.button>
      </div>

      {/* Temperature */}
      <div className="z-10 py-2">
        <div className="text-7xl font-extrabold font-display tracking-tighter leading-none">
          {formatTemp(weather.temperature)}
        </div>
        <p className="text-lg font-medium mt-2 opacity-90 capitalize">
          {weather.weather_description}
        </p>
        <p className="text-sm opacity-70 mt-0.5">
          Feels like {formatTemp(weather.feels_like)}
        </p>
      </div>

      {/* Hi / Lo */}
      <div className="z-10 flex items-center gap-4 opacity-90 text-sm font-semibold">
        <div className="flex items-center gap-1">
          <ArrowUp size={14} />
          <span>{formatTemp(weather.temp_max)}</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowDown size={14} />
          <span>{formatTemp(weather.temp_min)}</span>
        </div>
        {weather.source === 'cache' && (
          <span className="text-xs opacity-60 font-normal ml-auto">cached</span>
        )}
      </div>
    </motion.div>
  )
}
