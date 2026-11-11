import MockupFlow from './MockupFlow'
import { EMAIL } from '../content/site'

// The #contact section: the pitch on one side and the step-by-step mockup request on the other.
export default function FinalCta() {
  return (
    <section id="contact" aria-labelledby="cta-heading" className="on-peach bg-peach py-16 sm:py-24 lg:py-32">
      <div className="page grid-12 items-start gap-y-12">
        <div className="col-span-4 sm:col-span-12 lg:col-span-5">
          <h2 id="cta-heading" className="reveal mb-6 text-h2">See your new site before you pay a thing.</h2>
          <p className="reveal mb-6 max-w-prose text-lg">
            Tell us about your business and we'll design a first look at your homepage, free. We reply within 1–2
            business days.
          </p>
          <a href={`mailto:${EMAIL}`} className="reveal inline-flex min-h-11 items-center text-dark underline decoration-dark/40 underline-offset-4 [overflow-wrap:anywhere] hover:decoration-dark">
            or email {EMAIL}
          </a>
        </div>

        <div className="reveal col-span-4 sm:col-span-12 lg:col-span-6 lg:col-start-7">
          <div className="rounded-xl border border-dark bg-white p-6 sm:p-8">
            <MockupFlow />
          </div>
        </div>
      </div>
    </section>
  )
}
