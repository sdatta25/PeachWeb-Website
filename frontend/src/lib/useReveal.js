import { useEffect } from 'react'

// Fades `.reveal` elements up 12px as they enter the viewport. Does nothing when the
// visitor prefers reduced motion or IntersectionObserver is missing, so content is
// always visible without it.
export function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) return
    const root = document.documentElement
    const els = [...document.querySelectorAll('.reveal')]
    // Anything already on screen at load shows immediately instead of animating in.
    const vh = window.innerHeight
    els.forEach(el => { if (el.getBoundingClientRect().top < vh) el.classList.add('is-in') })
    root.classList.add('reveal-armed')
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      })
    }, { rootMargin: '0px 0px -8% 0px' })
    els.forEach(el => { if (!el.classList.contains('is-in')) io.observe(el) })
    return () => { io.disconnect(); root.classList.remove('reveal-armed') }
  }, [])
}

export function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
