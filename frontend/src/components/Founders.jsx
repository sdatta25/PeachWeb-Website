import { useState } from 'react'

const founders = [
  {
    name: 'Souren Datta',
    role: 'Co-founder',
    photo: '/founders/souren.jpg',
    initials: 'SD',
    linkedin: 'https://www.linkedin.com/in/sourendatta/',
    bio: 'Started building sites for nonprofits and school groups and got hooked on the moment one goes live, when people can finally find an organization that was invisible the week before. Co-founded PeachWeb so the small businesses around Atlanta could have that too: a site they are proud to hand someone, without agency prices.',
    work: [
      'PeachWeb',
      'Finance For Movement',
      'SFE Foundry',
      'AHS YEFA',
      'Sabrine Mezali (content creator)',
    ],
  },
  {
    name: 'Adwait Dhaneshwar',
    role: 'Co-founder',
    photo: '/founders/adwait.jpg',
    initials: 'AD',
    linkedin: 'https://www.linkedin.com/in/adwaitdhaneshwar/',
    bio: 'Fell for web development building pages for school organizations, where a clear, well-made site changed how many people actually showed up. Co-founded PeachWeb to bring that same lift to local Atlanta businesses still getting by on an outdated page, or none at all.',
    work: [
      'STEM Simplified',
      'AHS Robotics',
      'AHS Chess Club',
    ],
  },
]

function LinkedInIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8h4.52v14H.24V8zm7.4 0h4.33v1.92h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V22h-4.52v-6.62c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H7.64V8z"/>
    </svg>
  )
}

function Portrait({ src, initials, name }) {
  const [failed, setFailed] = useState(false)
  const size = 'w-32 h-32 sm:w-40 sm:h-40'

  if (failed) {
    return (
      <div
        className={`${size} rounded-2xl flex items-center justify-center font-display text-4xl flex-shrink-0 bg-peach-soft text-terracotta`}
        role="img"
        aria-label={`Portrait of ${name}`}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`Portrait of ${name}`}
      width="160"
      height="160"
      onError={() => setFailed(true)}
      // A dev server that answers a missing file with index.html "loads" at zero
      // width rather than erroring, so treat that as a failure too.
      onLoad={e => { if (e.currentTarget.naturalWidth === 0) setFailed(true) }}
      loading="lazy"
      className={`${size} rounded-2xl object-cover flex-shrink-0 bg-peach-soft`}
    />
  )
}

export default function Founders() {
  return (
    <section id="founders" aria-labelledby="founders-heading" className="w-full py-24 lg:py-32 bg-bisque">
      <div className="page">
        <div className="grid lg:grid-cols-12 gap-x-8 mb-14 lg:mb-20">
          <h2 id="founders-heading" className="lg:col-span-5 font-display font-medium text-4xl sm:text-5xl leading-[1.08] mb-6 lg:mb-0 max-w-[12ch]">
            Two students who build websites
          </h2>
          <div className="lg:col-span-6 lg:col-start-7 space-y-4 text-stone leading-relaxed max-w-[36rem]">
            <p>
              We kept meeting shop owners, restaurants, and nonprofits around Atlanta doing good work behind an
              outdated page, or no page at all. A well-made site shouldn't only be for businesses that can pay
              big-agency rates.
            </p>
            <p>
              Building websites is what we like doing most, so we started PeachWeb to do it for them, properly
              and at a price a small business can manage.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-14">
          {founders.map(f => (
            <article key={f.name} className="border-t border-charcoal pt-8">
              <div className="flex items-end gap-6 mb-7">
                <Portrait src={f.photo} initials={f.initials} name={f.name} />
                <div className="min-w-0 pb-1">
                  <h3 className="font-display font-medium text-2xl sm:text-3xl leading-tight">{f.name}</h3>
                  <p className="text-stone mb-3">{f.role}</p>
                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:text-terracotta-deep"
                  >
                    <LinkedInIcon className="w-4 h-4" />
                    LinkedIn<span className="sr-only"> profile for {f.name} (opens in a new tab)</span>
                  </a>
                </div>
              </div>

              <p className="leading-relaxed mb-6 max-w-[36rem]">{f.bio}</p>

              <h4 className="font-sans text-sm font-semibold text-charcoal mb-1">Sites built</h4>
              <p className="text-sm text-stone leading-relaxed">{f.work.join(', ')}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
