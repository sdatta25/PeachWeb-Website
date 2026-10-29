import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { PeachLogoFull } from './components/PeachLogo'
import { EMAIL } from './content/site'

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="page flex h-[var(--nav-h)] items-center">
        <a href="/" className="flex min-h-11 items-center rounded" aria-label="PeachWeb home">
          <PeachLogoFull iconSize={30} />
        </a>
      </header>
      <main className="page grid-12 flex-1 content-center py-16">
        <div className="col-span-4 sm:col-span-10 lg:col-span-8">
          <p className="label mb-6">404</p>
          <h1 className="mb-6 text-h1">This page took a <em className="text-burnt">wrong turn.</em></h1>
          <p className="mb-10 max-w-prose text-lg text-muted">
            The link may be old, or the address may have a typo. Everything we do is on the homepage.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href="/" className="btn-primary">Go to the homepage</a>
            <a href="/#work" className="btn-line">See our work</a>
          </div>
          <p className="mt-10 text-sm text-muted">
            Looking for something specific? <a href={`mailto:${EMAIL}`} className="link text-dark">{EMAIL}</a>
          </p>
        </div>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<NotFound />)
