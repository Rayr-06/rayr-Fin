import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rayr-Fin/',
  server: {
    port: 5173,
  }
})
