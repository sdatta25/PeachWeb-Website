import { useState } from 'react'

const founders = [
  {
    name: 'Souren Datta',
    role: 'Co-Founder',
    photo: '/founders/souren.jpg',
    initials: 'SD',
    linkedin: 'https://www.linkedin.com/in/sourendatta/',
    bio: 'Started building sites for nonprofits and school groups and got hooked on the moment one goes live — watching people actually find an organization that was invisible the week before. Co-founded PeachWeb so the small businesses around Atlanta could have that too: a site they are proud to hand someone, without agency prices.',
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
    role: 'Co-Founder',
    photo: '/founders/adwait.jpg',
    initials: 'AD',
    linkedin: 'https://www.linkedin.com/in/adwaitdhaneshwar/',
    bio: 'Fell for web development building pages for school organizations, where a clear, well-made site changed how many people actually showed up. Co-founded PeachWeb to bring that same lift to local Atlanta businesses still getting by on an outdated page — or none at all.',
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

  if (failed) {
    return (
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center text-2xl font-black flex-shrink-0"
        style={{ backgroundColor: '#FFE4D6', color: '#E8571A' }}
        aria-label={name}
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setFailed(true)}
      // A dev server that answers a missing file with index.html "loads" at zero
      // width rather than erroring, so treat that as a failure too.
      onLoad={e => { if (e.currentTarget.naturalWidth === 0) setFailed(true) }}
      loading="lazy"
      className="w-28 h-28 rounded-full object-cover flex-shrink-0"
      style={{ border: '3px solid #FFE4D6' }}
    />
  )
}

export default function Founders() {
  return (
    <section id="founders" className="py-28 w-full" style={{ backgroundColor: '#FFF9F6' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF8C61' }}>
            Founders
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: '#1C1C1C' }}>
            Two Students, One Obsession
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
            We started PeachWeb because the small businesses around Atlanta deserve the same
            quality of website the big chains pay thousands for. We kept meeting shop owners,
            restaurants, and nonprofits doing great work behind an outdated page — or no page at
            all. Building websites is what we genuinely love doing, so we decided to do it for
            them, properly and affordably.
          </p>
        </div>

        {/* Founder cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {founders.map(f => (
            <div
              key={f.name}
              className="bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ border: '1px solid #FFE4D6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center gap-5 mb-6">
                <Portrait src={f.photo} initials={f.initials} name={f.name} />
                <div className="min-w-0">
                  <h3 className="text-xl font-black leading-tight" style={{ color: '#1C1C1C' }}>
                    {f.name}
                  </h3>
                  <p className="text-sm font-semibold mb-3" style={{ color: '#FF8C61' }}>
                    {f.role}
                  </p>
                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:shadow-sm"
                    style={{ backgroundColor: '#FFF5F0', color: '#E8571A', border: '1px solid #FFE4D6' }}
                  >
                    <LinkedInIcon className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: '#6B7280' }}>
                {f.bio}
              </p>

              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9CA3AF' }}>
                Sites Built
              </p>
              <ul className="flex flex-wrap gap-2">
                {f.work.map(w => (
                  <li
                    key={w}
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: '#FFF5F0', color: '#1C1C1C', border: '1px solid #FFE4D6' }}
                  >
                    {w}
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
