import HeroCanvas from './HeroCanvas'

export default function Hero({ onRequest }) {
  return (
    <section aria-labelledby="hero-heading" className="relative w-full pt-[72px] overflow-hidden">
      <div className="page grid lg:grid-cols-12 gap-x-8 items-center min-h-[calc(100svh-72px)] py-12 lg:py-16">
        <div className="lg:col-span-7 animate-fade-up relative z-10">
          <p className="text-[0.95rem] text-stone mb-6 max-w-md">
            Websites and AI chatbots for local businesses and nonprofits around Atlanta.
          </p>

          <h1
            id="hero-heading"
            className="font-display font-medium text-charcoal text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[4.6rem] lg:leading-[1.02] mb-7 max-w-[13ch]"
          >
            A better website for the business you've built.
          </h1>

          <p className="text-lg leading-relaxed text-stone max-w-[34rem] mb-9">
            Tell us what your business does and who you want to reach. We'll plan the site with you on a
            call, build it with your feedback along the way, and stay around after launch to keep it running.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onRequest} className="btn-primary px-6 py-3.5 text-base">
              Request a website
            </button>
            <a href="#portfolio" className="btn-quiet px-6 py-3.5 text-base">
              See sites we've built
            </a>
          </div>

          <p className="mt-10 text-sm text-stone">
            Prefer email?{' '}
            <a href="mailto:peachwebdevelopment@gmail.com" className="text-link text-charcoal">
              peachwebdevelopment@gmail.com
            </a>
          </p>
        </div>

        {/* The globe animation. Decorative, so it is hidden from assistive tech and ignores pointer input. */}
        <div
          aria-hidden="true"
          className="lg:col-span-5 animate-fade-in pointer-events-none relative h-[300px] sm:h-[380px] lg:h-[560px] mt-10 lg:mt-0 -mx-5 sm:mx-0 lg:-mr-10"
        >
          <HeroCanvas />
        </div>
      </div>
    </section>
  )
}
