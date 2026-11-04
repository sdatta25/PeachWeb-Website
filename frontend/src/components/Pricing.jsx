import { pricing } from '../content/site'

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="on-peach bg-peach py-16 sm:py-24 lg:py-32">
      <div className="page grid-12 gap-y-16">
        <div className="col-span-4 sm:col-span-12 lg:col-span-5">
          <h2 id="pricing-heading" className="reveal mb-6 text-h2">Pricing</h2>
          <p className="reveal max-w-prose text-muted">
            Projects run from $500 to $2,000. We quote once we understand what you need, and we'll tell you plainly
            what fits your budget.
          </p>
        </div>

        <div className="col-span-4 sm:col-span-12 lg:col-span-6 lg:col-start-7">
          <dl className="reveal border-t border-dark">
            {pricing.map(t => (
              <div key={t.name} className="border-b border-dark/25 py-6">
                <dt className="font-display text-h3">{t.name}</dt>
                <dd className="mt-2 font-semibold text-burnt">
                  {t.price ?? 'Quoted after a call'}
                </dd>
                <dd className="mt-2 text-sm text-muted">{t.note} · {t.includes.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
