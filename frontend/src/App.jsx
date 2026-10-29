import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Services from './components/Services'
import Process from './components/Process'
import Team from './components/Team'
import Pricing from './components/Pricing'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import MockupModal from './components/MockupModal'
import ChatWidget from './components/ChatWidget'
import { useReveal } from './lib/useReveal'

export default function App() {
  const [mockup, setMockup] = useState(false)
  const open = () => setMockup(true)
  useReveal()

  // Links to /#mockup (from the 404 page, emails, social bios) open the form directly.
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
      <main id="main">
        <Hero onMockup={open} />
        <Work />
        <Services />
        <Pricing />
        <Process />
        <Team />
        <Faq />
        <FinalCta onMockup={open} />
      </main>
      <Footer />
      {mockup && <MockupModal onClose={close} />}
      <ChatWidget />
    </>
  )
}
