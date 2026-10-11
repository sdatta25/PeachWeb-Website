const primary = [
  {
    title: 'Custom websites',
    description:
      "A site designed around your business rather than a template with your logo dropped in. It covers what customers actually look for: what you offer, where you are, when you're open, and how to reach you.",
    includes: ['Pages for your services or menu, your story, and contact details', 'Hours, location, and photos where people expect them', 'Launched by us, with a walkthrough for you'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden="true">
        <rect x="2.5" y="4" width="19" height="15" rx="2" /><path d="M2.5 8.5h19M6 6.25h.01M8.5 6.25h.01" />
      </svg>
    ),
  },
  {
    title: 'AI chatbots',
    description:
      'An assistant on your site that answers common questions from your own information at any hour, and takes down contact details from people who want a follow-up. Peachy, in the corner of this page, is one we built for ourselves.',
    includes: ['Set up with your hours, services, and common questions', 'Points visitors to the right page or contact form'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden="true">
        <path d="M21 14.5a2 2 0 01-2 2H8l-4.5 4V5a2 2 0 012-2H19a2 2 0 012 2z" /><path d="M8 9.5h.01M12 9.5h.01M16 9.5h.01" />
      </svg>
    ),
  },
]

const secondary = [
  {
    title: 'Mobile-first design',
    description: 'Every page is laid out for a phone screen first, then adjusted for tablets and desktops.',
  },
  {
    title: 'Support after launch',
    description: 'We handle updates and fixes after the site goes live, and show you how to make simple edits yourself.',
  },
]

export default function WhatWeBuild() {
  return (
    <section id="build" aria-labelledby="build-heading" className="w-full py-24 lg:py-32 bg-bisque">
      <div className="page">
        <div className="grid lg:grid-cols-12 gap-x-8 mb-14 lg:mb-20">
          <h2 id="build-heading" className="lg:col-span-6 font-display font-medium text-4xl sm:text-5xl leading-[1.08] mb-5 lg:mb-0">
            What we build
          </h2>
          <p className="lg:col-span-5 lg:col-start-8 text-stone leading-relaxed self-end max-w-[32rem]">
            Most clients come to us for a website. Some add a chatbot so routine questions get answered
            when nobody is at the counter. You can ask for either one, or both.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {primary.map(s => (
            <article key={s.title} className="bg-ivory rounded-2xl p-7 sm:p-10 flex flex-col">
              <div className="text-terracotta mb-8">{s.icon}</div>
              <h3 className="font-display font-medium text-3xl mb-4">{s.title}</h3>
              <p className="text-stone leading-relaxed mb-8 max-w-[36rem]">{s.description}</p>
              <ul className="mt-auto border-t border-line">
                {s.includes.map(item => (
                  <li key={item} className="flex gap-3 py-3 border-b border-line text-[0.95rem]">
                    <svg viewBox="0 0 16 16" className="w-4 h-4 mt-1 flex-shrink-0 text-terracotta" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-x-5 mt-12">
          {secondary.map(s => (
            <div key={s.title} className="py-6 border-t border-charcoal/20 md:px-2">
              <h3 className="font-display font-medium text-xl mb-2">{s.title}</h3>
              <p className="text-stone leading-relaxed max-w-[32rem]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
