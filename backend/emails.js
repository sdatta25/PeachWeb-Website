// The two emails a request triggers: the notification to PeachWeb and the confirmation to the
// customer. Both are built here as HTML strings; server.js sends them.
//
// Email clients are picky, so these follow the usual rules: layout is tables, every style is
// inline, fonts are a system stack (Gmail ignores web fonts), every coloured band has a solid
// background-color (Outlook drops gradients), and the logo is the only image. The logo is always
// paired with the "PeachWeb" wordmark as text, so the email still reads with images blocked.
//
// The palette is the site's: peach and ink, with burnt orange for small accents, on the logo's
// own cream. Set SITE_URL if the site's address changes (it is used for the logo and one link).

const SITE_URL = (process.env.SITE_URL || 'https://www.peachwebatl.com').replace(/\/+$/, '')
const LOGO_URL = `${SITE_URL}/apple-touch-icon.png`
const CONTACT_EMAIL = 'peachwebdevelopment@gmail.com'
const LOCATION = 'Alpharetta & north Atlanta, GA'

const C = {
  peach: '#FFBE8F',
  onPeach: '#50301C',   // body text on the peach band: 7.5:1
  page: '#FFF4EA',
  logoBg: '#FBF7F1',    // the logo image's own background, so the strip around it is seamless
  cream: '#FFFAF5',
  chip: '#FFE7D3',
  line: '#F0C4A0',
  ink: '#2B1810',
  muted: '#7A4E36',     // 6.8:1 on white
  burnt: '#B04A14',     // 5.0:1 on white
  white: '#FFFFFF',
}
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
const WRAP = 'word-break:break-word;overflow-wrap:anywhere;'

// Escape visitor input before it goes into an HTML email.
export function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

const has = v => v != null && String(v).trim() !== ''
const joinList = v => (Array.isArray(v) ? v.join(', ') : String(v ?? ''))
const clip = (v, n) => (String(v).length > n ? String(v).slice(0, n) + '…' : String(v))
const multiline = v => esc(v).replace(/\r?\n/g, '<br>')

