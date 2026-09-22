// Single source of truth for the backend origin.
// Set VITE_API_URL at build time to point the site at a different deployment.
export const API_URL =
  import.meta.env.VITE_API_URL || 'https://peachweb-backend.onrender.com'
