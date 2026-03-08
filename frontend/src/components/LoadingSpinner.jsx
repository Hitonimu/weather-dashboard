/**
 * components/LoadingSpinner.jsx
 * Simple animated loading state for sections.
 */

import { motion } from 'framer-motion'
import { Cloud } from 'lucide-react'

export default function LoadingSpinner({ message = 'Loading weather data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-3 border-primary/20 border-t-primary"
        style={{ borderWidth: 3 }}
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
      >
        <Cloud size={16} />
        <span>{message}</span>
      </motion.div>
    </div>
  )
}

/** Skeleton card placeholder */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card p-5 animate-pulse ${className}`}>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3 mb-3" />
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2 mb-2" />
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-1/3" />
    </div>
  )
}
