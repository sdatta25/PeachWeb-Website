import { stack } from '../content/site'

const FLOW = ['Visitor submits a form', 'Our API validates and records it', 'You get a notification email', 'The visitor gets a confirmation']

// What is under the site: the same pieces we build for clients, described from this site's own
// setup so every line can be checked.
export default function Engineering() {
  return (
    <section id="engineering" aria-labelledby="engineering-heading" className="on-dark bg-dark py-16 text-cream sm:py-24 lg:py-32">
      <div className="page">
        <div className="grid-12 mb-12 lg:mb-16">
          <p className="reveal col-span-4 mb-4 text-sm font-semibold text-orange sm:col-span-12">Under the hood</p>
          <h2 id="engineering-heading" className="reveal col-span-4 text-h2 sm:col-span-9 lg:col-span-8">
            A website is the part you see. We build the rest too.
          </h2>
          <p className="reveal col-span-4 mt-6 max-w-prose text-cream/80 sm:col-span-8">
            This site runs on the same pieces we build for clients. Send the form on the Contact page or ask
            Peachy a question and you are using them.
          </p>
        </div>

        {/* The path one request takes. */}
        <ol className="reveal mb-16 grid gap-3 sm:grid-cols-2 lg:mb-20 lg:grid-cols-4">
          {FLOW.map((step, i) => (
            <li key={step} className="rounded border border-cream/20 p-5">
              <p className="mb-2 text-sm tabular-nums text-orange">{String(i + 1).padStart(2, '0')}</p>
              <p className="font-semibold">{step}</p>
            </li>
          ))}
        </ol>

        <dl className="grid gap-x-8 border-t border-cream/20 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map(item => (
            <div key={item.name} className="reveal border-b border-cream/20 py-8">
              <dt className="mb-1 text-h3">{item.name}</dt>
              <dd className="mb-3 text-sm text-orange">{item.tools}</dd>
              <dd className="max-w-prose text-cream/80">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
