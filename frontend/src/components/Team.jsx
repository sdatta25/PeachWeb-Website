import { useState } from 'react'
import { founders } from '../content/site'

function Portrait({ f }) {
  const [failed, setFailed] = useState(false)
  const initials = f.name.split(' ').map(w => w[0]).join('')
  if (failed) {
    return (
      <div role="img" aria-label={`Portrait of ${f.name}`} className="flex aspect-square w-32 items-center justify-center rounded-xl bg-chip font-display text-h3 text-burnt sm:w-40">
        {initials}
      </div>
    )
  }
  return (
    <img
      src={f.photo}
      alt={`Portrait of ${f.name}`}
      width="160" height="160" loading="lazy" decoding="async"
      onError={() => setFailed(true)}
      className="aspect-square w-32 rounded-xl bg-chip object-cover sm:w-40"
    />
  )
}

export default function Team() {
  return (
    <section id="team" aria-labelledby="team-heading" className="py-16 sm:py-24 lg:py-32">
      <div className="page grid-12 gap-y-16">
        <div className="col-span-4 sm:col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+4rem)]">
            <h2 id="team-heading" className="reveal mb-8 text-h2">Meet the two people building your site.</h2>
            <div className="reveal max-w-prose space-y-4 text-muted">
              <p>
                We kept meeting shop owners, restaurants, and nonprofits around Atlanta doing good work behind an
                outdated page, or no page at all. A well-made site shouldn't only be for businesses that can pay
                big-agency rates.
              </p>
              <p>
                We're two students in the Atlanta area, and building websites is what we like doing most. So we
                started PeachWeb to do it properly, at a price a small business can manage.
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-4 sm:col-span-12 lg:col-span-6 lg:col-start-7">
          {founders.map(f => (
            <article key={f.name} className="reveal border-t border-dark py-8 first:pt-8 lg:py-12">
              <div className="mb-6 flex items-end gap-6">
                <Portrait f={f} />
                <div>
                  <h3 className="text-h3">{f.name}</h3>
                  <p className="mb-2 text-muted">{f.role}</p>
                  <a href={f.linkedin} target="_blank" rel="noopener" className="link inline-flex min-h-11 items-center text-sm font-semibold text-burnt">
                    LinkedIn<span className="sr-only"> profile for {f.name} (opens in a new tab)</span>
                  </a>
                </div>
              </div>
              <p className="mb-6 max-w-prose">{f.bio}</p>
              <p className="text-sm text-muted">
                <span className="font-semibold text-dark">Sites built: </span>
                {f.work.join(', ')}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
