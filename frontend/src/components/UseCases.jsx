import { ArrowRight, Download } from 'lucide-react'
import { projects, useCases, USE_CASES_PDF } from '../content/site'

export function PdfButton({ className = 'btn-primary' }) {
  return (
    <a href={USE_CASES_PDF} download className={className}>
      <Download className="h-4 w-4" aria-hidden="true" /> Download the use cases (PDF)
    </a>
  )
}

function Flow({ steps }) {
  return (
    <ol className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span className="rounded bg-chip px-3 py-2 text-sm font-semibold">{step}</span>
          {i < steps.length - 1 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-burnt sm:block" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}

export default function UseCases() {
  return (
    <section aria-label="Use cases" className="py-16 sm:py-24">
      <div className="page">
        <nav aria-label="Use cases on this page" className="reveal mb-16 border-y border-line py-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {useCases.map(u => (
              <li key={u.id}><a href={`#${u.id}`} className="inline-flex min-h-11 items-center text-muted hover:text-dark">{u.name}</a></li>
            ))}
          </ul>
        </nav>

        <div className="space-y-20 lg:space-y-28">
          {useCases.map((u, i) => {
            const example = u.example && projects.find(p => p.slug === u.example)
            return (
              <article key={u.id} id={u.id} aria-labelledby={`${u.id}-h`} className="anchor grid-12 gap-y-8">
                <div className="reveal col-span-4 sm:col-span-12 lg:col-span-4">
                  <p className="mb-2 text-sm tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</p>
                  <h2 id={`${u.id}-h`} className="mb-3 text-h3">{u.name}</h2>
                  {u.who && <p className="text-sm text-muted">{u.who}</p>}
                </div>

                <div className="reveal col-span-4 space-y-8 sm:col-span-12 lg:col-span-8">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold tracking-normal text-burnt">The problem</h3>
                    <p className="max-w-prose text-lg">{u.problem}</p>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold tracking-normal text-burnt">What we build</h3>
                    <ul className="max-w-prose space-y-2">
                      {u.build.map(item => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-burnt" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold tracking-normal text-burnt">How it connects</h3>
                    <Flow steps={u.flow} />
                  </div>
                  {example && (
                    <p className="text-muted">
                      One we built:{' '}
                      <a href={example.url} target="_blank" rel="noopener" className="link font-semibold text-dark">
                        {example.name}<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                      . {example.line}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="reveal mt-20 rounded-xl border border-dark bg-cream p-8 sm:p-10">
          <h2 className="mb-3 text-h3">Take the use cases with you</h2>
          <p className="mb-6 max-w-prose text-muted">
            The same six use cases as a PDF, to read offline or pass to a business partner.
          </p>
          <PdfButton />
        </div>
      </div>
    </section>
  )
}

// The home page's pointer to the use cases page and the PDF.
export function UseCasesTeaser() {
  return (
    <section aria-labelledby="uc-teaser-heading" className="py-16 sm:py-24">
      <div className="page grid-12 items-end gap-y-8">
        <div className="col-span-4 sm:col-span-12 lg:col-span-7">
          <h2 id="uc-teaser-heading" className="reveal mb-6 text-h2">What would a site do for your business?</h2>
          <p className="reveal max-w-prose text-muted">
            {useCases.map(u => u.name).join(', ')}. For each one: the problem, what we build, and how a
            customer's request reaches you.
          </p>
        </div>
        <div className="reveal col-span-4 flex flex-col gap-4 sm:col-span-12 sm:flex-row lg:col-span-5 lg:justify-end">
          <a href="/use-cases" className="btn-primary">See the use cases</a>
          <PdfButton className="btn-line" />
        </div>
      </div>
    </section>
  )
}
