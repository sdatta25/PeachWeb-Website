import { PeachLogoFull } from './PeachLogo'

const navLinks = [
  { label: 'Why PeachWeb', href: '#why' },
  { label: 'What We Build', href: '#build' },
  { label: 'How It Works', href: '#process' },
  { label: 'Contact', href: '#contact' },
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
