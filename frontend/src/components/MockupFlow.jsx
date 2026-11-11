import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Bot, Check, HeartHandshake, Plus, Sparkles, Store, Utensils, Wrench } from 'lucide-react'
import { EMAIL, estimator } from '../content/site'
import { submitInquiry, isEmail } from '../lib/inquiry'

// The "free mockup" request as a one-question-at-a-time flow (4 steps, then a confirmation).
// It replaced the old single stacked form and keeps its fields and validation messages. The
// payload sent through submitInquiry() is the old one plus `budget` (the budget step is optional).
// The flow reacts to the answers as they come in: the second question is worded for the business
// type, finished steps can be revisited from the progress bar, and the last step recaps the
// answers as chips that jump back to the question. Used in the
// #contact section and inside the modal that the other "Get a free mockup" buttons open.
//
//   props.onDone     called by the button on the confirmation screen (the modal passes its close)
//   props.doneLabel  that button's label; with no onDone the button starts a fresh request
//   props.focusOnMount  move focus into the flow when it first appears (the modal does; the
//                       inline copy must not, or loading the page would scroll down to it)

// The values the old <select> offered, unchanged, so `orgType` reaches the backend as before.
const TYPES = [
  { value: 'Restaurant or café', Icon: Utensils },
  { value: 'Shop or retail', Icon: Store },
  { value: 'Service provider', Icon: Wrench },
  { value: 'Nonprofit or community group', Icon: HeartHandshake },
  { value: 'Something else', Icon: Sparkles },
]
const STEPS = ['Business', 'Details', 'Budget', 'Contact']
const STEP_COUNT = STEPS.length

// The budget ranges are the estimator's brackets, so the two can never disagree. The step is a
// slider over them, plus "Not sure yet" for people who would rather talk it through.
const BRACKETS = estimator.brackets
const NOT_SURE = 'Not sure yet'
const BUDGET_MIN = BRACKETS[0].split('–')[0]
const BUDGET_MAX = BRACKETS[BRACKETS.length - 1].split('–')[1]

// The second question is worded for the business type picked on the first.
const DEFAULT_EXAMPLE = "We're a family bakery in Roswell. We want people to see our menu and order cakes ahead."
const TYPE_COPY = {
  'Restaurant or café': { noun: 'restaurant or café', example: "We're a family-run café in Roswell. We want people to see our menu and order catering ahead." },
  'Shop or retail': { noun: 'shop', example: "We run a small boutique in Alpharetta. We want customers to see what's in stock and when we're open." },
  'Service provider': { noun: 'business', example: "We're a plumbing company serving north Atlanta. We want more people to call or book a visit online." },
  'Nonprofit or community group': { noun: 'organization', example: "We run a youth robotics club. We want families to find us and volunteers to sign up." },
}
const ADVANCE_MS = 260 // how long a tapped card shows as selected before the next step slides in

const EMPTY = { name: '', email: '', phone: '', organization: '', orgType: '', website: '', description: '', chatbot: false, budget: '' }

const label = 'mb-2 block text-sm font-semibold'
const Optional = () => <span className="font-normal text-muted">(optional)</span>
const Required = () => <span className="text-burnt" aria-hidden="true">*</span>

