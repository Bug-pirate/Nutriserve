import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // expose to your local network so you can access on mobile
    port: 5173,      // use the original default port consistently
    strictPort: true, // fail if port is already in use instead of trying next port
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
