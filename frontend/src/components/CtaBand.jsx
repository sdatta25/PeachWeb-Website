// The closing call to action on inner pages. The full request form lives on /contact; this
// opens the same form in a dialog.
export default function CtaBand({ onMockup }) {
  return (
    <section aria-labelledby="cta-band-heading" className="on-peach bg-peach py-16 sm:py-20">
      <div className="page grid-12 items-center gap-y-8">
        <div className="col-span-4 sm:col-span-12 lg:col-span-7">
          <h2 id="cta-band-heading" className="reveal mb-4 text-h2">See your new site before you pay a thing.</h2>
          <p className="reveal max-w-prose text-lg">
            Tell us about your business and we'll design a first look at your homepage, free. We reply within 1–2
            business days.
          </p>
        </div>
        <div className="reveal col-span-4 flex flex-col gap-4 sm:col-span-12 sm:flex-row lg:col-span-5 lg:justify-end">
          <button onClick={onMockup} className="btn-primary">Get a free mockup</button>
          <a href="/contact" className="btn-line">Contact us</a>
        </div>
      </div>
    </section>
  )
}
