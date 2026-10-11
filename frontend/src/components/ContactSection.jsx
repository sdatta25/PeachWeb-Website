export default function ContactSection({ onRequest }) {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="on-dark w-full bg-charcoal text-ivory py-24 lg:py-32">
      <div className="page grid lg:grid-cols-12 gap-x-8 gap-y-12">
        <div className="lg:col-span-7">
          <h2 id="contact-heading" className="font-display font-medium text-[2.6rem] sm:text-6xl leading-[1.04] mb-7 max-w-[14ch]">
            Tell us about your business.
          </h2>
          <p className="text-mist text-lg leading-relaxed max-w-[34rem] mb-10">
            Send a request with a few details and we'll reply within 1–2 business days to set up a call.
            Not sure yet? Email a question, or ask Peachy in the corner of the page.
          </p>
          <button onClick={onRequest} className="btn-on-dark px-6 py-3.5 text-base">
            Request a website
          </button>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 self-end">
          <div className="border-t border-ivory/20 pt-6">
            <h3 className="font-sans text-sm font-semibold text-mist mb-2" style={{ letterSpacing: 0 }}>Email us directly</h3>
            <a
              href="mailto:peachwebdevelopment@gmail.com"
              className="font-display text-xl sm:text-[1.6rem] text-peach hover:text-peach-soft transition-colors [overflow-wrap:anywhere]"
            >
              peachwebdevelopment@gmail.com
            </a>
            <p className="text-sm text-mist mt-4">We usually reply within 1–2 business days.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
