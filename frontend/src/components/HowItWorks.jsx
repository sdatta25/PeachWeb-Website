const steps = [
  {
    title: 'Reach out',
    description:
      'Send the request form or email us. A few sentences about your business and what you want the site to do is enough to start.',
  },
  {
    title: 'Plan',
    description:
      "We set up a discovery call, then send back a plan: the pages and features, a timeline, and what we'll need from you.",
  },
  {
    title: 'Build',
    description:
      'We design and build in stages and share progress as we go, so you react to real pages rather than a description of them.',
  },
  {
    title: 'Launch',
    description:
      'We test on phones and desktops, put the site live, and walk you through it. Support continues after launch.',
  },
]

export default function HowItWorks() {
  return (
    <section id="process" aria-labelledby="process-heading" className="w-full py-24 lg:py-32">
      <div className="page">
        <div className="mb-14 lg:mb-20 max-w-3xl">
          <h2 id="process-heading" className="font-display font-medium text-4xl sm:text-5xl leading-[1.08] mb-5">
            How a project runs
          </h2>
          <p className="text-stone leading-relaxed">
            Four steps from your first message to a live site. You'll know what's happening at each one.
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8">
          {steps.map((step, i) => (
            <li key={step.title} className="relative border-t border-charcoal pt-6 pb-10 lg:pb-0">
              <span
                aria-hidden="true"
                className="block font-display font-normal text-[4.5rem] leading-none text-peach mb-6"
                style={{ fontVariationSettings: "'SOFT' 100, 'opsz' 144" }}
              >
                {i + 1}
              </span>
              <h3 className="font-display font-medium text-2xl mb-3">
                <span className="sr-only">Step {i + 1}: </span>{step.title}
              </h3>
              <p className="text-stone leading-relaxed max-w-[22rem]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
