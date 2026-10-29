import { useState, useEffect } from 'react'
import { PeachLogoFull } from './PeachLogo'

const links = [
  { label: 'Why PeachWeb', href: '#why' },
  { label: 'What we build', href: '#build' },
  { label: 'How it works', href: '#process' },
  { label: 'Founders', href: '#founders' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ onRequest }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the link for whichever section is crossing the upper third of the viewport.
  useEffect(() => {
    const sections = links.map(l => document.querySelector(l.href)).filter(Boolean)
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id) }),
      { rootMargin: '-30% 0px -65% 0px' }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = e => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 border-b ${
        scrolled || menuOpen ? 'bg-ivory/95 backdrop-blur-sm border-line' : 'bg-ivory/0 border-transparent'
      }`}
    >
      <nav aria-label="Main" className="page h-[72px] flex items-center justify-between gap-6">
        <a href="#" aria-label="PeachWeb, back to top" className="rounded-md">
          <PeachLogoFull iconSize={32} />
        </a>

        <ul className="hidden lg:flex items-center gap-5 xl:gap-7">
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? 'true' : undefined}
                className={`relative py-2 text-[0.92rem] font-medium whitespace-nowrap transition-colors hover:text-charcoal
                  after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-terracotta
                  after:origin-left after:transition-transform after:duration-200
                  ${active === link.href ? 'text-charcoal after:scale-x-100' : 'text-stone after:scale-x-0 hover:after:scale-x-100'}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <button onClick={onRequest} className="btn-primary py-2.5">
            Request a website
          </button>
        </div>

        <button
          className="lg:hidden -mr-2 p-2 rounded-lg text-charcoal hover:bg-charcoal/5 transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-line bg-ivory">
          <ul className="page py-3">
            {links.map(link => (
              <li key={link.href} className="border-b border-line last:border-0">
                <a
                  href={link.href}
                  className="block py-3.5 font-display text-xl text-charcoal"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="page pb-6">
            <button
              onClick={() => { setMenuOpen(false); onRequest(); }}
              className="btn-primary w-full"
            >
              Request a website
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