// The frame shared by both emails: logo strip, a peach hero band, the body, and a dark footer.
function shell({ title, preheader, hero, body, footer }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<style>
  @media (max-width: 480px) {
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .h1 { font-size: 28px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${C.page};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.page};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${C.white};border:1px solid ${C.line};border-radius:16px;overflow:hidden;">
    <tr><td class="px" style="background-color:${C.logoBg};padding:18px 32px;border-bottom:1px solid ${C.line};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="padding-right:12px;"><img src="${LOGO_URL}" width="44" height="44" alt="" style="display:block;border:0;outline:none;text-decoration:none;border-radius:10px;"></td>
        <td style="font-family:${FONT};font-size:22px;font-weight:700;letter-spacing:-0.02em;color:${C.ink};">PeachWeb</td>
      </tr></table>
    </td></tr>
    <tr><td class="px" style="background-color:${C.peach};padding:36px 32px 40px;font-family:${FONT};">
      ${hero}
    </td></tr>
    <tr><td class="px" style="padding:32px;font-family:${FONT};color:${C.ink};">
      ${body}
    </td></tr>
    <tr><td class="px" style="background-color:${C.ink};padding:28px 32px;font-family:${FONT};font-size:13px;line-height:1.6;color:${C.chip};">
      ${footer}
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`
}

// A heading above a block of content.
const heading = text => `<p style="margin:0 0 14px;font-family:${FONT};font-size:17px;font-weight:700;letter-spacing:-0.01em;color:${C.ink};">${text}</p>`

// One label/value row of a details table.
function detailRow([label, value, opts = {}], first) {
  const border = first ? '' : `border-top:1px solid ${C.line};`
  const valueStyle = opts.accent ? `color:${C.burnt};` : `color:${C.ink};`
  return `<tr>
    <td valign="top" style="${border}padding:11px 16px 11px 0;width:128px;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.muted};">${label}</td>
    <td valign="top" style="${border}padding:11px 0;font-family:${FONT};font-size:15px;line-height:1.5;font-weight:600;${valueStyle}${WRAP}">${value}</td>
  </tr>`
}

const detailsTable = rows => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  ${rows.map((r, i) => detailRow(r, i === 0)).join('')}
</table>`

// A dark button. Only used for links, never for anything that needs a script.
const button = (href, label) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
  <td style="background-color:${C.ink};border-radius:8px;">
    <a href="${href}" style="display:inline-block;padding:14px 24px;font-family:${FONT};font-size:15px;font-weight:700;color:${C.peach};text-decoration:none;">${label}</a>
  </td>
</tr></table>`

const STEPS = [
  ['We review your request', 'We go through what you sent and your project details.'],
  ['We set up a short call', 'A quick discovery call to learn about your business and what you want from the site.'],
  ['We build and launch', 'Then we build and launch your custom website or chatbot.'],
]

const stepsBlock = () => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  ${STEPS.map(([title, text], i) => `<tr>
    <td valign="top" width="44" style="padding:0 0 18px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td align="center" valign="middle" width="30" height="30" style="width:30px;height:30px;background-color:${C.peach};border-radius:15px;font-family:${FONT};font-size:14px;font-weight:700;line-height:30px;color:${C.ink};">${i + 1}</td>
      </tr></table>
    </td>
    <td valign="top" style="padding:0 0 18px;font-family:${FONT};font-size:15px;line-height:1.5;color:${C.muted};">
      <span style="font-weight:700;color:${C.ink};">${title}</span><br>${text}
    </td>
  </tr>`).join('')}
</table>`

// ---- The confirmation the customer receives ----
export function buildAutoReplyEmail({ name, orgType, organization, budget, services }) {
  const first = String(name || '').trim().split(/\s+/)[0] || 'there'
  const rows = [
    ['Business type', orgType],
    ['Business name', organization],
    ['Services', joinList(services)],
    ['Budget', budget, { accent: true }],
  ].filter(([, v]) => has(v)).map(([label, v, opts]) => [label, esc(v), opts])
  // The note is only true of an actual range, not of "Not sure yet".
  const budgetNote = /\$/.test(String(budget || ''))
    ? `<p style="margin:12px 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${C.muted};">Budgets are a rough guide. We will confirm a real quote after a short call.</p>`
    : ''

  const recap = rows.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;background-color:${C.cream};border:1px solid ${C.line};border-radius:12px;">
        <tr><td style="padding:20px 24px;">
          ${heading('What you sent us')}
          ${detailsTable(rows)}
          ${budgetNote}
        </td></tr>
      </table>`
    : ''

  return shell({
    title: 'We got your request',
    preheader: 'Your request is in. We will reply within 1–2 business days.',
    hero: `<h1 class="h1" style="margin:0 0 12px;font-family:${FONT};font-size:34px;line-height:1.15;font-weight:700;letter-spacing:-0.03em;color:${C.ink};">Thanks, ${esc(first)}.<br>Your request is in.</h1>
      <p style="margin:0;font-family:${FONT};font-size:17px;line-height:1.55;color:${C.onPeach};">We will reply within 1–2 business days to set up a short call.</p>`,
    body: `${recap}
      ${heading('What happens next')}
      ${stepsBlock()}
      <p style="margin:12px 0 28px;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.muted};">Questions in the meantime? Reply to this email or write to <a href="mailto:${CONTACT_EMAIL}" style="color:${C.burnt};font-weight:600;">${CONTACT_EMAIL}</a>.</p>
      ${button(`${SITE_URL}/#work`, 'See sites we’ve built')}`,
    footer: `<span style="font-size:15px;font-weight:700;color:${C.peach};">PeachWeb</span><br>
      Websites and AI chatbots for local businesses and nonprofits.<br>
      ${esc(LOCATION)}<br><br>
      <span style="color:${C.line};">You are getting this because you sent a request through our website.<br>
      &copy; ${new Date().getFullYear()} PeachWeb</span>`,
  })
}

// ---- The notification PeachWeb receives ----
export function buildNotifyEmail({ id, name, email, phone, organization, orgType, budget, services, description }) {
  const subline = [organization, orgType].filter(has).map(esc).join(' &middot; ')
  const telHref = has(phone) ? String(phone).replace(/[^\d+]/g, '') : ''

  const contact = [
    ['Email', has(email) ? `<a href="mailto:${esc(String(email).trim())}" style="color:${C.burnt};">${esc(String(email).trim())}</a>` : `<span style="font-weight:400;color:${C.muted};">Not given</span>`],
    ['Phone', has(phone) ? (telHref ? `<a href="tel:${esc(telHref)}" style="color:${C.burnt};">${esc(phone)}</a>` : esc(phone)) : `<span style="font-weight:400;color:${C.muted};">Not given</span>`],
    ...(has(organization) ? [['Business name', esc(organization)]] : []),
    ...(has(orgType) ? [['Business type', esc(orgType)]] : []),
    ...(has(joinList(services)) ? [['Services', esc(joinList(services))]] : []),
  ]

  const budgetCard = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;background-color:${C.chip};border-radius:12px;">
      <tr><td style="padding:18px 24px;">
        <p style="margin:0 0 4px;font-family:${FONT};font-size:13px;line-height:1.4;color:${C.muted};">Budget</p>
        <p style="margin:0;font-family:${FONT};font-size:26px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${has(budget) ? C.ink : C.muted};${WRAP}">${has(budget) ? esc(budget) : 'Not given'}</p>
      </td></tr>
    </table>`

  const reply = has(email) && String(email).includes('@')
    ? `<div style="margin-top:28px;">${button(`mailto:${esc(String(email).trim())}?subject=${encodeURIComponent('Re: your PeachWeb request')}`, `Reply to ${esc(String(name || '').trim().split(/\s+/)[0] || 'them')}`)}</div>`
    : ''

  return shell({
    title: `New website request from ${name}`,
    preheader: `${String(name || '')} · ${has(budget) ? budget : 'no budget given'}`,
    hero: `<p style="margin:0 0 8px;font-family:${FONT};font-size:15px;line-height:1.4;color:${C.onPeach};">New website request</p>
      <h1 class="h1" style="margin:0;font-family:${FONT};font-size:32px;line-height:1.15;font-weight:700;letter-spacing:-0.03em;color:${C.ink};${WRAP}">${esc(name)}</h1>
      ${subline ? `<p style="margin:10px 0 0;font-family:${FONT};font-size:16px;line-height:1.5;color:${C.onPeach};${WRAP}">${subline}</p>` : ''}`,
    body: `${budgetCard}
      ${detailsTable(contact)}
      <p style="margin:32px 0 10px;font-family:${FONT};font-size:17px;font-weight:700;letter-spacing:-0.01em;color:${C.ink};">Message</p>
      <div style="padding:16px 20px;background-color:${C.cream};border-left:4px solid ${C.burnt};border-radius:4px;font-family:${FONT};font-size:15px;line-height:1.65;color:${C.ink};${WRAP}">${multiline(clip(description, 6000))}</div>
      ${reply}`,
    footer: `<span style="color:${C.line};">Sent by the PeachWeb website form.<br>Request ID: ${esc(id)}</span>`,
  })
}
