const portfolio = [
  {
    builder: 'Souren Datta',
    linkedin: 'https://www.linkedin.com/in/sourendatta/',
    sites: [
      { name: 'SFE Foundry', url: 'https://sfefoundry.vercel.app', blurb: 'Club site and member portal' },
      { name: 'Finance For Movement', url: 'https://financeformovement.org', blurb: 'Nonprofit organization site' },
      { name: 'Sabrine Math', url: 'https://sabrinemath.vercel.app', blurb: 'Site for content creator Sabrine Mezali' },
    ],
  },
  {
    builder: 'Adwait Dhaneshwar',
    linkedin: 'https://www.linkedin.com/in/adwaitdhaneshwar/',
    sites: [
      { name: 'STEM Simplified', url: 'https://thestemsimplified.vercel.app', blurb: 'STEM education initiative' },
      { name: 'AHS Chess Club', url: 'https://ahschessclub.vercel.app', blurb: 'High school chess club site' },
      { name: 'Alpharetta Robotics', url: 'https://alpharettarobotics.vercel.app', blurb: 'AHS robotics team site' },
    ],
  },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-28 w-full" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF8C61' }}>
            Portfolio
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#1C1C1C' }}>
            Sites We've Shipped
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: '#9CA3AF' }}>
            Real websites, live right now — built by the two of us.
          </p>
        </div>

        {/* Grouped by builder */}
        <div className="space-y-14">
          {portfolio.map(group => (
            <div key={group.builder}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-black whitespace-nowrap" style={{ color: '#1C1C1C' }}>
                  Built by{' '}
                  <a
                    href={group.linkedin}
                    target="_blank"
                    rel="noopener"
                    className="transition-opacity hover:opacity-70"
                    style={{ color: '#E8571A' }}
                  >
                    {group.builder}
                  </a>
                </span>
                <span className="h-px flex-1" style={{ backgroundColor: '#FFE4D6' }} />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.sites.map(site => (
                  <a
                    key={site.url}
                    href={site.url}
                    target="_blank"
                    rel="noopener"
                    className="group block bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-black leading-snug" style={{ color: '#1C1C1C' }}>
                        {site.name}
                      </h3>
                      <span style={{ color: '#FF8C61' }}><ArrowIcon /></span>
                    </div>
                    <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{site.blurb}</p>
                    <p className="text-xs font-medium break-all" style={{ color: '#9CA3AF' }}>
                      {site.url.replace('https://', '')}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
