import { useState, useEffect, useRef } from 'react'
import { API_URL } from '../lib/api'


const orgTypes = [
  'Local Business',
  'Restaurant',
  'Retail Shop',
  'Service Provider',
  'Nonprofit',
  'Community Organization',
  'School',
  'Other',
]

const budgetOptions = [
  'Under $500',
  '$500–$1,500',
  '$1,500–$5,000',
  '$5,000+',
  'Not sure yet',
]

export default function RequestModal({ onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    orgType: '',
    services: [],
    budget: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // Escape closes, focus moves into the dialog, the page behind stops scrolling,
  // and focus goes back to whatever opened the dialog when it closes.
  useEffect(() => {
    const opener = document.activeElement
    firstFieldRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onCloseRef.current()
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll('button, input, select, textarea, a[href]')
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      opener?.focus?.()
    }
  }, [])

  // Take the visitor to the field that needs fixing; on a phone it may be scrolled out of view.
  useEffect(() => {
    if (fieldError) document.getElementById(fieldError === 'name' ? 'rq-name' : 'rq-desc')?.focus()
  }, [fieldError])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setFieldError('')
  }

  const handleServiceToggle = (service) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('Please enter your name.'); setFieldError('name'); return }
    if (!form.description.trim()) { setError('Please describe your project.'); setFieldError('description'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          organization: form.organization,
          orgType: form.orgType,
          description: form.description,
          budget: form.budget,
          services: form.services,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed.')
      setSubmittedData({ email: form.email })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const labelClass = 'block text-sm font-semibold text-charcoal mb-1.5'
  const hintClass = 'font-normal text-stone'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-charcoal/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-title"
        className="bg-ivory w-full max-w-2xl max-h-[94dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-ivory border-b border-line px-6 sm:px-8 py-5 flex items-start justify-between gap-4 z-10">
          <div>
            <h2 id="request-title" className="font-display font-medium text-2xl">Request a website</h2>
            <p className="text-sm text-stone mt-1">
              Fields marked <span aria-hidden="true" className="text-terracotta">*</span><span className="sr-only">with an asterisk</span> are required. Everything else helps us prepare for the call.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-stone hover:text-charcoal hover:bg-charcoal/5 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success State */}
        {submitted ? (
          <div className="px-6 sm:px-8 py-12" role="status">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-peach-soft text-terracotta">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display font-medium text-3xl mb-3">Request sent</h3>
            <p className="text-stone leading-relaxed mb-4 max-w-[34rem]">
              Thanks for contacting PeachWeb. We'll read through it and get back to you within 1–2 business days.
              {submittedData?.email && ' A confirmation is on its way to your inbox.'}
            </p>
            {!submittedData?.email && (
              <p className="text-sm px-4 py-3 rounded-lg mb-6 bg-peach-soft text-charcoal max-w-[34rem]">
                You didn't leave an email, so no confirmation was sent. If you'd like one, write to
                peachwebdevelopment@gmail.com and mention your request.
              </p>
            )}
            <button onClick={onClose} className="btn-primary mt-4">
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-7 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="rq-name" className={labelClass}>
                  Full name <span aria-hidden="true" className="text-terracotta">*</span>
                </label>
                <input
                  ref={firstFieldRef}
                  id="rq-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={fieldError === 'name'}
                  aria-describedby={fieldError === 'name' ? 'rq-error' : undefined}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="rq-org" className={labelClass}>Business or organization</label>
                <input
                  id="rq-org"
                  type="text"
                  name="organization"
                  autoComplete="organization"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="Your business name"
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="rq-email" className={labelClass}>Email</label>
                <input
                  id="rq-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  aria-describedby="rq-email-hint"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@yourbusiness.com"
                  className="field"
                />
                <p id="rq-email-hint" className="text-xs text-stone mt-1.5">We'll send your confirmation here.</p>
              </div>

              <div>
                <label htmlFor="rq-phone" className={labelClass}>Phone</label>
                <input
                  id="rq-phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="rq-type" className={labelClass}>Type of organization</label>
                <select
                  id="rq-type"
                  name="orgType"
                  value={form.orgType}
                  onChange={handleChange}
                  className="field"
                >
                  <option value="">Select one</option>
                  {orgTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="rq-budget" className={labelClass}>Budget</label>
                <select
                  id="rq-budget"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="field"
                >
                  <option value="">Select a range</option>
                  {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>What do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {['Website', 'AI Chatbot', 'Both'].map(s => (
                  <label
                    key={s}
                    className={`flex items-center gap-2 cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors
                      has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-terracotta
                      ${form.services.includes(s) ? 'border-terracotta bg-peach-soft text-charcoal' : 'border-line bg-white text-charcoal hover:border-stone'}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.services.includes(s)}
                      onChange={() => handleServiceToggle(s)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: '#A3431D' }}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="rq-desc" className={labelClass}>
                About the project <span aria-hidden="true" className="text-terracotta">*</span>{' '}
                <span className={hintClass}>What does your business do, and what should the site help with?</span>
              </label>
              <textarea
                id="rq-desc"
                name="description"
                aria-required="true"
                aria-invalid={fieldError === 'description'}
                aria-describedby={fieldError === 'description' ? 'rq-error' : undefined}
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="We're a family bakery in Roswell. We want people to see our menu and order cakes ahead."
                className="field resize-y"
              />
            </div>

            {/* Error */}
            <div aria-live="assertive">
              {error && (
                <p id="rq-error" role="alert" className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Sending request…
                </>
              ) : (
                'Send request'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
