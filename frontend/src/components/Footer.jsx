import { PeachLogoFull } from './PeachLogo'

const navLinks = [
  { label: 'Why PeachWeb', href: '#why' },
  { label: 'What We Build', href: '#build' },
  { label: 'How It Works', href: '#process' },
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
    <footer style={{ backgroundColor: '#111111', borderTop: '3px solid #FF8C61' }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Logo */}
          <a href="#">
            <PeachLogoFull iconSize={30} textColor="#FF8C61" />
          </a>

          {/* Nav Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm transition-colors hover:text-white"
                style={{ color: '#9CA3AF' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map(sm => (
              <a
                key={sm.label}
                href={sm.href}
                target="_blank"
                rel="noopener"
                aria-label={`PeachWeb on ${sm.label}`}
                title={`PeachWeb on ${sm.label}`}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: '#1f1f1f', color: '#FF8C61', border: '1px solid #2a2a2a' }}
              >
                {sm.icon}
              </a>
            ))}
          </div>

          {/* Email */}
          <a
            href="mailto:peachwebdevelopment@gmail.com"
            className="text-sm font-medium transition-opacity hover:opacity-80 break-all text-center md:text-right"
            style={{ color: '#FF8C61' }}
          >
            📧 peachwebdevelopment@gmail.com
          </a>
        </div>

        {/* Divider */}
        <div className="border-t mb-6" style={{ borderColor: '#2a2a2a' }}></div>

        {/* Bottom Row */}
        <p className="text-center text-sm" style={{ color: '#6B7280' }}>
          © 2024 PeachWeb. Websites & AI Chatbots for Local Businesses.
        </p>
      </div>
    </footer>
  )
}
