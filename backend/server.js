import express from 'express'
import cors from 'cors'
import { timingSafeEqual } from 'crypto'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { generateReply } from './chat.js'
import { v4 as uuidv4 } from 'uuid'
import { buildNotifyEmail, buildAutoReplyEmail } from './emails.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3002

// Render (and most hosts) put one proxy in front of the app; without this every visitor
// shares the proxy's IP and the chat rate limit below would throttle everyone at once.
app.set('trust proxy', 1)

// Only PeachWeb's own pages may call this API from a browser. Requests with no Origin
// header (uptime checks, curl) are unaffected: CORS is a browser rule.
const ALLOWED_ORIGINS = new Set([
  'https://www.peachwebatl.com',
  'https://peachwebatl.com',
  'https://peachwebatl.vercel.app',
  'http://localhost:5174',
  ...String(process.env.EXTRA_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
])
const PREVIEW_ORIGIN = /^https:\/\/peachweb[a-z0-9-]*\.vercel\.app$/ // this project's preview deploys
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || ALLOWED_ORIGINS.has(origin) || PREVIEW_ORIGIN.test(origin)),
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  maxAge: 600
}))

// Basic hardening headers for the API's own responses.
app.disable('x-powered-by')
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains'
  })
  next()
})

// 64 KB is far above any real form or chat history, and far below what an attacker would send.
app.use(express.json({ limit: '64kb' }))
app.use((err, req, res, next) => {
  if (err?.type === 'entity.too.large') return res.status(413).json({ error: 'That request is too large. Please shorten your message.' })
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'That request could not be read.' })
  next(err)
})

// --- JSON file storage (no native modules needed) ---
// NOTE: on hosts with an ephemeral filesystem (Render's free tier included) this
// file is wiped on every deploy and restart. Treat it as a convenience cache for
// the admin endpoints, never as the record of a lead -- the notification email is
// the durable copy, which is why a submission fails loudly if that email does not
// get out. See the emailed check in POST /api/inquiries below.
const DATA_FILE = join(__dirname, 'data', 'inquiries.json')

function readInquiries() {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, '[]', 'utf8')
    return []
  }
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return []
  }
}

function writeInquiries(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

// ensure data dir exists
import { mkdirSync } from 'fs'
const dataDir = join(__dirname, 'data')
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, '[]', 'utf8')

// --- Email ---
// Render's free tier blackholes outbound SMTP (ports 25/465/587), so Gmail/nodemailer
// times out there. Resend goes over HTTPS and is unaffected; SMTP stays as a fallback
// for local dev and paid instances.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const INQUIRY_INBOX = process.env.INQUIRY_INBOX || 'peachwebdevelopment@gmail.com'
const GMAIL_SENDER = process.env.EMAIL_USER || 'peachwebdevelopment@gmail.com'
// EMAIL_TRANSPORT pins the choice ('gmail' | 'resend' | 'smtp'); otherwise the first
// configured one wins. Pinning avoids a leftover RESEND_API_KEY silently shadowing SMTP.
const FORCED_TRANSPORT = process.env.EMAIL_TRANSPORT || null
// A relay is a tiny serverless function on a host that permits outbound SMTP.
// Render's free tier blocks those ports; Netlify/Vercel functions (AWS Lambda) do not.
const relayEnabled = FORCED_TRANSPORT
  ? FORCED_TRANSPORT === 'relay'
  : Boolean(process.env.MAIL_RELAY_URL && process.env.MAIL_RELAY_SECRET)

async function sendViaRelay({ from, to, subject, html, replyTo }) {
  const res = await fetch(process.env.MAIL_RELAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-relay-secret': process.env.MAIL_RELAY_SECRET
    },
    body: JSON.stringify({ from, to, subject, html, replyTo })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`Relay ${res.status}: ${data.error || 'send failed'}`)
}
const gmailEnabled = FORCED_TRANSPORT
  ? FORCED_TRANSPORT === 'gmail'
  : Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN
    )
const resendEnabled = FORCED_TRANSPORT
  ? FORCED_TRANSPORT === 'resend'
  : Boolean(process.env.RESEND_API_KEY)
