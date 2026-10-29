import ChatDemo from './ChatDemo'
import { services } from '../content/site'

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-cream py-16 sm:py-24 lg:py-32">
      <div className="page">
        <div className="grid-12 mb-12 lg:mb-16">
          <h2 id="services-heading" className="reveal col-span-4 text-h2 sm:col-span-7">What we do</h2>
          <p className="reveal col-span-4 mt-6 max-w-prose text-muted sm:col-span-5 sm:mt-0 sm:self-end">
            Most clients come to us for a website. Some add a chatbot so routine questions get answered when
            nobody is at the counter. Either way, we stick around after launch.
          </p>
        </div>

        {/* A list that reads like a table on wide screens. */}
        <div className="border-t border-dark">
          <div className="hidden grid-cols-12 gap-x-8 border-b border-line py-4 text-sm text-muted lg:grid" aria-hidden="true">
            <span className="col-span-3">Service</span>
            <span className="col-span-5">What it is</span>
            <span className="col-span-4">What you get</span>
          </div>
          <ul>
            {services.map(s => (
              <li key={s.name} className="reveal grid-12 gap-y-4 border-b border-line py-8 lg:py-10">
                <h3 className="col-span-4 text-h3 sm:col-span-12 lg:col-span-3">{s.name}</h3>
                <p className="col-span-4 max-w-prose text-muted sm:col-span-6 lg:col-span-5">{s.summary}</p>
                <ul className="col-span-4 space-y-2 text-base sm:col-span-6 lg:col-span-4">
                  {s.includes.map(item => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-burnt" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid-12 mt-16 items-center gap-y-12 lg:mt-24">
          <div className="reveal col-span-4 sm:col-span-12 lg:col-span-5">
            <h3 className="mb-4 text-h3">What a chatbot does for a small business</h3>
            <p className="max-w-prose text-muted">
              Here's the kind of conversation a chatbot handles for a bakery while the owner is busy baking. It
              answers from the business's own information and passes leads straight to the team.
            </p>
          </div>
          <div className="reveal col-span-4 sm:col-span-12 lg:col-span-6 lg:col-start-7">
            <ChatDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
