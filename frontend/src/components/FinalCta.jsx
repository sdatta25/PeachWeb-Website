import { EMAIL } from '../content/site'

export default function FinalCta({ onMockup }) {
  return (
    <section id="contact" aria-labelledby="cta-heading" className="on-burnt bg-burnt py-16 text-cream sm:py-24 lg:py-32">
      <div className="page grid-12 items-end gap-y-12">
        <div className="col-span-4 sm:col-span-12 lg:col-span-8">
          <h2 id="cta-heading" className="reveal mb-6 text-h2">See your new site before you pay a thing.</h2>
          <p className="reveal max-w-prose text-lg">
            Tell us about your business and we'll design a first look at your homepage, free. We reply within 1–2
            business days.
          </p>
        </div>
        <div className="reveal col-span-4 flex flex-col items-start gap-4 sm:col-span-12 lg:col-span-4 lg:items-end">
          <button onClick={onMockup} className="btn-cream">Get a free mockup</button>
          <a href={`mailto:${EMAIL}`} className="inline-flex min-h-11 items-center text-cream underline decoration-cream/50 underline-offset-4 [overflow-wrap:anywhere] hover:decoration-cream">
            or email {EMAIL}
          </a>
        </div>
      </div>
    </section>
  )
}
