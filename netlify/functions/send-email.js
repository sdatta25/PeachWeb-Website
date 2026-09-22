// Mail relay for Netlify Functions (AWS Lambda, where outbound 587 is permitted).
// The Render backend calls this because Render's free tier blocks SMTP ports.
const nodemailer = require('nodemailer')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'POST only' }) }
  }
  if (event.headers['x-relay-secret'] !== process.env.MAIL_RELAY_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) }
  }

  try {
    const { from, to, subject, html, replyTo } = JSON.parse(event.body || '{}')
    if (!to || !subject || !html) {
      return { statusCode: 400, body: JSON.stringify({ error: 'to, subject and html are required' }) }
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    })

    await transporter.sendMail({ from: from || `PeachWeb <${process.env.EMAIL_USER}>`, to, subject, html, replyTo })
    return { statusCode: 200, body: JSON.stringify({ sent: true }) }
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: err.message }) }
  }
}
