import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/useReveal'

// A scripted conversation for a made-up bakery. It plays once when scrolled into view.
const BUSINESS = 'Fern & Flour Bakery'
const script = [
  { from: 'user', text: 'Are you open on Sunday?' },
  { from: 'bot', text: 'Yes, Sundays we’re open 8 am to 2 pm.' },
  { from: 'user', text: 'Can I get a birthday cake for Saturday?' },
  { from: 'bot', text: 'Custom cakes need 48 hours’ notice, so Saturday works if you order by Thursday. Want me to pass your details to the team so they can confirm flavors?' },
  { from: 'user', text: 'Yes please. Maya, 404-555-0142' },
  { from: 'bot', text: 'Got it, Maya. Someone from the bakery will call you today to confirm your order.' },
]

export default function ChatDemo() {
  const reduce = usePrefersReducedMotion()
  const [shown, setShown] = useState(reduce ? script.length : 0)
  const [started, setStarted] = useState(reduce)
  const ref = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (started || !ref.current) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect() } }, { threshold: 0.4 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [started])

  useEffect(() => {
    if (!started || shown >= script.length) return
    const next = script[shown]
    const t = setTimeout(() => setShown(s => s + 1), next.from === 'bot' ? 1300 : 800)
    return () => clearTimeout(t)
  }, [started, shown])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [shown])

  const typing = started && shown < script.length && script[shown].from === 'bot'

  return (
    <div ref={ref} className="frame mx-auto w-full max-w-md">
      <div className="flex items-center justify-between gap-4 border-b border-line bg-cream px-4 py-2">
        <div>
          <p className="text-sm font-semibold">{BUSINESS}</p>
          <p className="text-xs text-muted">Website assistant</p>
        </div>
        <span className="rounded bg-dark px-2 py-1 text-xs font-semibold text-cream">Demo</span>
      </div>

      <ol ref={listRef} className="flex h-[22rem] flex-col gap-2 overflow-y-auto bg-white p-4" aria-label="Sample chatbot conversation">
        {script.slice(0, shown).map((m, i) => (
          <li
            key={i}
            className={`msg-in max-w-[85%] rounded-xl px-4 py-2 text-sm ${
              m.from === 'user' ? 'self-end rounded-br bg-dark text-cream' : 'self-start rounded-bl bg-chip text-dark'
            }`}
          >
            <span className="sr-only">{m.from === 'user' ? 'Customer: ' : 'Assistant: '}</span>
            {m.text}
          </li>
        ))}
        {typing && (
          <li className="self-start rounded-xl rounded-bl bg-chip px-4 py-2 text-sm text-muted" aria-hidden="true">
            typing…
          </li>
        )}
      </ol>

      <div className="flex items-center justify-between gap-4 border-t border-line bg-cream px-4 py-2">
        <p className="text-xs text-muted">A scripted example for a made-up business. Not a live chat.</p>
        <button
          type="button"
          onClick={() => { setShown(reduce ? script.length : 0); setStarted(true) }}
          className="min-h-11 shrink-0 rounded px-2 text-sm font-semibold text-burnt hover:text-dark"
        >
          Replay
        </button>
      </div>
    </div>
  )
}
