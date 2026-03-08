/**
 * components/AlertCard.jsx
 * Displays a single weather alert/warning card.
 */

import { motion } from 'framer-motion'
import { AlertTriangle, Clock, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'

const SEVERITY_STYLES = {
  extreme:  { bg: 'bg-red-50 dark:bg-red-900/20',    border: 'border-red-200 dark:border-red-800',    text: 'text-red-600 dark:text-red-400',    badge: 'bg-red-500',    icon: '🚨' },
  severe:   { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-500', icon: '⛈️' },
  moderate: { bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-200 dark:border-amber-800',  text: 'text-amber-600 dark:text-amber-400',   badge: 'bg-amber-500',  icon: '⚠️' },
  minor:    { bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-200 dark:border-blue-800',    text: 'text-blue-600 dark:text-blue-400',    badge: 'bg-blue-500',   icon: 'ℹ️' },
}

const DEFAULT_STYLE = SEVERITY_STYLES.moderate

export default function AlertCard({ alert, index = 0, onDismiss }) {
  const s = SEVERITY_STYLES[alert.severity?.toLowerCase()] || DEFAULT_STYLE

  const formatTime = (iso) => {
    try { return format(parseISO(iso), 'MMM d, HH:mm') }
    catch { return iso }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`
        relative rounded-3xl p-5 border
        ${s.bg} ${s.border}
        transition-all duration-200
      `}
    >
      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-black/10 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={14} />
        </button>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl flex-shrink-0">{s.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-sm ${s.text}`}>{alert.event}</h3>
            <span className={`${s.badge} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase`}>
              {alert.severity}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{alert.sender}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
        {alert.description}
      </p>

      {/* Time range */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
        <Clock size={11} />
        <span>{formatTime(alert.start)} → {formatTime(alert.end)}</span>
      </div>
    </motion.div>
  )
}
