import BrowserFrame, { Screenshot } from './BrowserFrame'
import BeforeAfter from './BeforeAfter'
import { projects } from '../content/site'

function Visit({ project }) {
  return (
    <a href={project.url} target="_blank" rel="noopener" className="link inline-flex min-h-11 items-center gap-1 font-semibold text-burnt">
      Visit {project.url.replace(/^https?:\/\//, '')}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

function Caption({ project, n }) {
  return (
    <>
      <p className="mb-2 text-sm text-muted">
        <span className="tabular-nums">{String(n).padStart(2, '0')}</span> · {project.type}
      </p>
      <h3 className="mb-4 text-h3">{project.name}</h3>
      <p className="mb-2 max-w-prose text-muted">{project.line}</p>
      <Visit project={project} />
    </>
  )
}

export default function Work() {
  const featured = projects.slice(0, 2)
  const rest = projects.slice(2)

  return (
    <section id="work" aria-labelledby="work-heading" className="border-t border-line py-16 sm:py-24 lg:py-32">
      <div className="page">
        <div className="grid-12 mb-16 lg:mb-24">
          <h2 id="work-heading" className="reveal col-span-4 text-h2 sm:col-span-8">
            Six live sites, built start to finish by the two of us.
          </h2>
          <p className="reveal col-span-4 mt-6 max-w-prose text-muted sm:col-span-6 sm:col-start-1">
            Clubs, nonprofits, a school team, and a content creator. Open them on your phone before you decide
            whether we're a fit.
          </p>
        </div>

        {/* Two featured projects: a large desktop shot with the phone view overlapping it. */}
        <div className="space-y-24 lg:space-y-32">
          {featured.map((p, i) => {
            const flip = i % 2 === 1
            return (
              <article key={p.slug} className="grid-12 items-end gap-y-8">
                <div className={`reveal relative col-span-4 sm:col-span-12 lg:col-span-8 ${flip ? 'lg:col-start-5 lg:row-start-1' : ''}`}>
                  <BrowserFrame url={p.url}>
                    <Screenshot slug={p.slug} alt={`Homepage of ${p.name}`} sizes="(min-width: 1024px) 66vw, 100vw" />
                  </BrowserFrame>
                  <img
                    src={`/work/${p.slug}-mobile.webp`}
                    alt={`${p.name} on a phone`}
                    width="390"
                    height="844"
                    loading="lazy"
                    decoding="async"
                    className={`absolute -bottom-8 hidden w-[22%] rounded-xl border-4 border-dark bg-white shadow-frame sm:block ${flip ? '-left-4' : '-right-4'}`}
                  />
                </div>
                <div className={`reveal col-span-4 sm:col-span-8 lg:col-span-4 ${flip ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <Caption project={p} n={i + 1} />
                </div>
              </article>
            )
          })}
        </div>

        {/* The rest as a staggered two-column index. */}
        <div className="mt-24 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-32">
          {rest.map((p, i) => (
            <article key={p.slug} className={`reveal ${i % 2 === 1 ? 'sm:mt-24' : ''}`}>
              <BrowserFrame url={p.url} className="mb-6">
                <Screenshot slug={p.slug} alt={`Homepage of ${p.name}`} sizes="(min-width: 640px) 50vw, 100vw" />
              </BrowserFrame>
              <Caption project={p} n={i + 3} />
            </article>
          ))}
        </div>

        <BeforeAfter />
      </div>
    </section>
  )
}
