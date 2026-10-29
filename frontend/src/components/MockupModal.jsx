import { useEffect, useRef, useState } from 'react'
import { EMAIL } from '../content/site'
import { submitInquiry, isEmail } from '../lib/inquiry'

const orgTypes = ['Restaurant or café', 'Shop or retail', 'Service provider', 'Nonprofit or community group', 'Something else']

export default function MockupModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', orgType: '', website: '', description: '', chatbot: false })
  const [invalid, setInvalid] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const dialogRef = useRef(null)
  const firstRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // Escape closes, Tab stays inside, the page behind stops scrolling, and focus
  // returns to whatever opened the dialog.
  useEffect(() => {
    const opener = document.activeElement
    firstRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => {
      if (e.key === 'Escape') onCloseRef.current()
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll('button, input, select, textarea, a[href]')
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; opener?.focus?.() }
  }, [])

  useEffect(() => { if (invalid) document.getElementById(`mk-${invalid}`)?.focus() }, [invalid])

  const onChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    setInvalid(''); setError('')
  }

  const submit = async e => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Please add your name.'); setInvalid('name'); return }
    if (!isEmail(form.email)) { setError('Please add an email so we can send the mockup.'); setInvalid('email'); return }
    if (!form.description.trim()) { setError('Please tell us a little about your business.'); setInvalid('description'); return }
    setSending(true)
    try {
      await submitInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        organization: form.organization.trim(),
        orgType: form.orgType,
        services: form.chatbot ? ['Website', 'AI Chatbot'] : ['Website'],
        description: [
          'Free mockup request.',
          form.website.trim() && `Current website: ${form.website.trim()}`,
          form.description.trim(),
        ].filter(Boolean).join('\n\n'),
      })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const label = 'mb-2 block text-sm font-semibold'
  const opt = <span className="font-normal text-muted">(optional)</span>

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-dark/60 sm:items-center sm:p-4" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="mk-title" className="max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-page sm:rounded-xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-page px-6 py-4 sm:px-8">
          <div>
            <h2 id="mk-title" className="text-h3">Get a free mockup</h2>
            <p className="mt-1 text-sm text-muted">We'll design a first look at your homepage and reply within 1–2 business days.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded text-muted hover:text-dark">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {sent ? (
          <div role="status" className="px-6 py-12 sm:px-8">
            <p className="mb-4 font-display text-h3">Request sent. Thank you!</p>
            <p className="mb-8 max-w-prose text-muted">
              We'll read it and reply within 1–2 business days. A confirmation is on its way to {form.email}. If
              anything comes up, write to <a href={`mailto:${EMAIL}`} className="link text-dark">{EMAIL}</a>.
            </p>
            <button onClick={onClose} className="btn-primary">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-6 px-6 py-8 sm:px-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="mk-name" className={label}>Name <span className="text-burnt" aria-hidden="true">*</span></label>
                <input ref={firstRef} id="mk-name" name="name" autoComplete="name" required aria-invalid={invalid === 'name'} value={form.name} onChange={onChange} className="field" />
              </div>
              <div>
                <label htmlFor="mk-email" className={label}>Email <span className="text-burnt" aria-hidden="true">*</span></label>
                <input id="mk-email" name="email" type="email" autoComplete="email" required aria-invalid={invalid === 'email'} value={form.email} onChange={onChange} className="field" />
              </div>
              <div>
                <label htmlFor="mk-org" className={label}>Business name {opt}</label>
                <input id="mk-org" name="organization" autoComplete="organization" value={form.organization} onChange={onChange} className="field" />
              </div>
              <div>
                <label htmlFor="mk-phone" className={label}>Phone {opt}</label>
                <input id="mk-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={onChange} className="field" />
              </div>
              <div>
                <label htmlFor="mk-type" className={label}>Type of business {opt}</label>
                <select id="mk-type" name="orgType" value={form.orgType} onChange={onChange} className="field">
                  <option value="">Select one</option>
                  {orgTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="mk-site" className={label}>Current website {opt}</label>
                <input id="mk-site" name="website" type="url" inputMode="url" placeholder="yourbusiness.com" value={form.website} onChange={onChange} className="field" />
              </div>
            </div>
            <div>
              <label htmlFor="mk-description" className={label}>
                Tell us about your business <span className="text-burnt" aria-hidden="true">*</span>
              </label>
              <p id="mk-desc-hint" className="mb-2 text-sm text-muted">What do you do, and what should the site help with?</p>
              <textarea id="mk-description" name="description" rows={4} required aria-invalid={invalid === 'description'} aria-describedby="mk-desc-hint" value={form.description} onChange={onChange} className="field resize-y" placeholder="We're a family bakery in Roswell. We want people to see our menu and order cakes ahead." />
            </div>
            <label className="flex min-h-11 cursor-pointer items-center gap-4">
              <input type="checkbox" name="chatbot" checked={form.chatbot} onChange={onChange} className="h-4 w-4 accent-[#C1440E]" />
              I'm interested in an AI chatbot too
            </label>
            <div aria-live="assertive">
              {error && <p role="alert" className="rounded border border-burnt bg-chip/50 px-4 py-2 text-sm">{error}</p>}
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full">{sending ? 'Sending…' : 'Request my free mockup'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
