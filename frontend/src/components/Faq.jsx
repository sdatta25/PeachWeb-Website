import { faqs } from '../content/site'

// Native <details> gives a keyboard- and screen-reader-accessible accordion with no JS.
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-16 sm:py-24 lg:py-32">
      <div className="page grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-12 lg:col-span-4">
          <h2 id="faq-heading" className="reveal text-h2 lg:sticky lg:top-[calc(var(--nav-h)+4rem)]">Questions</h2>
        </div>
        <div className="reveal col-span-4 border-t border-dark sm:col-span-12 lg:col-span-7 lg:col-start-6">
          {faqs.map(f => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-burnt" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-burnt transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-prose pb-8 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
