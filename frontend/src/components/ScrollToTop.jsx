import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Browsers keep the scroll position across client-side navigations, which lands
// you halfway down a freshly opened tab. Reset it on every path change.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}
