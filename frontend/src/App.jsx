/**
 * App.jsx
 * Root component: sets up React Router, WeatherProvider, and persistent layout.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WeatherProvider } from './context/WeatherContext'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Forecast from './pages/Forecast'
import Map from './pages/Map'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'

// Persistent shell wrapping all authenticated pages
function AppShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden mesh-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <WeatherProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/forecast"  element={<Forecast />} />
            <Route path="/map"       element={<Map />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/alerts"    element={<Alerts />} />
            <Route path="/settings"  element={<Settings />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </WeatherProvider>
  )
}