const MAIL_FROM = process.env.MAIL_FROM ||
  (resendEnabled && !gmailEnabled && !relayEnabled
    ? 'PeachWeb <onboarding@resend.dev>'
    : `PeachWeb <${GMAIL_SENDER}>`)

// --- Gmail API over HTTPS ---
// Sends as the Gmail account itself, and uses HTTPS rather than SMTP, so it works
// on hosts that block outbound mail ports (Render's free tier does).
let cachedToken = null // { value, expiresAt }

async function gmailAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    })
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Google token refresh failed: ${data.error_description || data.error || res.status}`)
  }
  // Refresh a minute early so a token never expires mid-request.
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 }
  return cachedToken.value
}

function buildMime({ from, to, subject, html, replyTo }) {
  // RFC 2047 for the subject so emoji and accented names survive the header.
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64'
  ].filter(Boolean)

  const body = Buffer.from(html, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n')
  return `${headers.join('\r\n')}\r\n\r\n${body}`
}

async function sendViaGmail({ from, to, subject, html, replyTo }) {
  const token = await gmailAccessToken()
  const raw = Buffer.from(buildMime({ from, to, subject, html, replyTo }), 'utf8')
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Gmail API ${res.status}: ${err.error?.message || 'send failed'}`)
  }
}

// Port 587 + STARTTLS rather than nodemailer's `service: 'gmail'` shortcut, which
// uses 465. Hosts that allow outbound mail at all tend to allow 587 specifically
// (Koyeb blocks only 25), so 587 is the portable choice.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Without these a blocked port hangs the request for ~2 minutes.
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000
})

async function sendEmail({ from, to, subject, html, replyTo }) {
  if (relayEnabled) {
    await sendViaRelay({ from: from || MAIL_FROM, to, subject, html, replyTo })
    return 'relay'
  }
  if (gmailEnabled) {
    await sendViaGmail({ from: from || MAIL_FROM, to, subject, html, replyTo })
    return 'gmail'
  }
  if (resendEnabled && resend) {
    const { error } = await resend.emails.send({
      from: from || MAIL_FROM, to, subject, html, reply_to: replyTo
    })
    if (error) throw new Error(error.message || 'Resend rejected the message')
    return 'resend'
  }
  await transporter.sendMail({ from: from || MAIL_FROM, to, subject, html, replyTo })
  return 'smtp'
}

