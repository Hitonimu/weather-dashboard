import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://weather-dashboard-production-ddde.up.railway.app',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})