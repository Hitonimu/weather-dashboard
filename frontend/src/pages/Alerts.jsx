/**
 * pages/Alerts.jsx
 * Active weather alerts and warnings dashboard.
 */

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import { useFetch } from '../hooks/useFetch'
import { getAlerts } from '../services/api'
import AlertCard from '../components/AlertCard'
import { ShieldCheck, BellRing } from 'lucide-react'

const SEVERITY_ORDER = { extreme: 0, severe: 1, moderate: 2, minor: 3 }

export default function Alerts() {
  const { city } = useWeather()
  const [dismissed, setDismissed] = useState([])
  const [filter, setFilter] = useState('all')

  const { data, loading } = useFetch(() => getAlerts(city), [city])

  const allAlerts = data?.alerts || []
  const active = allAlerts.filter((a) => !dismissed.includes(a.id))

  const filtered = filter === 'all'
    ? active
    : active.filter((a) => a.severity?.toLowerCase() === filter)

  const sorted = [...filtered].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99)
  )

  const counts = allAlerts.reduce((acc, a) => {
    const s = a.severity?.toLowerCase()
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 lg:p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-800 dark:text-slate-100">
            Weather Alerts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Active warnings for {city}
          </p>
        </div>
        {/* Status badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold ${
          active.length > 0
            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
        }`}>
          {active.length > 0
            ? <><BellRing size={16} /> {active.length} Active Alert{active.length !== 1 ? 's' : ''}</>
            : <><ShieldCheck size={16} /> All Clear</>
          }
        </div>
      </div>

      {/* Severity filter pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'all',      label: 'All',      count: active.length },
          { id: 'extreme',  label: '🚨 Extreme',  count: counts.extreme || 0 },
          { id: 'severe',   label: '⛈️ Severe',   count: counts.severe  || 0 },
          { id: 'moderate', label: '⚠️ Moderate', count: counts.moderate|| 0 },
          { id: 'minor',    label: 'ℹ️ Minor',    count: counts.minor   || 0 },
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all
              ${filter === id
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-primary border border-slate-200 dark:border-slate-700'
              }
            `}
          >
            {label}
            <span className={`
              px-1.5 py-0.5 rounded-full text-[10px] font-bold
              ${filter === id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}
            `}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-4 max-w-3xl">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-32 animate-pulse" />
          ))
        ) : sorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 flex flex-col items-center gap-4"
          >
            <span className="text-5xl">✅</span>
            <div className="text-center">
              <p className="font-bold text-slate-700 dark:text-slate-200">No Active Alerts</p>
              <p className="text-sm text-slate-400 mt-1">
                {filter !== 'all' ? `No ${filter} alerts for ${city}` : `Weather conditions are normal for ${city}`}
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {sorted.map((alert, i) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                index={i}
                onDismiss={(id) => setDismissed((prev) => [...prev, id])}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Dismissed count */}
      {dismissed.length > 0 && (
        <p className="text-xs text-slate-400">
          {dismissed.length} alert{dismissed.length !== 1 ? 's' : ''} dismissed.{' '}
          <button
            onClick={() => setDismissed([])}
            className="text-primary hover:underline font-medium"
          >
            Restore all
          </button>
        </p>
      )}
    </motion.div>
  )
}
