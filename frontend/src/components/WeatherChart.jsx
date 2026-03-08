/**
 * components/WeatherChart.jsx
 * Recharts wrappers for temperature trend, rain probability, and wind speed charts.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'

// ── Custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}{unit || ''}
        </p>
      ))}
    </div>
  )
}

// ── Temperature Trend ────────────────────────────────────────────────────────
export function TemperatureChart({ data }) {
  const [view, setView] = useState('max')

  if (!data?.length) return <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex gap-2">
        {['max', 'min', 'avg'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`
              px-3 py-1 rounded-xl text-xs font-semibold transition-all
              ${view === v
                ? 'bg-primary text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary'}
            `}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="°" />
          <Tooltip content={<CustomTooltip unit="°C" />} />
          <Area
            type="monotone"
            dataKey={view}
            name="Temperature"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#tempGrad)"
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#2563eb' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Rain Probability ─────────────────────────────────────────────────────────
export function RainChart({ data }) {
  if (!data?.length) return <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip content={<CustomTooltip unit="%" />} />
        <ReferenceLine y={50} stroke="rgba(59,130,246,0.3)" strokeDasharray="4 4" />
        <Bar
          dataKey="value"
          name="Rain Prob."
          fill="url(#rainGrad)"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Wind Speed ───────────────────────────────────────────────────────────────
export function WindChart({ data }) {
  if (!data?.length) return <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="windGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit=" km/h" />
        <Tooltip content={<CustomTooltip unit=" km/h" />} />
        <Line
          type="monotone"
          dataKey="speed"
          name="Wind"
          stroke="url(#windGrad)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#7c3aed', strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
