// Fast, even in-page scrolling for links like <a href="#pricing">.
//
// The browser's built-in smooth scroll (CSS scroll-behavior) takes longer the further it has to
// go, which feels slow on this long page. This eases every jump over a short, fixed time instead.
// - Visitors who ask for reduced motion get an instant jump.
// - Only links to an element that exists are handled; anything else (such as #mockup, which opens
//   the form) is left to the browser and the page's own hashchange listener.
// - The target is re-measured on every frame, so the mobile menu closing mid-scroll cannot make
//   the page land in the wrong place.
// - Wheel, touch and keyboard scrolling are untouched, and any of them cancels a jump in progress.

const DURATION = 450 // ms
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) // easeInOutCubic

function offsetTop(el) {
  // Honours the CSS scroll-margin-top the sections already use to clear the sticky header.
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - margin)
}

export function initSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0

  const cancel = () => { if (frame) { cancelAnimationFrame(frame); frame = 0 } }

  const scrollToEl = el => {
    cancel()
    const from = window.scrollY
    if (reduce.matches || Math.abs(offsetTop(el) - from) < 2) {
      window.scrollTo(0, offsetTop(el))
      return
    }
    const start = performance.now()
    const step = now => {
      const t = Math.min(1, (now - start) / DURATION)
      window.scrollTo(0, from + (offsetTop(el) - from) * ease(t))
      frame = t < 1 ? requestAnimationFrame(step) : 0
    }
    frame = requestAnimationFrame(step)
  }

  const onClick = e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = e.target.closest && e.target.closest('a[href^="#"]')
    if (!a || a.target === '_blank') return
    const hash = a.getAttribute('href')
    if (hash.length < 2) return
    let el = null
    try { el = document.getElementById(decodeURIComponent(hash.slice(1))) } catch { /* malformed hash */ }
    if (!el) return

    e.preventDefault()
    scrollToEl(el)
    if (window.location.hash !== hash) history.pushState(null, '', hash)
    // Keep keyboard and screen-reader users in step with what the link scrolled to.
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }

  document.addEventListener('click', onClick)
  // The visitor taking over cancels the jump so the page never fights their hand.
  const stop = { passive: true }
  window.addEventListener('wheel', cancel, stop)
  window.addEventListener('touchstart', cancel, stop)
  window.addEventListener('keydown', e => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) cancel() })
}
