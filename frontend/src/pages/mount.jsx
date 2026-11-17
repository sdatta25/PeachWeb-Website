import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import { initSmoothScroll } from '../lib/smoothScroll'

// Every inner page's entry file calls this with its page component.
export function mount(Page) {
  initSmoothScroll()
  ReactDOM.createRoot(document.getElementById('root')).render(<Page />)
}
