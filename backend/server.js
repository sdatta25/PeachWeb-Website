import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import Groq from 'groq-sdk'
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

app.use(cors())
app.use(express.json())

// --- JSON file storage (no native modules needed) ---
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

// --- Email transporter ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// --- Groq client (lazy: a missing key must not take down the whole server) ---
let groq = null
function getGroq() {
  if (!process.env.GROQ_API_KEY) return null
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  return groq
}

const CHAT_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'

// --- Verify SMTP credentials at boot (logs only, never sends mail) ---
let emailReady = false
transporter.verify()
  .then(() => { emailReady = true; console.log('SMTP ready — inquiry emails will send.') })
  .catch(err => console.error('SMTP NOT ready — inquiry emails will fail:', err.message))

// Escape user input before it goes into an HTML email body
function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
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
            <tr><td style="padding:10px 0;color:#6B7280;font-size:13px;">Budget</td><td style="padding:10px 0;color:#1C1C1C;">${esc(budget) || '—'}</td></tr>
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
      await transporter.sendMail({
        from: `"PeachWeb Inquiries" <${process.env.EMAIL_USER}>`,
        to: 'peachwebdevelopment@gmail.com',
        subject: `New Website Request from ${name}${organization ? ' (' + organization + ')' : ''}`,
        html: notifyHtml
      })
      emailed = true
    } catch (err) {
      emailError = err.message
      console.error('Notify email failed:', err.message)
    }

    // Auto-reply ONLY if email provided
    if (email && email.trim()) {
      const autoReplyHtml = `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #FFE4D6;">
          <div style="background:linear-gradient(135deg,#FF8C61,#E8571A);padding:40px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:28px;font-weight:800;">🍑 PeachWeb</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px;">Web Development & AI Chatbots</p>
          </div>
          <div style="padding:40px;">
            <h2 style="color:#1C1C1C;font-size:22px;margin:0 0 16px;">Hi ${esc(name)}, thanks for reaching out!</h2>
            <p style="color:#374151;line-height:1.7;font-size:15px;margin:0 0 24px;">Thanks for contacting PeachWeb. We will get back to you in a few business days. Stay tuned to receive further information for your request.</p>
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
            <p style="margin:0;color:#9CA3AF;font-size:13px;">© 2024 PeachWeb · Web Development & AI Chatbots for Local Businesses</p>
          </div>
        </div>
      `
      transporter.sendMail({
        from: `"PeachWeb" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thanks for contacting PeachWeb!',
        html: autoReplyHtml
      }).catch(err => console.error('Auto-reply to', email, 'failed:', err.message))
    }

    // The inquiry is saved either way; `emailed` tells us if the notification got out.
    res.status(201).json({ success: true, id: inquiry.id, emailed, emailError })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error. Please try again.' })
  }
})

// GET /api/inquiries — admin only
app.get('/api/inquiries', (req, res) => {
  if (req.headers['x-admin-key'] !== 'peachwebadmin2024') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const inquiries = readInquiries()
  res.json([...inquiries].reverse())
})

// PATCH /api/inquiries/:id — update status
app.patch('/api/inquiries/:id', (req, res) => {
  if (req.headers['x-admin-key'] !== 'peachwebadmin2024') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const inquiries = readInquiries()
  const idx = inquiries.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  inquiries[idx].status = req.body.status
  inquiries[idx].updatedAt = new Date().toISOString()
  writeInquiries(inquiries)
  res.json({ success: true })
})

// DELETE /api/inquiries/:id
app.delete('/api/inquiries/:id', (req, res) => {
  if (req.headers['x-admin-key'] !== 'peachwebadmin2024') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const inquiries = readInquiries()
  const filtered = inquiries.filter(i => i.id !== req.params.id)
  writeInquiries(filtered)
  res.json({ success: true })
})

// POST /api/chat — AI chatbot via Groq
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array required' })
    }

    const systemPrompt = `You are Peachy, the friendly AI assistant for PeachWeb — a web development company that builds custom websites and AI chatbots for local businesses and organizations.

About PeachWeb:
- We specialize in building professional websites and AI chatbots for local businesses and community organizations
- Everything we build is custom, modern, and mobile-friendly
- We offer post-launch support and maintenance
- Contact: peachwebdevelopment@gmail.com

What we build:
1. Custom Websites — Beautiful, fast, mobile-first websites tailored to each business
2. AI Chatbots — Smart AI assistants that answer customer questions 24/7 and capture leads
3. Mobile-First Design — Sites that look great on any device
4. Post-Launch Support — Ongoing help, updates, and maintenance

Our 4-step process:
1. Reach Out — Fill out our "Request a Website" form or email us about your project
2. Plan — We schedule a discovery call, understand your goals, and create a clear plan
3. Build — Our team designs and develops your custom site or chatbot with your feedback
4. Launch — We deploy, test everything, and hand you the keys with full training

Keep answers warm, helpful, and concise (2-4 sentences max). If someone wants to get started, tell them to click "Request a Website" or email peachwebdevelopment@gmail.com. Don't invent pricing — say to reach out for a free consultation.

After every response, end with exactly this line on its own: "Would you like to know more, or is that all?"`

    const client = getGroq()
    if (!client) {
      return res.status(503).json({ error: 'Chat unavailable — GROQ_API_KEY is not set on the server.' })
    }

    const response = await client.chat.completions.create({
      model: CHAT_MODEL,
      max_tokens: 400,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ]
    })

    res.json({ reply: response.choices[0].message.content })
  } catch (err) {
    // Surface the upstream status/code so failures are diagnosable without dashboard access.
    const status = err.status || 500
    const code = err.error?.error?.code || err.code || null
    console.error('Chat error:', status, code, err.message)
    res.status(status === 401 || status === 404 ? 502 : 500).json({
      error: 'Chat unavailable right now.',
      upstreamStatus: status,
      upstreamCode: code,
      model: CHAT_MODEL
    })
  }
})

// GET /api/health — config check. Never returns secrets, only whether they are usable.
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    chatModel: CHAT_MODEL,
    groqKeySet: Boolean(process.env.GROQ_API_KEY),
    emailUserSet: Boolean(process.env.EMAIL_USER),
    emailPassSet: Boolean(process.env.EMAIL_PASS),
    smtpReady: emailReady
  })
})

app.listen(PORT, () => console.log(`PeachWeb backend running on http://localhost:${PORT}`))
