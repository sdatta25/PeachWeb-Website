import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
  build: {
    rollupOptions: {
      // 404.html is served by Vercel for any path that doesn't exist.
      input: { main: resolve(__dirname, 'index.html'), notFound: resolve(__dirname, '404.html') },
    },
  },
})
