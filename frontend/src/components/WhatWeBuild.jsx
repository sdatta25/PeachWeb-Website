const services = [
  {
    title: 'Custom Websites',
    description: 'Beautiful, fast, mobile-first websites tailored to your brand and business goals. Every pixel crafted for your audience.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    tag: 'Most Popular',
  },
  {
    title: 'AI Chatbots',
    description: 'Smart AI assistants that answer customer questions around the clock, book appointments, and capture leads automatically.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        <path d="M8 10h.01M12 10h.01M16 10h.01"/>
      </svg>
    ),
    tag: 'AI-Powered',
  },
  {
    title: 'Mobile-First Design',
    description: 'Every site we build looks and works perfectly on phones, tablets, and desktops — because that\'s where your customers are.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    tag: null,
  },
  {
    title: 'Post-Launch Support',
    description: "We don't disappear after launch. Ongoing maintenance, updates, and support so your site always runs at its best.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    tag: null,
  },
]

export default function WhatWeBuild() {
  return (
    <section id="build" className="py-28 w-full" style={{ background: 'linear-gradient(180deg, #FFF8F4 0%, #FFF2EB 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF8C61' }}>
            What We Build
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#1C1C1C' }}>
            Our Services
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: '#9CA3AF' }}>
            From your first website to an AI-powered customer experience — we build it all.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default flex gap-6"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #FFF0E8' }}
            >
              {/* Icon block */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-orange-100"
                style={{ backgroundColor: '#FFF5F0', color: '#FF8C61' }}
              >
                {s.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-bold" style={{ color: '#1C1C1C' }}>{s.title}</h3>
                  {s.tag && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: '#FFF5F0', color: '#E8571A' }}
                    >
                      {s.tag}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{s.description}</p>
              </div>

              {/* Arrow on hover — desktop only */}
              <div
                className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-lg"
                style={{ color: '#FF8C61' }}
              >
                →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
