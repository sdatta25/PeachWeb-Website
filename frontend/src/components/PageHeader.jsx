// The title block at the top of every inner page. It carries the page's only <h1>.
export default function PageHeader({ label, title, children }) {
  return (
    <section aria-labelledby="page-title" className="on-peach bg-peach pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className="page grid-12">
        <div className="col-span-4 sm:col-span-12 lg:col-span-9">
          {label && <p className="mb-4 text-sm font-semibold text-burnt">{label}</p>}
          <h1 id="page-title" className="mb-6 text-h2 text-dark">{title}</h1>
          {children && <div className="max-w-prose space-y-4 text-lg text-muted">{children}</div>}
        </div>
      </div>
    </section>
  )
}