// --- Gemini (free tier, key from Google AI Studio) ---
// GEMINI_MODEL is one model ID or a comma-separated list tried in order. If a model is
// retired (404), out of free quota (429) or overloaded (503), the next one answers
// instead. The `-latest` names are Google aliases that follow the current release.
const GEMINI_MODELS = (process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite,gemini-flash-lite-latest,gemini-flash-latest')
  .split(',').map(s => s.trim()).filter(Boolean)
// Optional: cap thinking tokens (0 turns thinking off on models that allow it). Unset by default.
const THINKING_BUDGET = process.env.GEMINI_THINKING_BUDGET ? Number(process.env.GEMINI_THINKING_BUDGET) : undefined

// Per-IP limit so a public endpoint cannot drain the free quota. In memory, which is
// fine for a single instance; it resets on restart.
const CHAT_LIMIT_PER_MIN = Number(process.env.CHAT_RATE_PER_MIN || 10)
const chatHits = new Map() // ip -> timestamps (ms) within the last minute

function chatRateLimited(ip) {
  const now = Date.now()
  const recent = (chatHits.get(ip) || []).filter(t => now - t < 60_000)
  const limited = recent.length >= CHAT_LIMIT_PER_MIN
  if (!limited) recent.push(now)
  chatHits.set(ip, recent)
  if (chatHits.size > 5000) {
    for (const [k, v] of chatHits) if (!v.length || now - v[v.length - 1] >= 60_000) chatHits.delete(k)
  }
  return limited
}

// --- Check the active email transport at boot (logs only, never sends mail) ---
let emailReady = false
if (relayEnabled) {
  emailReady = true
  console.log(`Email transport: relay -> ${process.env.MAIL_RELAY_URL}`)
} else if (gmailEnabled) {
  // Fail loudly at boot if the refresh token is dead, rather than on a customer's submission.
  gmailAccessToken()
    .then(() => { emailReady = true; console.log(`Email transport: Gmail API (HTTPS), from ${MAIL_FROM}`) })
    .catch(err => console.error('Email transport: Gmail API NOT ready —', err.message))
} else if (resendEnabled && resend) {
  emailReady = true
  console.log(`Email transport: Resend (HTTPS), from ${MAIL_FROM}`)
} else {
  transporter.verify()
    .then(() => { emailReady = true; console.log('Email transport: SMTP ready.') })
    .catch(err => console.error('Email transport: SMTP NOT ready — inquiry emails will fail:', err.message))
}

// --- Admin auth ---
// The key used to live in the source of a public repo, which meant anyone who
// read it could list every inquiry. It now comes from the environment, and the
// endpoints refuse to answer at all if it is unset.
const ADMIN_KEY = process.env.ADMIN_KEY

// Constant-time comparison, so response timing reveals nothing about the key.
function sameSecret(given, expected) {
  const a = Buffer.from(String(given || ''))
  const b = Buffer.from(String(expected))
  return a.length === b.length && timingSafeEqual(a, b)
}

// The contact forms: a few submissions per visitor per 15 minutes. Generous for a real
// person, and it stops a script from spamming the inbox or burning the email quota.
const INQUIRY_LIMIT = Number(process.env.INQUIRY_RATE_PER_15MIN || 5)
const inquiryHits = new Map() // ip -> timestamps (ms) within the last 15 minutes

function inquiryRateLimited(ip) {
  const now = Date.now()
  const windowMs = 15 * 60_000
  const recent = (inquiryHits.get(ip) || []).filter(t => now - t < windowMs)
  const limited = recent.length >= INQUIRY_LIMIT
  if (!limited) recent.push(now)
  inquiryHits.set(ip, recent)
  if (inquiryHits.size > 5000) {
    for (const [k, v] of inquiryHits) if (!v.length || now - v[v.length - 1] >= windowMs) inquiryHits.delete(k)
  }
  return limited
}

// Upper bounds for each field. Above anything the site's forms can send.
const FIELD_LIMITS = { name: 120, email: 254, phone: 40, organization: 160, orgType: 80, budget: 40, description: 6000 }

function invalidInquiry(body) {
  for (const [field, max] of Object.entries(FIELD_LIMITS)) {
    const v = body[field]
    if (v != null && typeof v !== 'string') return `Please check the ${field} field.`
    if (v && v.length > max) return `The ${field} field is too long (${max} characters at most).`
  }
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) return 'Please enter a valid email address.'
  const s = body.services
  if (s != null && !(Array.isArray(s) && s.length <= 5 && s.every(x => typeof x === 'string' && x.length <= 40))) {
    return 'Please check the services you picked.'
  }
  return null
}

