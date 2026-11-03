import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Work from './components/Work'
import Services from './components/Services'
import Process from './components/Process'
import Team from './components/Team'
import Pricing from './components/Pricing'
import Estimate from './components/Estimate'
import Faq from './components/Faq'
import FinalCta from './components/FinalCta'
import Footer from './components/Footer'
import MockupModal from './components/MockupModal'
import ChatWidget from './components/ChatWidget'
import Intro from './components/Intro'
import { PLAY_INTRO } from './lib/intro'
import { useReveal } from './lib/useReveal'
import { warmBackend } from './lib/api'

export default function App() {
  const [mockup, setMockup] = useState(false)
  // The opening fake-out: 'playing' -> 'wiping' -> 'done'. Starts 'done' when it is not going
  // to run (reduced motion, already seen this session), so the real site loads straight away.
  const [intro, setIntro] = useState(PLAY_INTRO ? 'playing' : 'done')
  const siteRef = useRef(null)
  const open = () => setMockup(true)
  useReveal()
  useEffect(() => { warmBackend() }, [])

  // Mirror the phase onto <html> so the CSS can hide/animate the hero (see index.css), and keep
  // the real site out of the tab order and accessibility tree while the intro covers it.
  useEffect(() => {
    document.documentElement.setAttribute('data-intro', intro)
    if (siteRef.current) siteRef.current.inert = intro !== 'done'
  }, [intro])

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
      <div ref={siteRef}>
        <a href="#main" className="btn-primary sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]">
          Skip to content
        </a>
        <Nav onMockup={open} />
        <main id="main">
          <Hero onMockup={open} />
          <Estimate />
          <Work />
          {/* Pricing sits right after the proof, ahead of the detail. */}
          <Pricing />
          <Services />
          <Process />
          <Team />
          <Faq />
          <FinalCta onMockup={open} />
        </main>
        <Footer />
        {mockup && <MockupModal onClose={close} />}
        <ChatWidget />
      </div>
      {intro !== 'done' && <Intro onWipe={() => setIntro('wiping')} onDone={() => setIntro('done')} />}
    </>
  )
}
