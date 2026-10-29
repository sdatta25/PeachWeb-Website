import { useEffect, useState } from 'react'
import { PeachLogoFull } from './PeachLogo'
import { nav } from '../content/site'

export default function Nav({ onMockup }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-page transition-colors duration-200 ${
        scrolled || open ? 'border-line' : 'border-transparent'
      }`}
    >
      <nav aria-label="Main" className="page flex h-[var(--nav-h)] items-center justify-between gap-4">
        <a href="#top" className="flex min-h-11 items-center rounded" aria-label="PeachWeb, back to top">
          <PeachLogoFull iconSize={30} />
        </a>

        <ul className="hidden items-center gap-2 md:flex">
          {nav.map(l => (
            <li key={l.href}>
              <a href={l.href} className="flex min-h-11 items-center rounded px-4 text-base text-muted transition-colors hover:text-dark">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button onClick={onMockup} className="btn-primary hidden min-h-11 px-4 sm:inline-flex">
            Get a free mockup
          </button>
          <button
            className="flex h-11 w-11 items-center justify-center rounded md:hidden"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line md:hidden">
          <ul className="page py-2">
            {nav.map(l => (
              <li key={l.href} className="border-b border-line last:border-0">
                <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center font-display text-h3">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="page pb-6">
            <button onClick={() => { setOpen(false); onMockup() }} className="btn-primary w-full">
              Get a free mockup
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
