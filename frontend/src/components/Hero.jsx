import HeroPreview from './HeroPreview'
import { LOCATION } from '../content/site'

export default function Hero({ onMockup }) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20">
      <div className="page grid-12 items-center gap-y-12">
        <div className="col-span-4 sm:col-span-12 lg:col-span-6">
          <p className="label mb-6">Web studio · {LOCATION}</p>
          <h1 id="hero-heading" className="mb-6 max-w-[11ch] font-hero text-h1 text-black">
            A website that gets your phone ringing.
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

        {/* A scripted demo of a visitor using a sample small-business site. Decorative, so it is
            hidden from assistive tech and ignores pointer input. */}
        <figure className="col-span-4 sm:col-span-12 lg:col-span-6 min-[1400px]:-mr-20">
          <div aria-hidden="true" className="pointer-events-none">
            <HeroPreview />
          </div>
          <figcaption className="mt-4 text-sm text-muted">
            A sample site concept, not a real client. <a href="#work" className="link text-dark">See sites we've built</a>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
