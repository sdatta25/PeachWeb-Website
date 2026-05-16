const features = [
  {
    number: '01',
    title: 'Professional Quality',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    description: 'We build polished, modern websites that compete with big brands — designed specifically for your local audience.',
  },
  {
    number: '02',
    title: 'AI-Powered Chatbots',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    description: 'Smart AI assistants live on your site answering customer questions 24/7 — even when you\'re closed.',
  },
  {
    number: '03',
    title: 'Direct Collaboration',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    description: 'You work directly with our team from start to finish. No middlemen, no confusion — just clear communication.',
  },
  {
    number: '04',
    title: 'Built to Grow',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    description: 'Your site scales with your business. We build with growth in mind — from local presence to wider reach.',
  },
]

export default function WhySection() {
  return (
    <section id="why" className="py-28" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF8C61' }}>
            Why PeachWeb
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#1C1C1C' }}>
            Built for Local Businesses
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: '#9CA3AF' }}>
            Everything we do is designed around one goal — helping your local business thrive online.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.number}
              className="group relative bg-white rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
              style={{
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-6 right-6 h-0.5 rounded-full transition-all duration-300 group-hover:left-4 group-hover:right-4"
                style={{ background: 'linear-gradient(90deg, #FF8C61, #E8571A)' }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors duration-200"
                style={{ backgroundColor: '#FFF5F0', color: '#FF8C61' }}
              >
                {f.icon}
              </div>

              {/* Number */}
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#FFCAB0' }}>
                {f.number}
              </p>

              <h3 className="text-base font-bold mb-2" style={{ color: '#1C1C1C' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
