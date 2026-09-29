import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { PeachLogoFull } from './PeachLogo'
import { navRoutes } from '../routes'

export default function Navbar({ onRequest }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = navRoutes

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300"
      style={{
        borderColor: scrolled ? '#FFE4D6' : 'transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.07)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <PeachLogoFull iconSize={34} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className="text-sm font-medium transition-colors"
              style={({ isActive }) => ({
                color: isActive ? '#E8571A' : '#4B5563',
                fontWeight: isActive ? 700 : 500,
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={onRequest}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: '#FF8C61' }}
          >
            Request a Website
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {links.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className="text-sm font-medium transition-colors"
              style={({ isActive }) => ({
                color: isActive ? '#E8571A' : '#374151',
                fontWeight: isActive ? 700 : 500,
              })}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onRequest(); }}
            className="mt-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#FF8C61' }}
          >
            Request a Website
          </button>
        </div>
      )}
    </nav>
  )
}
