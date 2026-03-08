/**
 * services/api.js
 * Axios instance and typed API methods for the Weather Insight backend.
 * All methods return plain data (throws on error).
 */

import axios from 'axios'

// ── Axios base instance ──────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Response interceptor: unwrap data ────────────────────────────────────────
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.detail || err.message || 'Network error'
    return Promise.reject(new Error(message))
  }
)

// ── Weather API methods ──────────────────────────────────────────────────────

/**
 * Fetch current weather for a city.
 * @param {string} city
 * @returns {Promise<object>}
 */
export const getCurrentWeather = (city = 'London') =>
  api.get('/weather/current', { params: { city } })

/**
 * Fetch 7-day daily forecast.
 * @param {string} city
 */
export const getForecast = (city = 'London') =>
  api.get('/weather/forecast', { params: { city } })

/**
 * Fetch 24-hour hourly forecast.
 * @param {string} city
 */
export const getHourlyForecast = (city = 'London') =>
  api.get('/weather/hourly', { params: { city } })

/**
 * Fetch active weather alerts.
 * @param {string} city
 */
export const getAlerts = (city = 'London') =>
  api.get('/weather/alerts', { params: { city } })

/**
 * Fetch analytics data (temperature trend, rain, wind).
 * @param {string} city
 */
export const getAnalytics = (city = 'London') =>
  api.get('/weather/analytics', { params: { city } })

/**
 * Fetch weather for multiple map cities.
 */
export const getMapCities = () =>
  api.get('/weather/map-cities')

/**
 * Save a location bookmark.
 * @param {{ city: string, country_code?: string, lat?: number, lon?: number, is_default?: boolean }} payload
 */
export const saveLocation = (payload) =>
  api.post('/weather/locations', payload)

/**
 * List all saved locations.
 */
export const getLocations = () =>
  api.get('/weather/locations')

/**
 * Delete a saved location.
 * @param {number} id
 */
export const deleteLocation = (id) =>
  api.delete(`/weather/locations/${id}`)

export default api
