import { API_URL } from './api'

// Every form on the site posts to the existing backend endpoint, which emails
// peachwebdevelopment@gmail.com and sends the visitor a confirmation.
// The backend requires `name` and `description`.
export async function submitInquiry(payload) {
  const res = await fetch(`${API_URL}/api/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  let data = {}
  try { data = await res.json() } catch { /* non-JSON error page */ }
  if (!res.ok) throw new Error(data.error || 'We couldn’t send that. Please try again, or email us directly.')
  return data
}

export const isEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
