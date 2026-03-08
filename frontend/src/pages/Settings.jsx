/**
 * pages/Settings.jsx
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWeather } from '../context/WeatherContext'
import { useFetch } from '../hooks/useFetch'
import { getLocations, saveLocation, deleteLocation } from '../services/api'
import { User, Globe, MapPin, Plus, Trash2, Check, Pencil, X } from 'lucide-react'

const SECTION = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function SettingsSection({ title, icon: Icon, children }) {
  return (
    <motion.div variants={SECTION} className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon size={18} className="text-primary" />
        </div>
        <h2 className="font-bold font-display text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      {children}
    </motion.div>
  )
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"

export default function Settings() {
  const { unit, toggleUnit, isDark, toggleTheme } = useWeather()

  const [profile, setProfile] = useState({
    name: 'Cenayang Cuaca',
    email: 'cenayang@cuaca.id',
    location: 'Jakarta, Indonesia',
  })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...profile })
  const [profileSaved, setProfileSaved] = useState(false)

  const handleSaveProfile = () => {
    setProfile({ ...draft })
    setEditing(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const initials = profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const [newCity, setNewCity] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { data, refetch } = useFetch(getLocations, [])
  const locations = data || []

  const handleSaveCity = async () => {
    if (!newCity.trim()) return
    setSaving(true)
    try {
      await saveLocation({ city: newCity.trim() })
      setNewCity('')
      setSaved(true)
      refetch()
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteLocation(id)
      refetch()
    } catch (e) { console.error(e) }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="p-6 lg:p-8 space-y-6 max-w-2xl"
    >
      <motion.div variants={SECTION}>
        <h1 className="text-2xl font-extrabold font-display text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Kelola preferensi dan lokasi tersimpan</p>
      </motion.div>

      {/* Profile */}
      <SettingsSection title="Profile" icon={User}>
        {!editing ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-weather-gradient rounded-2xl flex items-center justify-center text-white text-xl font-bold font-display flex-shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100">{profile.name}</p>
                <p className="text-sm text-slate-400">{profile.email}</p>
                <p className="text-xs text-slate-400 mt-0.5">{profile.location}</p>
              </div>
            </div>
            <button
              onClick={() => { setDraft({ ...profile }); setEditing(true) }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-all"
            >
              <Pencil size={13} /> Edit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 bg-weather-gradient rounded-2xl flex items-center justify-center text-white text-xl font-bold font-display flex-shrink-0">
                {draft.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <p className="text-xs text-slate-400">Inisial otomatis dari nama</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Nama</label>
              <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Nama kamu" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Email</label>
              <input value={draft.email} onChange={e => setDraft(d => ({ ...d, email: e.target.value }))} placeholder="email@kamu.com" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Lokasi</label>
              <input value={draft.location} onChange={e => setDraft(d => ({ ...d, location: e.target.value }))} placeholder="Jakarta, Indonesia" className={inputCls} />
            </div>
            <div className="flex gap-2 pt-1">
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSaveProfile} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-all">
                <Check size={13} /> Simpan
              </motion.button>
              <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                <X size={13} /> Batal
              </button>
            </div>
          </div>
        )}
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection title="Preferences" icon={Globe}>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Satuan Suhu</p>
              <p className="text-xs text-slate-400">Celsius atau Fahrenheit</p>
            </div>
            <button onClick={toggleUnit} className={`relative w-24 h-9 rounded-xl flex items-center justify-between px-3 text-xs font-bold transition-all duration-200 ${unit === 'metric' ? 'bg-primary text-white' : 'bg-orange-500 text-white'}`}>
              <span className={unit === 'metric' ? 'opacity-100' : 'opacity-50'}>°C</span>
              <span className={unit === 'imperial' ? 'opacity-100' : 'opacity-50'}>°F</span>
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dark Mode</p>
              <p className="text-xs text-slate-400">Tampilan gelap / terang</p>
            </div>
            <button onClick={toggleTheme} className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isDark ? 'bg-primary' : 'bg-slate-200'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${isDark ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Saved Locations */}
      <SettingsSection title="Saved Locations" icon={MapPin}>
        <div className="flex gap-2">
          <input value={newCity} onChange={(e) => setNewCity(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveCity()} placeholder="Tambah kota..." className={inputCls} />
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleSaveCity} disabled={saving || !newCity.trim()} className="btn-primary flex items-center gap-1.5 disabled:opacity-50 whitespace-nowrap">
            {saved ? <Check size={16} /> : <Plus size={16} />}
            {saved ? 'Tersimpan!' : 'Add'}
          </motion.button>
        </div>
        {locations.length > 0 && (
          <div className="space-y-2 mt-2">
            {locations.map((loc) => (
              <motion.div key={loc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {loc.city}
                    {loc.country_code && <span className="text-slate-400 ml-1 text-xs">{loc.country_code}</span>}
                  </span>
                  {loc.is_default && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Default</span>}
                </div>
                <button onClick={() => handleDelete(loc.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
        {locations.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Belum ada lokasi tersimpan. Tambah kota di atas.</p>}
      </SettingsSection>
    </motion.div>
  )
}