// Mail relay for Vercel Functions (Node runtime; Vercel blocks only port 25).
// The Render backend calls this because Render's free tier blocks SMTP ports.
const nodemailer = require('nodemailer')

module.exports = async (req, res) => {
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
    await transporter.sendMail({ from: from || `PeachWeb <${process.env.EMAIL_USER}>`, to, subject, html, replyTo })
    return res.status(200).json({ sent: true })
  } catch (err) {
    return res.status(502).json({ error: err.message })
  }
}
