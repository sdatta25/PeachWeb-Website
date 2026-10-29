import { PeachLogoFull } from './PeachLogo'
import { EMAIL, LOCATION, nav, socials } from '../content/site'

export default function Footer() {
  return (
    <footer className="on-dark bg-dark text-cream">
      <div className="page grid-12 gap-y-12 py-16">
        <div className="col-span-4 sm:col-span-12 lg:col-span-5">
          <a href="#top" aria-label="PeachWeb, back to top" className="inline-flex min-h-11 items-center rounded">
            <PeachLogoFull iconSize={30} uid="footer" textClassName="text-cream" />
          </a>
          <p className="mt-4 max-w-xs text-cream/80">Websites and AI chatbots for local businesses and nonprofits.</p>
        </div>

        <nav aria-label="Footer" className="col-span-2 sm:col-span-4 lg:col-span-2">
          <ul>
            {nav.map(l => (
              <li key={l.href}><a href={l.href} className="inline-flex min-h-11 items-center text-cream/80 hover:text-cream">{l.label}</a></li>
            ))}
            <li><a href="#faq" className="inline-flex min-h-11 items-center text-cream/80 hover:text-cream">FAQ</a></li>
          </ul>
        </nav>

        <div className="col-span-2 sm:col-span-4 lg:col-span-2">
          <ul>
            {socials.map(s => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center text-cream/80 hover:text-cream">
                  {s.label}<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <address className="col-span-4 not-italic sm:col-span-4 lg:col-span-3">
          <a href={`mailto:${EMAIL}`} className="inline-flex min-h-11 items-center text-orange [overflow-wrap:anywhere] hover:text-cream">{EMAIL}</a>
          <p className="mt-2 text-cream/80">{LOCATION}</p>
        </address>

        <p className="col-span-4 border-t border-cream/15 pt-8 text-sm text-cream/70 sm:col-span-12">© {new Date().getFullYear()} PeachWeb</p>
      </div>
    </footer>
  )
}
