import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useFetch } from '../hooks/useFetch'
import { getMapCities } from '../services/api'
import { useWeather } from '../context/WeatherContext'
import { Wind, Droplets, Eye, Thermometer } from 'lucide-react'

const conditionStyle = (condition = '') => {
  const c = condition.toLowerCase()
  if (c.includes('thunder') || c.includes('petir')) return { color: '#6366f1', emoji: '⛈️' }
  if (c.includes('heavy rain') || c.includes('lebat')) return { color: '#2563eb', emoji: '🌧️' }
  if (c.includes('rain') || c.includes('hujan') || c.includes('drizzle') || c.includes('gerimis')) return { color: '#3b82f6', emoji: '🌦️' }
  if (c.includes('mist') || c.includes('fog') || c.includes('kabut')) return { color: '#94a3b8', emoji: '🌫️' }
  if (c.includes('overcast') || c.includes('mendung')) return { color: '#64748b', emoji: '☁️' }
  if (c.includes('cloud') || c.includes('berawan') || c.includes('patchy')) return { color: '#60a5fa', emoji: '⛅' }
  return { color: '#f59e0b', emoji: '☀️' }
}

const createWeatherIcon = (temp, condition) => {
  const { color } = conditionStyle(condition)
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="72" viewBox="0 0 64 72">',
    '<defs><filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.18)"/></filter></defs>',
    '<circle cx="32" cy="28" r="24" fill="white" filter="url(#sh)"/>',
    '<circle cx="32" cy="28" r="18" fill="' + color + '" opacity="0.15"/>',
    '<circle cx="32" cy="28" r="10" fill="' + color + '" opacity="0.35"/>',
    '<text x="32" y="33" text-anchor="middle" font-size="11" font-weight="bold" fill="' + color + '" font-family="sans-serif">' + Math.round(temp) + '&#176;</text>',
    '<polygon points="27,52 32,62 37,52" fill="white" stroke="' + color + '" stroke-width="1.5"/>',
    '</svg>'
  ].join('')
  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svg),
    iconSize: [64, 72],
    iconAnchor: [32, 62],
    popupAnchor: [0, -64],
  })
}

const MAP_LAYERS = [
  { id: 'standard', name: 'Standard', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
  { id: 'terrain',  name: 'Terrain',  url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'  },
]

const MAP_H = 420

export default function Map() {
  const { selectCity } = useWeather()
  const [activeLayer, setActiveLayer] = useState('standard')
  const [selectedCity, setSelectedCity] = useState(null)

  const { data, loading } = useFetch(getMapCities, [])
  const cities = data?.cities || []
  const layer = MAP_LAYERS.find(l => l.id === activeLayer) || MAP_LAYERS[0]

  const handleSelectCity = (c) => {
    setSelectedCity(c)
    selectCity(c.city)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 lg:p-8 flex flex-col gap-4">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold font-display text-slate-800 dark:text-slate-100">Peta Cuaca</h1>
          <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Kondisi real-time kota-kota besar Indonesia</p>
        </div>
        <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 rounded-2xl p-1 border border-slate-200 dark:border-slate-700">
          {MAP_LAYERS.map(l => (
            <button key={l.id} onClick={() => setActiveLayer(l.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeLayer === l.id ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-primary'}`}>
              {l.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">

        <div style={{ height: MAP_H + 'px' }} className="flex-1 rounded-3xl overflow-hidden shadow-glass border border-white/20 dark:border-slate-700/50">
          {loading ? (
            <div style={{ height: MAP_H + 'px' }} className="w-full bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
              <span className="text-slate-400 text-sm">Memuat peta...</span>
            </div>
          ) : (
            <MapContainer center={[-2.5, 118]} zoom={5} scrollWheelZoom={true} style={{ height: MAP_H + 'px', width: '100%' }}>
              <TileLayer url={layer.url} attribution='&copy; OpenStreetMap' />
              {cities.map(c => (
                <Marker key={c.city} position={[c.lat, c.lon]}
                  icon={createWeatherIcon(c.temp, c.condition)}
                  eventHandlers={{ click: () => handleSelectCity(c) }}
                >
                  <Popup>
                    <div className="font-sans p-1 min-w-[130px]">
                      <p className="font-bold text-slate-800 text-sm">{c.city}</p>
                      <p className="text-slate-500 text-xs capitalize mt-0.5">{c.condition}</p>
                      <p className="font-bold text-blue-600 text-lg mt-1">{Math.round(c.temp)}°C</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        <div style={{ maxHeight: MAP_H + 'px' }} className="w-full lg:w-64 xl:w-72 flex-shrink-0 glass-card p-4 overflow-y-auto">
          <h3 className="font-bold font-display text-slate-800 dark:text-slate-100 mb-3 text-xs uppercase tracking-wider">Cuaca Kota</h3>
          <div className="space-y-1.5">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />)
              : cities.map(c => {
                  const { color, emoji } = conditionStyle(c.condition)
                  return (
                    <motion.button key={c.city} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectCity(c)}
                      className={`w-full text-left p-3 rounded-2xl transition-all duration-200 border flex items-center gap-3 ${
                        selectedCity?.city === c.city ? 'bg-primary/10 border-primary/30' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{c.city}</p>
                        <p className="text-xs text-slate-400 capitalize truncate">{c.condition}</p>
                      </div>
                      <span className="font-bold text-sm flex-shrink-0" style={{ color }}>{Math.round(c.temp)}°</span>
                    </motion.button>
                  )
                })
            }
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCity && (
          <motion.div key={selectedCity.city} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass-card p-5">
            {(() => {
              const { color, emoji } = conditionStyle(selectedCity.condition)
              return (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-5xl">{emoji}</span>
                    <div>
                      <p className="text-xl font-extrabold font-display text-slate-800 dark:text-slate-100">{selectedCity.city}</p>
                      <p className="text-sm text-slate-400 capitalize">{selectedCity.condition}</p>
                    </div>
                    <p className="text-4xl font-extrabold ml-auto sm:ml-6" style={{ color }}>{Math.round(selectedCity.temp)}°C</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-5">
                    {[
                      { icon: Droplets,    label: 'Humidity', val: selectedCity.humidity ? selectedCity.humidity + '%' : '—' },
                      { icon: Wind,        label: 'Angin',    val: selectedCity.wind_speed ? Math.round(selectedCity.wind_speed) + ' km/h' : '—' },
                      { icon: Eye,         label: 'Visib.',   val: selectedCity.visibility ? selectedCity.visibility + ' km' : '—' },
                      { icon: Thermometer, label: 'Terasa',   val: selectedCity.feels_like ? Math.round(selectedCity.feels_like) + '°' : '—' },
                    ].map(({ icon: Ic, label, val }) => (
                      <div key={label} className="flex items-center gap-2">
                        <Ic size={14} className="text-primary flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400">{label}</p>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}