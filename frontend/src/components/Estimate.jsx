import QuoteEstimator from './QuoteEstimator'

export default function Estimate() {
  return (
    <section id="estimate" aria-labelledby="estimate-heading" className="bg-cream py-16 sm:py-24 lg:py-32">
      <div className="page grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-12 lg:col-span-5">
          <h2 id="estimate-heading" className="reveal mb-6 text-h2">What would your website cost?</h2>
          <p className="reveal max-w-prose text-muted">
            Answer three quick questions for a rough range. Most projects land between $500 and $2,000,
            depending on how many pages you need and which extras you add. We'll give you a real number
            after a short call.
          </p>
        </div>

        <div className="reveal col-span-4 sm:col-span-12 lg:col-span-6 lg:col-start-7">
          <QuoteEstimator />
        </div>
      </div>
    </section>
  )
}
