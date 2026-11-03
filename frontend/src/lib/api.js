// Single source of truth for the backend origin.
// Set VITE_API_URL at build time to point the site at a different deployment.
export const API_URL =
  import.meta.env.VITE_API_URL || 'https://peachweb-backend.onrender.com'

// Wakes the backend as soon as the site loads. Render's free tier sleeps when idle and the
// first request after that takes 20 to 30 seconds, so by the time a visitor finishes reading
// and submits a form or sends a chat message, the backend is already up.
// The reply is not needed (and is opaque under no-cors), so failures are ignored.
let warmed = false
export function warmBackend() {
  if (warmed) return
  warmed = true
  fetch(API_URL, { mode: 'no-cors', cache: 'no-store' }).catch(() => {})
}
