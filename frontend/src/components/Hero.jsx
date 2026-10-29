import HeroPreview from './HeroPreview'

export default function Hero({ onRequest }) {
  return (
    <section aria-labelledby="hero-heading" className="relative w-full pt-[72px] overflow-hidden">
      <div className="page relative z-10 xl:grid xl:grid-cols-12 xl:gap-x-8 xl:items-center xl:min-h-[calc(100svh-72px)] py-12 xl:py-16">
        <div className="xl:col-span-7 animate-fade-up">
          <p className="text-[0.95rem] text-stone mb-6 max-w-md">
            Websites and AI chatbots for local businesses and nonprofits around Atlanta.
          </p>

          <h1
            id="hero-heading"
            className="font-display font-medium text-charcoal text-[2.6rem] leading-[1.04] sm:text-6xl xl:text-[4.6rem] xl:leading-[1.02] mb-7 max-w-[13ch]"
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
            <a href="#portfolio" className="btn-quiet bg-ivory/80 px-6 py-3.5 text-base">
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
      </div>

      {/* A scripted demo of a visitor using a sample small-business site. Decorative, so it is
          hidden from assistive tech and ignores pointer input. On wide screens it sits behind the
          right half of the hero; below that it sits under the text, so nothing ever overlaps it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none pb-6 xl:pb-0 xl:absolute xl:inset-x-0 xl:top-[72px] xl:bottom-0"
      >
        <div className="page xl:h-full xl:flex xl:items-center xl:justify-end">
          {/* Sized from the page container and the viewport height, so it is never cropped.
              On wide screens its left edge fades out where it passes behind the headline. */}
          <div
            className="w-full max-w-[44rem] xl:max-w-none xl:w-[min(52%,calc((100svh-14rem)*1.25))] pv-fade-left"
          >
            <HeroPreview />
          </div>
        </div>
      </div>

      <p className="relative z-10 px-5 sm:px-8 pb-8 text-xs text-stone xl:absolute xl:bottom-4 xl:right-8 xl:p-0 xl:rounded xl:bg-ivory/85 xl:px-2 xl:py-1">
        Background: a sample site concept, not a real client.
      </p>
    </section>
  )
}
