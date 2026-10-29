import QuoteEstimator from './QuoteEstimator'
import { pricing } from '../content/site'

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="bg-cream py-16 sm:py-24 lg:py-32">
      <div className="page grid-12 gap-y-16">
        <div className="col-span-4 sm:col-span-12 lg:col-span-5">
          <h2 id="pricing-heading" className="reveal mb-6 text-h2">Pricing</h2>
          <p className="reveal mb-12 max-w-prose text-muted">
            Most projects start under $500. We quote once we understand what you need, and we'll tell you plainly
            what fits your budget.
          </p>

          <dl className="reveal border-t border-dark">
            {pricing.map(t => (
              <div key={t.name} className="border-b border-line py-6">
                <dt className="font-display text-h3">{t.name}</dt>
                <dd className="mt-2 font-semibold text-burnt">
                  {t.price ?? 'Quoted after a call'}
                  {t.price == null && import.meta.env.DEV && (
                    <span className="ml-2 inline-block rounded bg-dark px-2 py-0.5 text-xs text-cream">PLACEHOLDER: set in content/site.js</span>
                  )}
                </dd>
                <dd className="mt-2 text-sm text-muted">{t.note} · {t.includes.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal col-span-4 sm:col-span-12 lg:col-span-6 lg:col-start-7">
          <QuoteEstimator />
        </div>
      </div>
    </section>
  )
}
