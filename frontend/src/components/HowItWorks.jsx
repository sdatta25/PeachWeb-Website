const steps = [
  {
    number: '1',
    title: 'Reach Out',
    description: 'Fill out our Request a Website form or email us. Tell us about your business and what you need.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.72 9.79 19.79 19.79 0 011.65 1.11 2 2 0 013.62 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.8a16 16 0 006.29 6.29l1.86-1.86a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Plan',
    description: 'We schedule a discovery call, map out your project, and create a clear plan with timeline and deliverables.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/>
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Build',
    description: 'Our team designs and develops your custom site or chatbot. We share progress updates and gather your feedback.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    number: '4',
    title: 'Launch',
    description: 'We deploy your site, run final tests, and hand you the keys — with full training and ongoing support.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M22.2 14.4L21 13.2C21.6 11.6 22 9.8 22 8c0-5.5-4.5-10-10-10S2 2.5 2 8s4.5 10 10 10c1.8 0 3.6-.4 5.2-1.2l1.2 1.2c.4.4.9.6 1.4.6s1-.2 1.4-.6c.8-.8.8-2 0-2.6zM13 14.9V13h-2v1.9C9.2 14.4 7.6 12.8 7.1 11H9V9H7.1C7.6 7.2 9.2 5.6 11 5.1V7h2V5.1c1.8.5 3.4 2.1 3.9 3.9H15v2h1.9c-.5 1.8-2.1 3.4-3.9 3.9z"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="process" className="py-28 w-full bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF8C61' }}>
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#1C1C1C' }}>
            Our 4-Step Process
          </h2>
          <p className="text-base max-w-sm mx-auto" style={{ color: '#9CA3AF' }}>
            From first contact to live site — simple, clear, and fast.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-px" style={{ backgroundColor: '#FFE4D6', margin: '0 10%' }} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, i) => (
              <div key={step.number} className="flex flex-col items-center text-center group">
                {/* Step circle */}
                <div className="relative mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center z-10 relative transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #FF8C61, #E8571A)',
                      boxShadow: '0 8px 24px rgba(255, 140, 97, 0.35)',
                      color: 'white',
                    }}
                  >
                    {step.icon}
                  </div>
                  {/* Step number badge */}
                  <div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white z-20"
                    style={{ backgroundColor: '#1C1C1C' }}
                  >
                    {step.number}
                  </div>
                </div>

                <h3 className="text-base font-black mb-2" style={{ color: '#1C1C1C' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  {step.description}
                </p>

                {/* Mobile connector */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden mt-6 w-px h-8" style={{ backgroundColor: '#FFE4D6' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
