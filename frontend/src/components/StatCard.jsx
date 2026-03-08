/**
 * components/StatCard.jsx
 * Small glass card for a single weather metric (humidity, wind, etc.)
 */

import { motion } from 'framer-motion'

const COLOR_MAP = {
  blue: 'text-blue-500',
  indigo: 'text-indigo-500',
  emerald: 'text-emerald-500',
  orange: 'text-orange-500',
  violet: 'text-violet-500',
  cyan: 'text-cyan-500',
}

export default function StatCard({ icon, label, value, unit, subtitle, color = 'blue', index = 0 }) {
  const colorClass = COLOR_MAP[color] || 'text-blue-500'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="weather-stat-card"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <span className={`text-xl ${colorClass}`}>{icon}</span>
      </div>
      <div>
        <div className="text-2xl font-extrabold font-display text-slate-800 dark:text-slate-100 leading-none">
          {value}
          {unit && <span className="text-sm font-semibold text-slate-400 ml-1">{unit}</span>}
        </div>
        {subtitle && (
          <p className="text-[10px] text-slate-400 mt-1 leading-tight">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}
