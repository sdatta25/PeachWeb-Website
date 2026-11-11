import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'
import { generateReply } from './chat.js'
import { v4 as uuidv4 } from 'uuid'
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

app.use(cors())
app.use(express.json())

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

// Escape user input before it goes into an HTML email body
function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

// --- Admin auth ---
// The key used to live in the source of a public repo, which meant anyone who
// read it could list every inquiry. It now comes from the environment, and the
// endpoints refuse to answer at all if it is unset.
const ADMIN_KEY = process.env.ADMIN_KEY

function requireAdmin(req, res, next) {
  if (!ADMIN_KEY) {
    console.error('ADMIN_KEY is not set; refusing admin request.')
    return res.status(503).json({ error: 'Admin API not configured.' })
  }
  if (req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// POST /api/inquiries — submit contact form
app.post('/api/inquiries', async (req, res) => {
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

    // Notification email to PeachWeb
    const notifyHtml = `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #FFE4D6;">
        <div style="background:#FF8C61;padding:32px 40px;">
          <h1 style="color:white;margin:0;font-size:24px;">🍑 New Website Request</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Submitted via PeachWeb</p>
        </div>
        <div style="padding:32px 40px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;color:#6B7280;font-size:13px;width:140px;">Name</td><td style="padding:10px 0;color:#1C1C1C;font-weight:600;">${esc(name)}</td></tr>
            <tr><td style="padding:10px 0;color:#6B7280;font-size:13px;">Email</td><td style="padding:10px 0;color:#1C1C1C;">${esc(email) || '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#6B7280;font-size:13px;">Phone</td><td style="padding:10px 0;color:#1C1C1C;">${esc(phone) || '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#6B7280;font-size:13px;">Organization</td><td style="padding:10px 0;color:#1C1C1C;">${esc(organization) || '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#6B7280;font-size:13px;">Org Type</td><td style="padding:10px 0;color:#1C1C1C;">${esc(orgType) || '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#6B7280;font-size:13px;">Budget</td><td style="padding:10px 0;color:#1C1C1C;font-weight:600;">${esc(budget) || '—'}</td></tr>
            <tr><td style="padding:10px 0;color:#6B7280;font-size:13px;">Services</td><td style="padding:10px 0;color:#1C1C1C;">${esc(Array.isArray(services) ? services.join(', ') : services) || '—'}</td></tr>
          </table>
          <div style="margin-top:24px;padding:20px;background:#FFF5F0;border-radius:8px;border-left:4px solid #FF8C61;">
            <p style="margin:0 0 8px;color:#6B7280;font-size:13px;font-weight:600;">PROJECT DESCRIPTION</p>
            <p style="margin:0;color:#1C1C1C;line-height:1.6;">${esc(description)}</p>
          </div>
          <p style="margin-top:24px;color:#6B7280;font-size:13px;">Inquiry ID: ${inquiry.id}</p>
        </div>
      </div>
    `

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
      // A plain recap of what the customer chose, so the budget they picked is in their copy too.
      const recapRows = [
        ['Business type', orgType],
        ['Business name', organization],
        ['Services', Array.isArray(services) ? services.join(', ') : services],
        ['Budget', budget]
      ].filter(([, v]) => v && String(v).trim())
      const recapHtml = recapRows.length ? `
            <div style="border:1px solid #FFE4D6;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
              <p style="margin:0 0 12px;font-weight:700;color:#1C1C1C;">Here's what you sent us:</p>
              <table style="width:100%;border-collapse:collapse;">
                ${recapRows.map(([label, value]) => `<tr><td style="padding:6px 0;color:#6B7280;font-size:14px;width:130px;vertical-align:top;">${label}</td><td style="padding:6px 0;color:#1C1C1C;font-size:14px;font-weight:600;">${esc(Array.isArray(value) ? value.join(', ') : value)}</td></tr>`).join('')}
              </table>
              ${/\$/.test(String(budget || '')) ? '<p style="margin:12px 0 0;color:#6B7280;font-size:13px;line-height:1.5;">Budgets are a rough guide. We will confirm a real quote after a short call.</p>' : ''}
            </div>` : ''
      const autoReplyHtml = `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #FFE4D6;">
          <div style="background:linear-gradient(135deg,#FF8C61,#E8571A);padding:40px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:28px;font-weight:800;">🍑 PeachWeb</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px;">Web Development & AI Chatbots</p>
          </div>
          <div style="padding:40px;">
            <h2 style="color:#1C1C1C;font-size:22px;margin:0 0 16px;">Hi ${esc(name)}, thanks for reaching out!</h2>
            <p style="color:#374151;line-height:1.7;font-size:15px;margin:0 0 24px;">Thanks for contacting PeachWeb. We will get back to you within 1–2 business days.</p>
            ${recapHtml}
            <div style="background:#FFF5F0;border-radius:12px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 16px;font-weight:700;color:#1C1C1C;">Here's what happens next:</p>
              <div style="display:flex;align-items:flex-start;margin-bottom:12px;gap:12px;">
                <span style="background:#FF8C61;color:white;border-radius:50%;min-width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">1</span>
                <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;">Our team reviews your request and project details.</p>
              </div>
              <div style="display:flex;align-items:flex-start;margin-bottom:12px;gap:12px;">
                <span style="background:#FF8C61;color:white;border-radius:50%;min-width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">2</span>
                <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;">We schedule a discovery call to learn about your vision.</p>
              </div>
              <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="background:#FF8C61;color:white;border-radius:50%;min-width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">3</span>
                <p style="margin:0;color:#374151;font-size:14px;line-height:1.5;">We build and launch your custom website or chatbot.</p>
              </div>
            </div>
            <p style="color:#6B7280;font-size:14px;">Questions? Reply to this email or reach us at <a href="mailto:peachwebdevelopment@gmail.com" style="color:#FF8C61;">peachwebdevelopment@gmail.com</a></p>
          </div>
          <div style="background:#FFF5F0;padding:24px;text-align:center;border-top:1px solid #FFE4D6;">
            <p style="margin:0;color:#9CA3AF;font-size:13px;">© ${new Date().getFullYear()} PeachWeb · Web Development & AI Chatbots for Local Businesses</p>
          </div>
        </div>
      `
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
