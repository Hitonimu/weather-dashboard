/**
 * context/WeatherContext.jsx
 * Global state: selected city, theme toggle, loading, error.
 */

import { createContext, useContext, useState, useCallback } from 'react'

const WeatherContext = createContext(null)

export function WeatherProvider({ children }) {
  const [city, setCity] = useState('Jakarta')
  const [isDark, setIsDark] = useState(false)
  const [unit, setUnit] = useState('metric') // metric | imperial

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }, [])

  const selectCity = useCallback((newCity) => {
    setCity(newCity.trim())
  }, [])

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'))
  }, [])

  const formatTemp = useCallback(
    (celsius) => {
      if (unit === 'imperial') return `${Math.round(celsius * 9 / 5 + 32)}°F`
      return `${Math.round(celsius)}°C`
    },
    [unit]
  )

  return (
    <WeatherContext.Provider
      value={{ city, selectCity, isDark, toggleTheme, unit, toggleUnit, formatTemp }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeather = () => {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider')
  return ctx
}