export default function MockupFlow({ onDone, doneLabel = 'Close', focusOnMount = false }) {
  const uid = useId()
  const id = n => `${uid}-${n}`
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState('fwd')
  const [form, setForm] = useState(EMPTY)
  const [invalid, setInvalid] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  // On phones the two optional fields on step 2 start folded away, to keep that step short.
  const [more, setMore] = useState(false)
  // The furthest step reached, so the progress bar can take people back (and forward again) to it.
  const [maxStep, setMaxStep] = useState(0)

  const headingRef = useRef(null)
  const descRef = useRef(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const orgRef = useRef(null)
  const advanceTimer = useRef(0)
  const firstRun = useRef(true)

  useEffect(() => () => clearTimeout(advanceTimer.current), [])
  useEffect(() => { setMaxStep(m => Math.max(m, step)) }, [step])

  // Each time a step appears, put the cursor where the reader needs it: the first text field on
  // the text steps, the question itself on step 1. (Not on first load unless asked: see above.)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      if (!focusOnMount) return
    }
    const target = step === 1 ? descRef.current : step === 3 ? nameRef.current : headingRef.current
    target?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => { if (more) orgRef.current?.focus() }, [more])

  // The confirmation replaces the form, so move focus to it for screen-reader users.
  useEffect(() => { if (sent) headingRef.current?.focus() }, [sent])

  const go = delta => {
    setDir(delta > 0 ? 'fwd' : 'back')
    setStep(s => s + delta)
    setInvalid('')
    setError('')
  }

  // From the progress bar and the recap chips.
  const jumpTo = i => {
    if (i === step) return
    clearTimeout(advanceTimer.current); advanceTimer.current = 0
    setDir(i > step ? 'fwd' : 'back')
    setStep(i)
    setInvalid('')
    setError('')
  }

  const setBudget = value => { setForm(f => ({ ...f, budget: value })); setError('') }

  const fail = (field, message, ref) => {
    setError(message)
    setInvalid(field)
    ref?.current?.focus()
  }

  const onChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setInvalid(''); setError('')
  }

  // Step 1: a tap selects the card, then the next step slides in a moment later.
  const pick = value => {
    if (advanceTimer.current) return // ignore a second tap while advancing
    setForm(f => ({ ...f, orgType: value }))
    advanceTimer.current = setTimeout(() => { advanceTimer.current = 0; go(1) }, ADVANCE_MS)
  }
  const skip = () => {
    clearTimeout(advanceTimer.current); advanceTimer.current = 0
    setForm(f => ({ ...f, orgType: '' }))
    go(1)
  }

  const submit = async () => {
    // Same checks, same order and same messages as the old form.
    if (!form.name.trim()) return fail('name', 'Please add your name.', nameRef)
    if (!isEmail(form.email)) return fail('email', 'Please add an email so we can send the mockup.', emailRef)
    if (!form.description.trim()) { setDir('back'); setStep(1); return fail('description', 'Please tell us a little about your business.', descRef) }
    setSending(true)
    try {
      await submitInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        organization: form.organization.trim(),
        orgType: form.orgType,
        budget: form.budget,
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

  // Enter in a single-line field lands here (the Next / Request button is the form's submit button).
  const onSubmit = e => {
    e.preventDefault()
    if (sending) return
    if (step === 1) {
      if (!form.description.trim()) return fail('description', 'Please tell us a little about your business.', descRef)
      go(1)
    } else if (step === 2) {
      go(1)
    } else if (step === 3) {
      submit()
    }
  }

  const restart = () => { setForm(EMPTY); setStep(0); setDir('fwd'); setSent(false); setError(''); setInvalid(''); setMore(false); setMaxStep(0) }

  if (sent) {
    const first = form.name.trim().split(/\s+/)[0]
    return (
      <div role="status" className="flow-fwd py-4 text-center sm:py-8">
        <span className="flow-pop mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-dark text-peach">
          <Check className="h-8 w-8" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <p ref={headingRef} tabIndex={-1} className="mb-3 font-display text-h3 outline-none">
          You're all set{first ? `, ${first}` : ''}!
        </p>
        <p className="mx-auto mb-3 max-w-prose text-lg">
          We'll design a first look at your homepage and reply within 1–2 business days with your custom mockup.
        </p>
        <p className="mx-auto mb-8 max-w-prose text-muted">
          A confirmation is on its way to {form.email}. If anything comes up, write to{' '}
          <a href={`mailto:${EMAIL}`} className="link text-dark [overflow-wrap:anywhere]">{EMAIL}</a>.
        </p>
        {(form.orgType || form.budget || form.chatbot) && (
          <dl className="mx-auto mb-8 max-w-sm divide-y divide-dark/15 rounded border border-dark/15 bg-white/60 text-left text-sm">
            {form.orgType && <div className="flex justify-between gap-4 px-4 py-2.5"><dt className="text-muted">Business</dt><dd className="text-right font-semibold">{form.orgType}</dd></div>}
            <div className="flex justify-between gap-4 px-4 py-2.5"><dt className="text-muted">Services</dt><dd className="text-right font-semibold">{form.chatbot ? 'Website + AI chatbot' : 'Website'}</dd></div>
            {form.budget && <div className="flex justify-between gap-4 px-4 py-2.5"><dt className="text-muted">Budget</dt><dd className="text-right font-semibold">{form.budget}</dd></div>}
          </dl>
        )}
        <button type="button" onClick={onDone || restart} className="btn-primary">
          {onDone ? doneLabel : 'Send another request'}
        </button>
      </div>
    )
  }

  // Folded on phones until asked for (or while they hold something), always shown from the sm breakpoint.
  const showMore = more || !!(form.organization || form.website)

  const copy = TYPE_COPY[form.orgType]
  const bracketIndex = BRACKETS.indexOf(form.budget)
  const chosen = bracketIndex >= 0
  const notSure = form.budget === NOT_SURE
  const chips = [
    form.orgType && { label: form.orgType, to: 0 },
    form.chatbot && { label: 'AI chatbot', to: 1 },
    form.budget && { label: notSure ? 'Budget: not sure yet' : `Budget ${form.budget}`, to: 2 },
  ].filter(Boolean)

  const backButton = (
    <button type="button" onClick={() => go(-1)} className="-ml-2 mb-3 inline-flex min-h-11 items-center gap-1.5 rounded px-2 text-sm font-semibold text-muted hover:text-dark">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
    </button>
  )

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Progress: a plain-words counter plus one segment per step. Steps already reached can be
          revisited from their segment. */}
      <nav aria-label="Request steps" className="mb-6">
        <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
          <span className="font-semibold">Step {step + 1} of {STEP_COUNT} <span className="font-normal text-muted">· {STEPS[step]}</span></span>
          <span className="text-muted">Takes under 30 seconds</span>
        </div>
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((name, i) => {
            const current = i === step
            const reachable = !current && i <= maxStep
            const tone = current ? 'bg-dark' : i < step ? 'bg-dark/70' : reachable ? 'bg-dark/35' : 'bg-chip'
            return (
              <li key={name}>
                {reachable ? (
                  <button type="button" onClick={() => jumpTo(i)} aria-label={`Go to step ${i + 1}: ${name}`} className="group -my-2.5 block w-full py-2.5">
                    <span className={`block h-1.5 rounded-full transition-colors group-hover:bg-dark ${tone}`} />
                  </button>
                ) : (
                  <span aria-current={current ? 'step' : undefined} className="-my-2.5 block py-2.5">
                    <span className={`block h-1.5 rounded-full transition-colors duration-300 ${tone}`} />
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* The step area keeps a steady height so the card does not jump as steps change: the min-heights
          are the tallest step (the contact step with its recap chips, both on phones and from sm up),
          measured at 360px and 1440px, so re-measure them if the steps' content changes. The small
          side padding leaves room for focus rings, which the sliding animation would otherwise clip. */}
      <div data-flow-area className="-mx-1 min-h-[43.5rem] overflow-x-clip px-1 sm:min-h-[39rem]">
        <div key={step} className={dir === 'fwd' ? 'flow-fwd' : 'flow-back'}>

          {step === 0 && (
            <>
              <h3 ref={headingRef} tabIndex={-1} className="mb-1 text-h3 outline-none">What kind of business do you run?</h3>
              <p className="mb-5 text-sm text-muted">Tap one to get started.</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {TYPES.map(({ value, Icon }) => {
                  const on = form.orgType === value
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => pick(value)}
                      className={`group relative flex min-h-[6.25rem] flex-col items-start justify-between gap-3 rounded border p-4 text-left transition duration-150 active:scale-[0.97] ${
                        on ? 'border-burnt bg-chip/60' : 'border-line bg-white hover:-translate-y-0.5 hover:border-dark'
                      }`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${on ? 'bg-dark text-peach' : 'bg-chip text-burnt group-hover:bg-dark group-hover:text-peach'}`}>
                        <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="font-semibold leading-snug">{value}</span>
                      {on && <Check className="absolute right-3 top-3 h-5 w-5 text-burnt" strokeWidth={2.25} aria-hidden="true" />}
                    </button>
                  )
                })}
                {/* Skip is the sixth card, so the grid stays even (3x2 on desktop, 2x3 on phones). */}
                <button
                  type="button"
                  onClick={skip}
                  className="group flex min-h-[6.25rem] flex-col items-start justify-between gap-3 rounded border border-dashed border-dark/40 p-4 text-left text-muted transition duration-150 hover:-translate-y-0.5 hover:border-dark hover:text-dark active:scale-[0.97]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-current">
                    <ArrowRight className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="font-semibold leading-snug">Skip for now</span>
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              {backButton}
              <h3 id={id('desc-h')} className="mb-1 text-h3">Tell us about your {copy?.noun ?? 'business'} <Required /></h3>
              <p id={id('desc-hint')} className="mb-3 text-sm text-muted">What do you do, and what should the site help with?</p>
              <textarea
                ref={descRef} id={id('description')} name="description" rows={4} required
                aria-labelledby={id('desc-h')} aria-describedby={id('desc-hint')} aria-invalid={invalid === 'description'}
                value={form.description} onChange={onChange} className="field resize-y"
                placeholder={copy?.example ?? DEFAULT_EXAMPLE}
              />
              {!showMore && (
                <button type="button" aria-expanded="false" onClick={() => setMore(true)} className="-ml-2 mt-3 inline-flex min-h-11 items-center gap-1.5 rounded px-2 text-left text-sm font-semibold text-muted hover:text-dark sm:hidden">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add your business name or current website
                </button>
              )}
              <div className={`mt-5 gap-5 sm:grid-cols-2 ${showMore ? 'grid' : 'hidden sm:grid'}`}>
                <div>
                  <label htmlFor={id('org')} className={label}>Business name <Optional /></label>
                  <input ref={orgRef} id={id('org')} name="organization" autoComplete="organization" value={form.organization} onChange={onChange} className="field" />
                </div>
                <div>
                  <label htmlFor={id('site')} className={label}>Current website <Optional /></label>
                  <input id={id('site')} name="website" type="url" inputMode="url" placeholder="yourbusiness.com" value={form.website} onChange={onChange} className="field" />
                </div>
              </div>

              {/* The chatbot add-on, as a switch card rather than a plain checkbox. */}
              <button
                type="button" role="switch" aria-checked={form.chatbot}
                aria-labelledby={id('bot-t')} aria-describedby={id('bot-d')}
                onClick={() => setForm(f => ({ ...f, chatbot: !f.chatbot }))}
                className={`mt-5 flex w-full items-center gap-4 rounded border p-4 text-left transition-colors active:scale-[0.99] ${form.chatbot ? 'border-burnt bg-chip/60' : 'border-line bg-white hover:border-dark'}`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${form.chatbot ? 'bg-dark text-peach' : 'bg-chip text-burnt'}`}>
                  <Bot className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span id={id('bot-t')} className="block font-semibold">I'm interested in an AI chatbot too</span>
                  <span id={id('bot-d')} className="block text-sm text-muted">Answers common questions on your site, any hour.</span>
                </span>
                <span aria-hidden="true" className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${form.chatbot ? 'bg-dark' : 'bg-line'}`}>
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${form.chatbot ? 'translate-x-5' : ''}`} />
                </span>
              </button>

              <div aria-live="assertive" className="mt-5">
                {error && <p role="alert" className="rounded border border-burnt bg-chip/50 px-4 py-2 text-sm">{error}</p>}
              </div>
              <button type="submit" className="btn-primary mt-5 w-full">
                Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {backButton}
              <h3 ref={headingRef} tabIndex={-1} className="mb-1 text-h3 outline-none">What budget feels right?</h3>
              <p id={id('budget-hint')} className="mb-5 text-sm text-muted">Drag to pick a range. It only helps us suggest the right plan, and we'll confirm a real quote on a short call.</p>

              <div className="rounded border border-line bg-white p-5">
                <p aria-live="polite" className="mb-3 min-h-[3.5rem]">
                  {notSure ? (
                    <><span className="block font-display text-h3">Not sure yet</span><span className="block text-sm text-muted">That's fine. We'll suggest a range on the call.</span></>
                  ) : chosen ? (
                    <><span className="block font-display text-h3">{form.budget}</span><span className="block text-sm text-muted">A rough range, not a quote.</span></>
                  ) : (
                    <span className="block pt-1 text-muted">Drag the handle to choose a range.</span>
                  )}
                </p>
                <input
                  type="range" min={0} max={BRACKETS.length - 1} step={1}
                  value={chosen ? bracketIndex : 0}
                  aria-label="Budget range" aria-describedby={id('budget-hint')}
                  aria-valuetext={chosen ? form.budget : 'No range chosen yet'}
                  data-unset={chosen ? undefined : 'true'}
                  onChange={e => setBudget(BRACKETS[Number(e.target.value)])}
                  // The handle starts on the first stop, where a click or an arrow key changes nothing,
                  // so those two choose it explicitly.
                  onClick={e => { if (!chosen) setBudget(BRACKETS[Number(e.currentTarget.value)]) }}
                  onKeyDown={e => { if (!chosen && ['ArrowLeft', 'ArrowDown', 'Home'].includes(e.key)) setBudget(BRACKETS[0]) }}
                  className={`range-flow ${notSure ? 'opacity-40' : ''}`}
                  style={{ '--p': `calc(0.875rem + (100% - 1.75rem) * ${chosen ? bracketIndex / (BRACKETS.length - 1) : 0})` }}
                />
                <div aria-hidden="true" className="flex justify-between px-[0.6875rem]">
                  {BRACKETS.map((b, i) => <span key={b} className={`h-1.5 w-1.5 rounded-full transition-colors ${chosen && i <= bracketIndex ? 'bg-dark' : 'bg-dark/25'}`} />)}
                </div>
                <div aria-hidden="true" className="mt-2 flex justify-between text-sm text-muted"><span>{BUDGET_MIN}</span><span>{BUDGET_MAX}</span></div>
              </div>

              <button
                type="button" aria-pressed={notSure} onClick={() => setBudget(notSure ? '' : NOT_SURE)}
                className={`mt-4 flex min-h-12 w-full items-center gap-3 rounded border px-4 text-left font-semibold transition-colors active:scale-[0.99] ${notSure ? 'border-burnt bg-chip/60' : 'border-line bg-white hover:border-dark'}`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${notSure ? 'border-dark bg-dark text-peach' : 'border-dark/40'}`}>
                  {notSure && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
                </span>
                I'm not sure yet
              </button>

              <button type="submit" className="btn-primary mt-5 w-full">
                {form.budget ? 'Next' : 'Skip for now'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}

          {step === 3 && (
            <>
              {backButton}
              <h3 className="mb-1 text-h3">Where should we send your free mockup?</h3>
              <p className="mb-5 text-sm text-muted">We'll design a first look at your homepage and reply within 1–2 business days.</p>
              {chips.length > 0 && (
                <div className="mb-4">
                  <ul aria-label="Your request so far. Choose one to change it." className="flex flex-wrap gap-2">
                    {chips.map(c => (
                      <li key={c.label}>
                        <button type="button" onClick={() => jumpTo(c.to)} title="Change this answer" className="inline-flex min-h-9 items-center rounded-full border border-dark/30 bg-chip/60 px-3 text-sm font-semibold transition hover:border-dark hover:bg-chip active:scale-[0.97]">
                          {c.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="space-y-5">
                <div>
                  <label htmlFor={id('name')} className={label}>Name <Required /></label>
                  <input ref={nameRef} id={id('name')} name="name" autoComplete="name" required aria-invalid={invalid === 'name'} value={form.name} onChange={onChange} className="field" />
                </div>
                <div>
                  <label htmlFor={id('email')} className={label}>Email <Required /></label>
                  <div className="relative">
                    <input ref={emailRef} id={id('email')} name="email" type="email" autoComplete="email" required aria-invalid={invalid === 'email'} value={form.email} onChange={onChange} className="field pr-11" />
                    {isEmail(form.email) && <Check aria-hidden="true" className="flow-pop pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-burnt" strokeWidth={2.5} />}
                  </div>
                </div>
                <div>
                  <label htmlFor={id('phone')} className={label}>Phone <Optional /></label>
                  <input id={id('phone')} name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={onChange} className="field" />
                </div>
              </div>
              <div aria-live="assertive" className="mt-5">
                {error && <p role="alert" className="rounded border border-burnt bg-chip/50 px-4 py-2 text-sm">{error}</p>}
              </div>
              <button type="submit" disabled={sending} className="btn-primary mt-5 w-full">{sending ? 'Sending…' : 'Request my free mockup'}</button>
              <p className="mt-3 text-center text-sm text-muted">By submitting, you agree to our <a href="/privacy" target="_blank" rel="noopener" className="link text-dark">Privacy Policy<span className="sr-only"> (opens in a new tab)</span></a>.</p>
            </>
          )}

        </div>
      </div>
    </form>
  )
}
