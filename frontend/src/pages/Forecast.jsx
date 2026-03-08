/**
 * pages/Forecast.jsx
 * Full forecast view: hourly scroll + 7-day cards.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import { useFetch } from '../hooks/useFetch'
import { getForecast, getHourlyForecast } from '../services/api'
import { DailyForecastCard, HourlyForecastCard } from '../components/ForecastCard'
import { Droplets, Wind, Thermometer } from 'lucide-react'

const PAGE_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const SECTION = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Forecast() {
  const { city, formatTemp } = useWeather()
  const [activeDay, setActiveDay] = useState(0)

  const { data: forecastData, loading: fLoading } =
    useFetch(() => getForecast(city), [city])

  const { data: hourlyData, loading: hLoading } =
    useFetch(() => getHourlyForecast(city), [city])

  const selectedDay = forecastData?.forecast?.[activeDay]

  return (
    <motion.div
      variants={PAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-8 space-y-8"
    >
      {/* Header */}
      <motion.div variants={SECTION}>
        <h1 className="text-2xl font-extrabold font-display text-slate-800 dark:text-slate-100">
          Weather Forecast
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Hourly and 7-day forecast for {city}
        </p>
      </motion.div>

      {/* 7-day overview cards */}
      <motion.section variants={SECTION}>
        <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">
          7-Day Forecast
        </h2>
       <div className="flex gap-4 overflow-x-auto py-3 px-2 scrollbar-thin">
          {fLoading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-28 h-44 glass-card animate-pulse" />
              ))
            : forecastData?.forecast?.map((day, i) => (
                <div
                  key={day.date}
                  onClick={() => setActiveDay(i)}
                  className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                    activeDay === i ? 'ring-2 ring-primary ring-offset-2 rounded-3xl scale-105' : ''
                  }`}
                >
                  <DailyForecastCard data={day} index={i} />
                </div>
              ))
          }
        </div>
      </motion.section>

      {/* Selected day detail panel */}
      {selectedDay && (
        <motion.section
          key={activeDay}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          variants={SECTION}
          className="glass-card p-6"
        >
          <h2 className="font-bold font-display text-slate-800 dark:text-slate-100 mb-4">
            {activeDay === 0 ? 'Today' : selectedDay.day_name} Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Thermometer size={18} className="text-orange-500" />, label: 'High', value: formatTemp(selectedDay.temp_max) },
              { icon: <Thermometer size={18} className="text-blue-400" />, label: 'Low', value: formatTemp(selectedDay.temp_min) },
              { icon: <Droplets size={18} className="text-blue-500" />, label: 'Humidity', value: `${selectedDay.humidity}%` },
              { icon: <Wind size={18} className="text-slate-500" />, label: 'Wind', value: `${selectedDay.wind_speed} km/h` },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3">
                {item.icon}
                <div>
                  <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Hourly forecast */}
      <motion.section variants={SECTION}>
        <h2 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-4">
          24-Hour Forecast
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {hLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="glass-card h-16 animate-pulse" />
              ))
            : hourlyData?.hourly?.map((hour, i) => (
                <HourlyForecastCard key={hour.time} data={hour} index={i} />
              ))
          }
        </div>
      </motion.section>
    </motion.div>
  )
}
