import { useEffect, useState } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import MockupModal from './MockupModal'
import ChatWidget from './ChatWidget'
import { useReveal } from '../lib/useReveal'
import { warmBackend } from '../lib/api'

// The frame every page except the home page shares: header, footer, the chat widget, and the
// "Get a free mockup" dialog. `children` may be a function, which receives the callback that
// opens that dialog (for a page's own buttons).
export default function SiteLayout({ children }) {
  const [mockup, setMockup] = useState(false)
  const open = () => setMockup(true)
  useReveal()
  useEffect(() => { warmBackend() }, [])

  // A link to <page>#mockup opens the form directly.
  useEffect(() => {
    const check = () => { if (window.location.hash === '#mockup') setMockup(true) }
    check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  const close = () => {
    setMockup(false)
    if (window.location.hash === '#mockup') history.replaceState(null, '', window.location.pathname)
  }

  return (
    <>
      <a href="#main" className="btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]">
        Skip to content
      </a>
      <Nav onMockup={open} />
      <main id="main">{typeof children === 'function' ? children(open) : children}</main>
      <Footer />
      {mockup && <MockupModal onClose={close} />}
      <ChatWidget />
    </>
  )
}