function requireAdmin(req, res, next) {
  if (!ADMIN_KEY) {
    console.error('ADMIN_KEY is not set; refusing admin request.')
    return res.status(503).json({ error: 'Admin API not configured.' })
  }
  if (!sameSecret(req.headers['x-admin-key'], ADMIN_KEY)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// POST /api/inquiries — submit contact form
app.post('/api/inquiries', async (req, res) => {
  // Validate first, so a visitor fixing a typo isn't counted against the limit.
  const problem = invalidInquiry(req.body || {})
  if (problem) return res.status(400).json({ error: problem })
  if (inquiryRateLimited(req.ip)) {
    return res.status(429).json({ error: "You've sent several requests in a short time. Please wait a few minutes, or email peachwebdevelopment@gmail.com." })
  }
  try {
    const { name, email, phone, organization, orgType, description, budget, services } = req.body

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required.' })
    }

    const inquiry = {
      id: uuidv4(),
      name,
      email: email || null,
      phone: phone || null,
      organization: organization || null,
      orgType: orgType || null,
      description,
      budget: budget || null,
      services: services || null,
      status: 'new',
      createdAt: new Date().toISOString()
    }

    const inquiries = readInquiries()
    inquiries.push(inquiry)
    writeInquiries(inquiries)

    // Notification email to PeachWeb (the template lives in emails.js)
    const notifyHtml = buildNotifyEmail(inquiry)

    let emailed = false
    let emailError = null
    try {
      const via = await sendEmail({
        to: INQUIRY_INBOX,
        replyTo: email && email.trim() ? email.trim() : undefined,
        subject: `New Website Request from ${name}${organization ? ' (' + organization + ')' : ''}`,
        html: notifyHtml
      })
      emailed = true
      console.log(`Notify email sent via ${via} for inquiry ${inquiry.id}`)
    } catch (err) {
      emailError = err.message
      console.error('Notify email failed:', err.message)
    }

    // Auto-reply ONLY if email provided
    if (email && email.trim()) {
      const autoReplyHtml = buildAutoReplyEmail(inquiry)
      sendEmail({
        to: email,
        subject: 'Thanks for contacting PeachWeb!',
        html: autoReplyHtml
      }).catch(err => console.error('Auto-reply to', email, 'failed:', err.message))
    }

    // The local file is wiped on redeploy, so a lead only truly exists once the
    // notification email is out. Tell the customer rather than showing a success
    // screen over a submission that is about to evaporate.
    if (!emailed) {
      return res.status(502).json({
        error: "We couldn't submit your request right now. Please email peachwebdevelopment@gmail.com directly — sorry about that!",
        id: inquiry.id,
        emailed: false,
        emailError
      })
    }

    res.status(201).json({ success: true, id: inquiry.id, emailed, emailError })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

// GET /api/inquiries — admin only
app.get('/api/inquiries', requireAdmin, (req, res) => {
  const inquiries = readInquiries()
  res.json([...inquiries].reverse())
})

// PATCH /api/inquiries/:id — update status
app.patch('/api/inquiries/:id', requireAdmin, (req, res) => {
  const inquiries = readInquiries()
  const idx = inquiries.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  inquiries[idx].status = req.body.status
  inquiries[idx].updatedAt = new Date().toISOString()
  writeInquiries(inquiries)
  res.json({ success: true })
})

// DELETE /api/inquiries/:id
app.delete('/api/inquiries/:id', requireAdmin, (req, res) => {
  const inquiries = readInquiries()
  const filtered = inquiries.filter(i => i.id !== req.params.id)
  writeInquiries(filtered)
  res.json({ success: true })
})

// POST /api/chat — Peachy, the site assistant (Gemini). Prompt and API call live in chat.js.
app.post('/api/chat', async (req, res) => {
  if (chatRateLimited(req.ip)) {
    return res.status(429).json({
      error: 'Too many messages.',
      userMessage: "You're sending messages quickly. Give me a few seconds, then try again."
    })
  }

  try {
    const { reply, suggestions } = await generateReply({
      messages: req.body?.messages,
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.GEMINI_BASE_URL || undefined, // only set to point at a test double
      models: GEMINI_MODELS,
      thinkingBudget: THINKING_BUDGET
    })
    res.json({ reply, suggestions })
  } catch (err) {
    // Log the upstream status/code so failures are diagnosable from the host's logs.
    console.error('Chat error:', err.status, err.code, err.message)
    if (err.status === 400 && err.code === 'BAD_REQUEST') {
      return res.status(400).json({ error: err.message })
    }
    const noKey = err.code === 'NO_KEY'
    res.status(noKey ? 503 : err.status === 429 ? 429 : 502).json({
      error: noKey ? 'Chat unavailable: GEMINI_API_KEY is not set on the server.' : 'Chat unavailable right now.',
      userMessage: err.userMessage || undefined,
      upstreamStatus: err.status,
      upstreamCode: err.code,
      models: GEMINI_MODELS
    })
  }
})

// GET /api/health — config check. Never returns secrets, only whether they are usable.
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    chatModels: GEMINI_MODELS,
    geminiKeySet: Boolean(process.env.GEMINI_API_KEY),
    emailTransport: relayEnabled ? 'relay'
      : gmailEnabled ? 'gmail'
      : (resendEnabled && resend ? 'resend' : 'smtp'),
    mailFrom: MAIL_FROM,
    emailReady
  })
})

app.listen(PORT, () => console.log(`PeachWeb backend running on http://localhost:${PORT}`))
