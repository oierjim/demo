import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'desarrollo.jakina.ejiedes.net',
    proxy: {
      '/x21a-api': {
        target: 'http://desarrollo.jakina.ejiedes.net:8080',
        changeOrigin: true,
        xfwd: true,
      }
    }
  }
})
