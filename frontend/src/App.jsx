import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import ScrollToTop from './components/ScrollToTop'

// Hero sets its own top spacing; every other tab needs to clear the fixed navbar.
function Page({ children }) {
  return <div className="pt-16">{children}</div>
}

export default function App() {
  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full flex flex-col">
      <ScrollToTop />
      <Navbar onRequest={openModal} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Hero onRequest={openModal} />} />
          <Route path="/why" element={<Page><WhySection /></Page>} />
          <Route path="/what-we-build" element={<Page><WhatWeBuild /></Page>} />
          <Route path="/how-it-works" element={<Page><HowItWorks /></Page>} />
          <Route path="/founders" element={<Page><Founders /></Page>} />
          <Route path="/portfolio" element={<Page><Portfolio /></Page>} />
          <Route path="/contact" element={<Page><ContactSection onRequest={openModal} /></Page>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      {showModal && <RequestModal onClose={() => setShowModal(false)} />}
      <ChatWidget />
    </div>
  )
}
