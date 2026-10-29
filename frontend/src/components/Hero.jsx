import BrowserFrame, { Screenshot } from './BrowserFrame'
import { LOCATION } from '../content/site'

export default function Hero({ onMockup }) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20">
      <div className="page grid-12 items-center gap-y-12">
        <div className="col-span-4 sm:col-span-12 lg:col-span-6">
          <p className="label mb-6">Web studio · {LOCATION}</p>
          <h1 id="hero-heading" className="mb-6 max-w-[11ch] text-h1">
            A website that gets your phone <em className="text-burnt">ringing.</em>
          </h1>
          <p className="mb-10 max-w-prose text-lg text-muted">
            We design and build websites and AI chatbots that bring local businesses and nonprofits more calls,
            bookings, and customers.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button onClick={onMockup} className="btn-primary">Get a free mockup</button>
            <a href="#work" className="btn-line">See our work</a>
          </div>
        </div>

        {/* A real site we built. Bleeds past the column on large screens for an editorial feel. */}
        <figure className="col-span-4 sm:col-span-12 lg:col-span-6 min-[1400px]:-mr-20">
          <BrowserFrame url="https://financeformovement.org">
            <Screenshot
              slug="finance-for-movement"
              alt="Homepage of financeformovement.org, a nonprofit site built by PeachWeb"
              sizes="(min-width: 1024px) 50vw, 100vw"
              eager
            />
          </BrowserFrame>
          <figcaption className="mt-4 text-sm text-muted">
            Finance For Movement, a youth-led nonprofit.{' '}
            <a href="https://financeformovement.org" target="_blank" rel="noopener" className="link text-dark">
              Visit the live site<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
