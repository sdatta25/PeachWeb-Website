import { Link } from 'react-router-dom'
import HeroCanvas from './HeroCanvas'

export default function Hero({ onRequest }) {
  return (
    <section
      className="min-h-screen w-full pt-16 flex items-center relative overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #FFF8F4 0%, #ffffff 55%, #FFF5F0 100%)' }}
    >
      {/* Soft background blobs — kept fully inside viewport */}
      <div
        className="absolute top-20 left-0 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFCAB0, transparent)' }}
      />
      <div
        className="absolute bottom-20 right-0 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF8C61, transparent)' }}
      />

      <div className="w-full max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8 items-center">
        {/* ── Left: Text ── */}
        <div className="animate-fade-up">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8 border"
            style={{ backgroundColor: '#FFF5F0', color: '#E8571A', borderColor: '#FFE4D6' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: '#FF8C61', boxShadow: '0 0 6px #FF8C61' }}
            />
            <span className="hidden sm:inline">Websites & AI Chatbots for Local Business</span>
            <span className="sm:hidden">Websites & AI Chatbots</span>
          </div>

          {/* Headline */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-6 tracking-tight"
            style={{ color: '#1C1C1C' }}
          >
            We Build Websites.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FF8C61, #E8571A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              You Build
            </span>{' '}
            Your Business.
          </h1>

          {/* Subtext */}
          <p className="text-lg leading-relaxed mb-10 max-w-lg" style={{ color: '#6B7280' }}>
            PeachWeb creates custom websites and AI chatbots for local businesses and organizations —
            so you can grow your presence, serve customers better, and stand out online.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={onRequest}
              className="group px-8 py-4 rounded-full text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #FF8C61, #E8571A)',
                boxShadow: '0 4px 20px rgba(255, 140, 97, 0.4)',
              }}
            >
              Request a Website
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
            <Link to="/how-it-works"
              className="px-8 py-4 rounded-full text-base font-bold border-2 transition-all duration-200 hover:bg-orange-50 hover:-translate-y-0.5"
              style={{ borderColor: '#FF8C61', color: '#FF8C61' }}
            >
              See How It Works →
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex items-center gap-5">
            <div className="flex -space-x-2.5">
              {['🏪', '🍕', '💇', '🏋️'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-sm"
                  style={{ backgroundColor: '#FFE4D6' }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>Built for local businesses</p>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>restaurants, shops, nonprofits & more</p>
            </div>
          </div>
        </div>

        {/* ── Right: 3D Canvas ── */}
        <div
          className="hidden md:flex animate-fade-in"
          style={{ height: '520px', position: 'relative', width: '100%' }}
        >
          <HeroCanvas />

          {/* Floating label cards overlaid on the canvas */}
          <div
            className="absolute top-8 right-4 flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-xs font-semibold border backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#FFE4D6', color: '#1C1C1C' }}
          >
            <span style={{ color: '#FF8C61' }}>✦</span> AI Chatbot Ready
          </div>
          <div
            className="absolute bottom-16 left-4 flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-xs font-semibold border backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#FFE4D6', color: '#1C1C1C' }}
          >
            <span style={{ color: '#22c55e' }}>●</span> Mobile-First Design
          </div>
          <div
            className="absolute bottom-32 right-6 flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-xs font-semibold border backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#FFE4D6', color: '#1C1C1C' }}
          >
            🚀 Fast Launch
          </div>
        </div>
      </div>
    </section>
  )
}
