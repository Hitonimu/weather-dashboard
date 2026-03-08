/**
 * components/Sidebar.jsx - Fixed hover, active states, Indonesian labels + tooltips
 */
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import {
  LayoutDashboard, Map, CalendarDays, BarChart3,
  BellRing, Sun, Moon, Settings, CloudSun,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/map',       icon: Map,             label: 'Peta Cuaca' },
  { to: '/forecast',  icon: CalendarDays,    label: 'Prakiraan'  },
  { to: '/analytics', icon: BarChart3,       label: 'Analitik'   },
  { to: '/alerts',    icon: BellRing,        label: 'Peringatan' },
]

export default function Sidebar() {
  const { isDark, toggleTheme } = useWeather()

  return (
    <motion.aside
      initial={{ x: -72, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-[72px] flex-shrink-0 flex flex-col items-center py-5 gap-2 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-screen sticky top-0 z-40 shadow-sm"
    >
      {/* Logo */}
      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 flex-shrink-0">
        <CloudSun size={20} className="text-white" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            className={({ isActive }) =>
              `relative group w-full flex items-center justify-center h-10 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-lg">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-slate-100 dark:bg-slate-800 my-1" />

      {/* Bottom controls */}
      <div className="flex flex-col items-center gap-1 w-full px-2 pb-2">
        <button
          onClick={toggleTheme}
          className="group relative w-full flex items-center justify-center h-10 rounded-xl transition-all duration-200 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-lg">
            {isDark ? 'Mode Terang' : 'Mode Gelap'}
          </span>
        </button>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group relative w-full flex items-center justify-center h-10 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
            }`
          }
        >
          <Settings size={18} />
          <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-lg">
            Pengaturan
          </span>
        </NavLink>
      </div>
    </motion.aside>
  )
}
