import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initSmoothScroll } from './lib/smoothScroll'

initSmoothScroll()
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
