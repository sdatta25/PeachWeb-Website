import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Vercel serves privacy.html at /privacy (see vercel.json). This does the same in `npm run dev`
// and `npm run preview`, so the clean URLs work locally too.
const cleanUrls = () => {
  const rewrite = (req, _res, next) => {
    const m = req.url && req.url.match(/^\/(privacy|terms)\/?(\?.*)?$/)
    if (m) req.url = `/${m[1]}.html${m[2] || ''}`
    next()
  }
  return {
    name: 'clean-urls',
    configureServer: server => { server.middlewares.use(rewrite) },
    configurePreviewServer: server => { server.middlewares.use(rewrite) },
  }
}

export default defineConfig({
  plugins: [react(), cleanUrls()],
  server: { port: 5174 },
  build: {
    rollupOptions: {
      // 404.html is served by Vercel for any path that doesn't exist.
      input: {
        main: resolve(__dirname, 'index.html'),
        notFound: resolve(__dirname, '404.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
      },
    },
  },
})
