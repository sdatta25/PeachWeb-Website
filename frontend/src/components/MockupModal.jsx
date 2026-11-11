import { useEffect, useRef } from 'react'
import MockupFlow from './MockupFlow'

// The dialog that the "Get a free mockup" buttons (nav, hero, /#mockup links) open. It only
// provides the dialog behaviour; the request itself is the shared step-by-step MockupFlow, which
// is also shown inline in the #contact section.
export default function MockupModal({ onClose }) {
  const dialogRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  // Escape closes, Tab stays inside, the page behind stops scrolling, and focus
  // returns to whatever opened the dialog.
  useEffect(() => {
    const opener = document.activeElement
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => {
      if (e.key === 'Escape') onCloseRef.current()
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll('button:not([disabled]), input, select, textarea, a[href]')
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; opener?.focus?.() }
  }, [])

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
        <div className="px-6 py-8 sm:px-8">
          <MockupFlow onDone={onClose} doneLabel="Close" focusOnMount />
        </div>
      </div>
    </div>
  )
}
