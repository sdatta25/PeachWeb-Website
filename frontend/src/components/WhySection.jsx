const reasons = [
  {
    title: 'You talk to the people building it',
    description:
      "There's no account manager in between. Whoever is on your planning call is designing and writing your site, so feedback doesn't get lost in a handoff.",
  },
  {
    title: 'Priced for small budgets',
    description:
      "We quote once we understand the project, and we'll tell you plainly what fits in your budget. Requests start under $500.",
  },
  {
    title: 'Room to add things later',
    description:
      "We set sites up so that adding a menu page, an events calendar, or a chatbot next year doesn't mean starting over.",
  },
  {
    title: 'Work you can check first',
    description:
      'Everything in our portfolio is a live site. Open a few on your phone before you decide whether we are a fit.',
  },
]

export default function WhySection() {
  return (
    <section id="why" aria-labelledby="why-heading" className="w-full py-24 lg:py-32 border-t border-line">
      <div className="page grid lg:grid-cols-12 gap-x-8 gap-y-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id="why-heading" className="font-display font-medium text-4xl sm:text-5xl leading-[1.08] mb-6 max-w-[14ch]">
              What working with PeachWeb is like
            </h2>
            <p className="text-stone max-w-[30rem] leading-relaxed">
              We're two students in the Atlanta area who build websites. That shapes how we work, mostly in
              ways that help a small business or nonprofit.
            </p>
          </div>
        </div>

        <ul className="lg:col-span-7 lg:col-start-6 border-t border-charcoal">
          {reasons.map(r => (
            <li key={r.title} className="grid sm:grid-cols-[minmax(0,15rem)_1fr] gap-x-8 gap-y-2 py-7 border-b border-line">
              <h3 className="font-display font-medium text-[1.35rem] leading-snug">{r.title}</h3>
              <p className="text-stone leading-relaxed">{r.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
