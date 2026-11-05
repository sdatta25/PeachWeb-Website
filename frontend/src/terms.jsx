import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import LegalPage from './components/LegalPage'
import { terms } from './content/legal'
import { initSmoothScroll } from './lib/smoothScroll'

initSmoothScroll()
ReactDOM.createRoot(document.getElementById('root')).render(<LegalPage doc={terms} />)
