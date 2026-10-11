import { PeachLogoFull } from './PeachLogo'

const navLinks = [
  { label: 'Why PeachWeb', href: '#why' },
  { label: 'What we build', href: '#build' },
  { label: 'How it works', href: '#process' },
  { label: 'Founders', href: '#founders' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
]

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/peachwebdev/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8h4.52v14H.24V8zm7.4 0h4.33v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.52v-6.62c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H7.64V8z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/peachweb.dev/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="on-dark bg-charcoal text-mist border-t border-ivory/10">
      <div className="page py-14">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <a href="#" aria-label="PeachWeb, back to top" className="inline-block rounded-md">
              <PeachLogoFull iconSize={30} textColor="#EFA77E" />
            </a>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              Websites and AI chatbots for local businesses and nonprofits in the Atlanta area.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-4">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-ivory transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3 space-y-4">
            <a
              href="mailto:peachwebdevelopment@gmail.com"
              className="block text-sm text-peach hover:text-peach-soft transition-colors break-all"
            >
              peachwebdevelopment@gmail.com
            </a>
            <div className="flex items-center gap-2">
              {socials.map(sm => (
                <a
                  key={sm.label}
                  href={sm.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={`PeachWeb on ${sm.label}`}
                  title={`PeachWeb on ${sm.label}`}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-ivory/15 text-peach hover:border-peach transition-colors"
                >
                  {sm.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-12 pt-6 border-t border-ivory/10 text-sm">
          © {new Date().getFullYear()} PeachWeb
        </p>
      </div>
    </footer>
  )
}
