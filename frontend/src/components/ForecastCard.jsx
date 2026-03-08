/**
 * components/ForecastCard.jsx
 * Renders a single day or hour forecast row/card.
 * Variant: 'daily' | 'hourly'
 */

import { motion } from 'framer-motion'
import { Droplets, Wind } from 'lucide-react'
import { useWeather } from '../context/WeatherContext'

const CONDITION_EMOJI = {
  'Sunny': '☀️', 'Clear': '☀️',
  'Partly Cloudy': '⛅', 'Overcast': '☁️', 'Cloudy': '🌥️',
  'Rain': '🌧️', 'Drizzle': '🌦️', 'Light Rain': '🌦️',
  'Heavy Rain': '🌧️', 'Thunderstorm': '⛈️',
  'Snow': '❄️', 'Fog': '🌫️', 'Mist': '🌫️',
}

const getEmoji = (condition) => {
  for (const [key, emoji] of Object.entries(CONDITION_EMOJI)) {
    if (condition?.toLowerCase().includes(key.toLowerCase())) return emoji
  }
  return '🌤️'
}

/** Daily forecast card */
export function DailyForecastCard({ data, index }) {
  const { formatTemp } = useWeather()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="glass-card p-4 flex flex-col items-center gap-2 min-w-[110px] cursor-default"
    >
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {index === 0 ? 'Today' : data.day_name?.slice(0, 3)}
      </span>
      <span className="text-3xl">{getEmoji(data.condition)}</span>
      <p className="text-[10px] text-slate-400 text-center leading-tight">
        {data.condition}
      </p>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-slate-800 dark:text-slate-100">{formatTemp(data.temp_max)}</span>
        <span className="text-slate-400">{formatTemp(data.temp_min)}</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-blue-500">
        <Droplets size={10} />
        <span>{data.rain_probability}%</span>
      </div>
    </motion.div>
  )
}

/** Hourly forecast row */
export function HourlyForecastCard({ data, index }) {
  const { formatTemp } = useWeather()

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="glass-card px-4 py-3 flex items-center gap-4 min-w-[200px]"
    >
      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 w-12 shrink-0">
        {data.time}
      </span>
      <span className="text-2xl">{getEmoji(data.condition)}</span>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {formatTemp(data.temp)}
        </p>
        <p className="text-[10px] text-slate-400">{data.condition}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-[10px] text-blue-500">
          <Droplets size={9} />
          <span>{data.rain_probability}%</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <Wind size={9} />
          <span>{data.wind_speed} km/h</span>
        </div>
      </div>
    </motion.div>
  )
}
