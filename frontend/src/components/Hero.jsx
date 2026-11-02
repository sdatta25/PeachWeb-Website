import HeroPreview from './HeroPreview'
import { heroPunchline } from '../content/site'

// `intro-in` + `--i` stagger these elements in when the opening intro's wipe starts (see the
// "Intro choreography" block in index.css). With no intro they simply show, with no animation.
const stagger = i => ({ '--i': i })

export default function Hero({ onMockup }) {
  return (
    <section id="top" aria-labelledby="hero-heading" className="on-peach bg-peach pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20">
      <div className="page grid-12 items-center gap-y-12">
        <div className="col-span-4 sm:col-span-12 lg:col-span-6">
          {/* The punchline to the intro: the first thing read once the wipe has passed. */}
          <p className="intro-in mb-6 inline-block bg-dark px-3 py-1.5 text-lg font-semibold text-peach" style={stagger(0)}>
            {heroPunchline}
          </p>
          <h1 id="hero-heading" className="intro-in mb-6 max-w-[12ch] font-hero text-hero text-dark" style={stagger(1)}>
            A website that gets your phone ringing.
          </h1>
          <p className="intro-in mb-10 max-w-prose text-lg text-muted" style={stagger(2)}>
            We design and build websites and AI chatbots that bring local businesses and nonprofits more calls,
            bookings, and customers.
          </p>
          <div className="intro-in flex flex-col gap-4 sm:flex-row sm:items-center" style={stagger(3)}>
            <button onClick={onMockup} className="btn-primary">Get a free mockup</button>
            <a href="#work" className="btn-line">See our work</a>
          </div>
        </div>

        {/* A scripted demo of a visitor using a sample small-business site. Decorative, so it is
            hidden from assistive tech and ignores pointer input. */}
        <figure className="intro-in col-span-4 sm:col-span-12 lg:col-span-6 min-[1400px]:-mr-20" style={stagger(2)}>
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
