/**
 * pages/Analytics.jsx
 * Climate statistics and analytics: temperature, rain probability, wind speed charts.
 */

import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import { useFetch } from '../hooks/useFetch'
import { getAnalytics } from '../services/api'
import { TemperatureChart, RainChart, WindChart } from '../components/WeatherChart'
import { TrendingUp, CloudRain, Wind } from 'lucide-react'

const PAGE_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const CARD = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function ChartSection({ title, subtitle, icon: Icon, color, children }) {
  return (
    <motion.div variants={CARD} className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold font-display text-slate-800 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  )
}

export default function Analytics() {
  const { city } = useWeather()

  const { data, loading, error } = useFetch(() => getAnalytics(city), [city])

  // Summary stats derived from analytics data
  const tempData = data?.temperature || []
  const avgTemp = tempData.length
    ? (tempData.reduce((s, d) => s + d.avg, 0) / tempData.length).toFixed(1)
    : '--'
  const maxTemp = tempData.length ? Math.max(...tempData.map((d) => d.max)).toFixed(1) : '--'

  const rainData = data?.rain_probability || []
  const avgRain = rainData.length
    ? Math.round(rainData.reduce((s, d) => s + d.value, 0) / rainData.length)
    : '--'

  const windData = data?.wind_speed || []
  const avgWind = windData.length
    ? (windData.reduce((s, d) => s + d.speed, 0) / windData.length).toFixed(1)
    : '--'

  const summaryCards = [
    { label: 'Avg Temp',    value: `${avgTemp}°C`, icon: '🌡️', color: 'text-orange-500' },
    { label: 'Peak Temp',   value: `${maxTemp}°C`, icon: '☀️', color: 'text-yellow-500' },
    { label: 'Avg Rain',    value: `${avgRain}%`,  icon: '🌧️', color: 'text-blue-500' },
    { label: 'Avg Wind',    value: `${avgWind} km/h`, icon: '💨', color: 'text-slate-500' },
  ]

  return (
    <motion.div
      variants={PAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-8 space-y-6"
    >
      {/* Header */}
      <motion.div variants={CARD}>
        <h1 className="text-2xl font-extrabold font-display text-slate-800 dark:text-slate-100">
          Climate Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          7-day weather data analysis for {city}
        </p>
      </motion.div>

      {/* Summary stats */}
      <motion.div variants={CARD} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((s) => (
          <div key={s.label} className="glass-card p-5 flex items-center gap-4">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{s.label}</p>
              <p className={`text-xl font-extrabold font-display ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection
          title="Temperature Trend"
          subtitle="Daily high, low & average over 7 days"
          icon={TrendingUp}
          color="bg-blue-500"
        >
          {loading
            ? <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            : <TemperatureChart data={data?.temperature} />
          }
        </ChartSection>

        <ChartSection
          title="Rain Probability"
          subtitle="Daily precipitation chance"
          icon={CloudRain}
          color="bg-sky-500"
        >
          {loading
            ? <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            : <RainChart data={data?.rain_probability} />
          }
        </ChartSection>
      </div>

      <ChartSection
        title="Wind Speed"
        subtitle="Daily average wind speed in km/h"
        icon={Wind}
        color="bg-violet-500"
      >
        {loading
          ? <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          : <WindChart data={data?.wind_speed} />
        }
      </ChartSection>

      {error && (
        <div className="glass-card p-6 text-center text-red-500">
          <p>⚠️ {error}</p>
        </div>
      )}
    </motion.div>
  )
}
