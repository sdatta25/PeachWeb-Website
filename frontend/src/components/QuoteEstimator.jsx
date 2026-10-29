import { useEffect, useRef, useState } from 'react'
import { estimator, EMAIL } from '../content/site'
import { submitInquiry, isEmail } from '../lib/inquiry'

const STEPS = ['Your business', 'Pages', 'Extras']

function Option({ type = 'radio', name, checked, onChange, label, hint }) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-4 rounded border px-4 py-2 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-burnt ${
        checked ? 'border-burnt bg-chip/60' : 'border-line bg-white hover:border-muted'
      }`}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="h-4 w-4 shrink-0 accent-[#C1440E]" />
      <span>
        <span className="block font-semibold">{label}</span>
        {hint && <span className="block text-sm text-muted">{hint}</span>}
      </span>
    </label>
  )
}

export default function QuoteEstimator() {
  const [step, setStep] = useState(0) // 0-2 questions, 3 result
  const [type, setType] = useState('')
  const [pages, setPages] = useState(null)
  const [extras, setExtras] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', notes: '' })
  const [error, setError] = useState('')
  const [invalid, setInvalid] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const headingRef = useRef(null)
  const firstField = useRef(null)
  const mounted = useRef(false)

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (mounted.current) headingRef.current?.focus()
    mounted.current = true
  }, [step, sent])
  useEffect(() => { if (showForm) firstField.current?.focus() }, [showForm])

  const score = (pages?.score ?? 0) + extras.reduce((n, id) => n + estimator.extras.find(e => e.id === id).score, 0)
  const bracket = estimator.brackets[Math.min(Math.floor(score), estimator.brackets.length - 1)]
  const extrasLabels = extras.map(id => estimator.extras.find(e => e.id === id).label)

  const canNext = (step === 0 && type) || (step === 1 && pages) || step === 2
  const toggleExtra = id => setExtras(x => (x.includes(id) ? x.filter(i => i !== id) : [...x, id]))
  const restart = () => { setStep(0); setType(''); setPages(null); setExtras([]); setShowForm(false); setSent(false); setError('') }

  const onChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); setInvalid('') }

  const submit = async e => {
    e.preventDefault()
    if (!form.name.trim()) { setInvalid('name'); setError('Please add your name.'); return }
    if (!isEmail(form.email)) { setInvalid('email'); setError('Please add an email we can reply to.'); return }
    setSending(true)
    try {
      await submitInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        organization: form.organization.trim(),
        orgType: type,
        budget: bracket,
        services: ['Website', ...(extras.includes('chatbot') ? ['AI Chatbot'] : [])],
        description: [
          `Quote estimator: ${type}, ${pages.label}, extras: ${extrasLabels.join(', ') || 'none'}. Estimated range: ${bracket}.`,
          form.notes.trim() && `Notes: ${form.notes.trim()}`,
        ].filter(Boolean).join('\n\n'),
      })
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h3 className="font-display text-h3">Website quote estimator</h3>
        {step < 3 && <p className="shrink-0 text-sm text-muted" aria-hidden="true">Step {step + 1} of 3</p>}
      </div>

      {step < 3 && (
        <div className="mb-8 grid grid-cols-3 gap-2" aria-hidden="true">
          {STEPS.map((s, i) => <span key={s} className={`h-1 rounded-full ${i <= step ? 'bg-burnt' : 'bg-line'}`} />)}
        </div>
      )}

      {step === 0 && (
        <fieldset>
          <legend ref={headingRef} tabIndex={-1} className="mb-4 text-lg font-semibold outline-none">
            <span className="sr-only">Step 1 of 3: </span>What kind of business is it?
          </legend>
          <div className="space-y-2">
            {estimator.types.map(t => (
              <Option key={t} name="qe-type" label={t} checked={type === t} onChange={() => setType(t)} />
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset>
          <legend ref={headingRef} tabIndex={-1} className="mb-4 text-lg font-semibold outline-none">
            <span className="sr-only">Step 2 of 3: </span>About how many pages?
          </legend>
          <div className="space-y-2">
            {estimator.pages.map(p => (
              <Option key={p.label} name="qe-pages" label={p.label} hint={p.hint} checked={pages?.label === p.label} onChange={() => setPages(p)} />
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend ref={headingRef} tabIndex={-1} className="mb-4 text-lg font-semibold outline-none">
            <span className="sr-only">Step 3 of 3: </span>Any extras? <span className="font-normal text-muted">Pick any, or none.</span>
          </legend>
          <div className="space-y-2">
            {estimator.extras.map(x => (
              <Option key={x.id} type="checkbox" name="qe-extras" label={x.label} hint={x.hint} checked={extras.includes(x.id)} onChange={() => toggleExtra(x.id)} />
            ))}
          </div>
        </fieldset>
      )}

      {step < 3 && (
        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(s => s - 1)} className="btn-line">Back</button>
          ) : <span />}
          <button type="button" disabled={!canNext} onClick={() => setStep(s => s + 1)} className="btn-primary">
            {step === 2 ? 'See my estimate' : 'Next'}
          </button>
        </div>
      )}

      {step === 3 && !sent && (
        <div>
          <p className="text-sm text-muted">Likely range</p>
          <p ref={headingRef} tabIndex={-1} className="mb-4 font-display text-h2 text-burnt outline-none" aria-live="polite">
            {bracket}
          </p>
          <p className="mb-2 text-muted">
            {type} · {pages.label} · {extrasLabels.length ? extrasLabels.join(', ') : 'no extras'}
          </p>
          <p className="mb-8 text-sm text-muted">
            A rough guide, not a quote. We'll give you a real number after a short call.
          </p>

          {!showForm ? (
            <div className="flex flex-col gap-4 sm:flex-row">
              <button type="button" onClick={() => setShowForm(true)} className="btn-primary">Send this to PeachWeb</button>
              <button type="button" onClick={restart} className="btn-line">Start over</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-4 border-t border-line pt-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="qe-name" className="mb-2 block text-sm font-semibold">Name <span className="text-burnt" aria-hidden="true">*</span></label>
                  <input ref={firstField} id="qe-name" name="name" autoComplete="name" required aria-invalid={invalid === 'name'} value={form.name} onChange={onChange} className="field" />
                </div>
                <div>
                  <label htmlFor="qe-email" className="mb-2 block text-sm font-semibold">Email <span className="text-burnt" aria-hidden="true">*</span></label>
                  <input id="qe-email" name="email" type="email" autoComplete="email" required aria-invalid={invalid === 'email'} value={form.email} onChange={onChange} className="field" />
                </div>
                <div>
                  <label htmlFor="qe-phone" className="mb-2 block text-sm font-semibold">Phone <span className="font-normal text-muted">(optional)</span></label>
                  <input id="qe-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={onChange} className="field" />
                </div>
                <div>
                  <label htmlFor="qe-org" className="mb-2 block text-sm font-semibold">Business name <span className="font-normal text-muted">(optional)</span></label>
                  <input id="qe-org" name="organization" autoComplete="organization" value={form.organization} onChange={onChange} className="field" />
                </div>
              </div>
              <div>
                <label htmlFor="qe-notes" className="mb-2 block text-sm font-semibold">Anything else? <span className="font-normal text-muted">(optional)</span></label>
                <textarea id="qe-notes" name="notes" rows={3} value={form.notes} onChange={onChange} className="field resize-y" />
              </div>
              <div aria-live="assertive">
                {error && <p role="alert" className="rounded border border-burnt bg-chip/50 px-4 py-2 text-sm">{error}</p>}
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full sm:w-auto">
                {sending ? 'Sending…' : 'Send my estimate'}
              </button>
            </form>
          )}
        </div>
      )}

      {sent && (
        <div role="status">
          <p ref={headingRef} tabIndex={-1} className="mb-4 font-display text-h3 outline-none">Thanks, {form.name.split(' ')[0]}. We've got it.</p>
          <p className="mb-8 text-muted">
            We'll reply within 1–2 business days to set up a call. A confirmation is on its way to {form.email}.
            Questions in the meantime? <a href={`mailto:${EMAIL}`} className="link text-dark">{EMAIL}</a>
          </p>
          <button type="button" onClick={restart} className="btn-line">Start a new estimate</button>
        </div>
      )}
    </div>
  )
}
