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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="8 7 17 7 17 16" />
    </svg>
  )
}

export default function Portfolio() {
  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className="w-full py-24 lg:py-32">
      <div className="page">
        <div className="grid lg:grid-cols-12 gap-x-8 mb-14 lg:mb-16">
          <h2 id="portfolio-heading" className="lg:col-span-6 font-display font-medium text-4xl sm:text-5xl leading-[1.08] mb-5 lg:mb-0">
            Sites we've built
          </h2>
          <p className="lg:col-span-5 lg:col-start-8 text-stone leading-relaxed self-end max-w-[32rem]">
            All six are live. They're for clubs, nonprofits, and a content creator, and each was built start to
            finish by one of us.
          </p>
        </div>

        <div className="space-y-16">
          {portfolio.map(group => (
            <div key={group.builder}>
              <p className="text-sm text-stone mb-3">
                Built by{' '}
                <a href={group.linkedin} target="_blank" rel="noopener" className="text-link font-semibold text-charcoal">
                  {group.builder}
                  <span className="sr-only"> (LinkedIn, opens in a new tab)</span>
                </a>
              </p>

              <ul className="border-t border-charcoal">
                {group.sites.map(site => (
                  <li key={site.url} className="border-b border-line">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener"
                      className="group grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 py-6 sm:py-8 rounded-sm"
                    >
                      <span
                        className="font-display font-normal text-[1.85rem] sm:text-5xl lg:text-[3.6rem] leading-[1.05] text-charcoal transition-colors duration-200 group-hover:text-terracotta"
                        style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}
                      >
                        {site.name}
                      </span>
                      <span className="row-start-2 md:row-start-1 md:col-start-2 text-stone text-[0.95rem] leading-snug">
                        {site.blurb}
                        <span className="block text-sm text-stone/80 mt-0.5 break-all">{site.url.replace('https://', '')}</span>
                      </span>
                      <span className="row-span-2 md:row-span-1 col-start-2 md:col-start-3 text-terracotta">
                        <ArrowIcon />
                        <span className="sr-only">(opens in a new tab)</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
