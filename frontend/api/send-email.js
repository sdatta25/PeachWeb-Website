// Mail relay running as a Vercel Function (Node runtime).
// Render's free tier blocks outbound SMTP ports; Vercel blocks only port 25,
// so the Gmail hop happens here and the backend calls this over HTTPS.
import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  if (req.headers['x-relay-secret'] !== process.env.MAIL_RELAY_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { from, to, subject, html, replyTo } = req.body || {}
    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'to, subject and html are required' })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    })

    // Awaited, not fire-and-forget: Vercel freezes the function once it responds.
    await transporter.sendMail({
      from: from || `PeachWeb <${process.env.EMAIL_USER}>`,
      to, subject, html, replyTo
    })
    return res.status(200).json({ sent: true })
  } catch (err) {
    return res.status(502).json({ error: err.message })
  }
}
