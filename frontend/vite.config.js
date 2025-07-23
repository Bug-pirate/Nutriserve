import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // expose to your local network so you can access on mobile
    port: 5173,      // optional: keep your current port
  },
})
