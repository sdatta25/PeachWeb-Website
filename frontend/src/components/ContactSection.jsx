export default function ContactSection({ onRequest }) {
  return (
    <section
      id="contact"
      className="py-28 relative overflow-hidden"
      style={{ backgroundColor: '#111111' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF8C61, transparent)' }}
      />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        {/* Overline */}
        <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: '#FF8C61' }}>
          Get In Touch
        </p>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
          Ready to Get{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #FF8C61, #FFAB76)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Started?
          </span>
        </h2>

        <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: '#9CA3AF' }}>
          Whether you need a website, an AI chatbot, or both — we'd love to help your business grow.
          Let's build something great together.
        </p>

        {/* CTA Button */}
        <button
          onClick={onRequest}
          className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-bold text-white mb-10 transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #FF8C61, #E8571A)',
            boxShadow: '0 8px 32px rgba(255, 140, 97, 0.4)',
          }}
        >
          Request a Website
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8 max-w-xs mx-auto">
          <div className="flex-1 h-px" style={{ backgroundColor: '#2a2a2a' }} />
          <span className="text-xs" style={{ color: '#4B5563' }}>or reach us directly</span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#2a2a2a' }} />
        </div>

        {/* Email */}
        <a
          href="mailto:peachwebdevelopment@gmail.com"
          className="inline-flex items-center gap-2.5 text-sm font-medium transition-all duration-200 hover:opacity-80 mb-8"
          style={{ color: '#FF8C61' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          peachwebdevelopment@gmail.com
        </a>

        <p className="text-xs" style={{ color: '#4B5563' }}>
          We typically respond within 1–2 business days.
        </p>
      </div>
    </section>
  )
}
