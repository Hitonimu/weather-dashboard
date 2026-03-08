import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Thermometer, Sun, Moon } from 'lucide-react'
import { useWeather } from '../context/WeatherContext'
import { format } from 'date-fns'

export default function Navbar() {
  const { city, selectCity, unit, toggleUnit, isDark, toggleTheme } = useWeather()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      selectCity(query.trim())
      setQuery('')
    }
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="h-[68px] flex-shrink-0 flex items-center justify-between px-4 lg:px-8 pl-16 lg:pl-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/30 dark:border-slate-800/50 sticky top-0 z-30"
    >
      <form onSubmit={handleSearch} className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Cari kota: ${city}`}
            className="input-field pl-10 pr-4 h-10 text-sm w-full"
          />
        </div>
      </form>

      <div className="flex items-center gap-2 lg:gap-3">
        <span className="hidden md:block text-xs text-slate-400 font-medium">
          {format(new Date(), 'EEE, d MMM yyyy')}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleUnit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-all"
        >
          <Thermometer size={14} />
          {unit === 'metric' ? '°C' : '°F'}
        </motion.button>

        {/* Dark mode di navbar */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">Cenayang Cuaca</p>
            <p className="text-xs text-slate-400">{city}, Dashboard</p>
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-primary/30 bg-weather-gradient flex items-center justify-center text-white font-bold text-xs">
            CC
          </div>
        </div>
      </div>
    </motion.header>
  )
}