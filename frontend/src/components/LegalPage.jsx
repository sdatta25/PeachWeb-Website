import { PeachLogoFull } from './PeachLogo'
import Footer from './Footer'
import { LAST_UPDATED } from '../content/legal'

// Shared layout for /privacy and /terms. It reuses the site's own header logo, grid, type scale
// and footer, so the pages look like the rest of the site. The body copy is in content/legal.jsx.
export default function LegalPage({ doc }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]">
        Skip to content
      </a>

      <header className="border-b border-line bg-page">
        <div className="page flex h-[var(--nav-h)] items-center justify-between gap-4">
          <a href="/" className="flex min-h-11 items-center rounded" aria-label="PeachWeb home">
            <PeachLogoFull iconSize={30} />
          </a>
          <a href="/" className="inline-flex min-h-11 items-center rounded px-2 text-base text-muted hover:text-dark">
            <span aria-hidden="true">←&nbsp;</span><span className="sm:hidden">Home</span><span className="hidden sm:inline">Back to homepage</span>
          </a>
        </div>
      </header>

      <main id="main" className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="page grid-12 gap-y-10">
          <div className="col-span-4 sm:col-span-12">
            <p className="label mb-4">Legal</p>
            <h1 className="mb-4 text-h2">{doc.title}</h1>
            <p className="text-muted">Last updated: <time>{LAST_UPDATED}</time></p>
            <p className="mt-6 max-w-prose text-lg">{doc.intro}</p>
          </div>

          {/* Table of contents: desktop only, and it stays in view while you read. */}
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-8">
              <p className="mb-3 text-sm font-semibold">On this page</p>
              <ol className="border-l border-line">
                {doc.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px flex min-h-9 items-center border-l-2 border-transparent py-1 pl-4 text-sm text-muted hover:border-burnt hover:text-dark">
                      <span className="mr-2 tabular-nums">{i + 1}.</span>{s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="col-span-4 sm:col-span-12 lg:col-span-8 lg:col-start-5">
            <div className="legal max-w-prose">
              {doc.sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="mb-12 last:mb-0">
                  <h2 id={`${s.id}-h`} className="mb-4 text-h3"><span className="tabular-nums">{i + 1}.</span> {s.title}</h2>
                  {s.body}
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer base="/" />
    </div>
  )
}
