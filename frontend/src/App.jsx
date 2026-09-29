import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhySection from './components/WhySection'
import WhatWeBuild from './components/WhatWeBuild'
import HowItWorks from './components/HowItWorks'
import Founders from './components/Founders'
import Portfolio from './components/Portfolio'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import RequestModal from './components/RequestModal'
import ChatWidget from './components/ChatWidget'

export default function App() {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full">
      <Navbar onRequest={() => setShowModal(true)} />
      <Hero onRequest={() => setShowModal(true)} />
      <WhySection />
      <WhatWeBuild />
      <HowItWorks />
      <Founders />
      <Portfolio />
      <ContactSection onRequest={() => setShowModal(true)} />
      <Footer />
      {showModal && <RequestModal onClose={() => setShowModal(false)} />}
      <ChatWidget />
    </div>
  )
}
