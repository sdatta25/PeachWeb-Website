import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { PeachLogoFull } from './PeachLogo'
import { EMAIL, LOCATION, nav, socials } from '../content/site'

// Keyed by the `label` in content/site.js `socials`, so adding a network there only needs a line here.
const socialIcons = { LinkedIn: Linkedin, Instagram, Facebook }

// `base` is '' on the home page (links are in-page anchors like #work) and '/' on other pages
// (so the same links lead back to the home page).
export default function Footer({ base = '' }) {
  return (
    <footer className="on-dark bg-dark text-cream">
      <div className="page grid-12 gap-y-12 py-16">
        <div className="col-span-4 sm:col-span-12 lg:col-span-5">
          <a href={`${base}#top`} aria-label="PeachWeb, back to top" className="inline-flex min-h-11 items-center rounded">
            <PeachLogoFull iconSize={30} uid="footer" textClassName="text-cream" />
          </a>
          <p className="mt-4 max-w-xs text-cream/80">Websites and AI chatbots for local businesses and nonprofits.</p>
        </div>

        <nav aria-label="Footer" className="col-span-2 sm:col-span-4 lg:col-span-2">
          <ul>
            {nav.map(l => (
              <li key={l.href}><a href={`${base}${l.href}`} className="inline-flex min-h-11 items-center text-cream/80 hover:text-cream">{l.label}</a></li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 sm:col-span-4 lg:col-span-2">
          <ul>
            {socials.map(s => {
              const Icon = socialIcons[s.label]
              return (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2.5 text-cream/80 hover:text-cream">
                    {Icon && <Icon aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.75} />}
                    {s.label}<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <address className="col-span-4 not-italic sm:col-span-4 lg:col-span-3">
          <a href={`mailto:${EMAIL}`} className="inline-flex min-h-11 items-center text-orange [overflow-wrap:anywhere] hover:text-cream">{EMAIL}</a>
          <p className="mt-2 text-cream/80">{LOCATION}</p>
        </address>

        <div className="col-span-4 flex flex-col gap-x-8 gap-y-1 border-t border-cream/15 pt-6 text-sm text-cream/70 sm:col-span-12 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PeachWeb</p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6">
              <li><a href="/privacy" className="inline-flex min-h-11 items-center underline decoration-cream/30 underline-offset-4 hover:text-cream hover:decoration-cream">Privacy Policy</a></li>
              <li><a href="/terms" className="inline-flex min-h-11 items-center underline decoration-cream/30 underline-offset-4 hover:text-cream hover:decoration-cream">Terms of Service</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
