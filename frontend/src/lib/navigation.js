// Page-to-page behaviour shared by every page (called from initSmoothScroll).
//
// 1. A reload starts at the top of the page. Browsers normally put you back where you were,
//    and a leftover #section in the address would jump there too. Back and forward still
//    return you to where you were on the previous page.
// 2. Pages you are likely to open next are fetched ahead of time, so a click feels instant:
//    Chromium does it from the speculation rules below, other browsers when a link is hovered
//    or touched.

function startReloadsAtTop() {
  const nav = performance.getEntriesByType('navigation')[0]
  if (!nav || nav.type !== 'reload') return
  history.scrollRestoration = 'manual'
  if (window.location.hash && window.location.hash !== '#mockup') {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
  const top = () => window.scrollTo(0, 0)
  top()
  window.addEventListener('pageshow', top, { once: true })
}

const isPage = a =>
  a && a.origin === window.location.origin && !a.hasAttribute('download') && a.target !== '_blank' &&
  !/\.[a-z0-9]+$/i.test(a.pathname) && a.pathname !== window.location.pathname

function prefetchPages() {
  if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
    const rules = document.createElement('script')
    rules.type = 'speculationrules'
    rules.textContent = JSON.stringify({
      prefetch: [{ where: { and: [{ href_matches: '/*' }, { not: { href_matches: '/*.*' } }] }, eagerness: 'moderate' }],
    })
    document.head.appendChild(rules)
    return
  }
  const done = new Set()
  const warm = e => {
    const a = e.target.closest && e.target.closest('a[href]')
    if (!isPage(a) || done.has(a.pathname)) return
    done.add(a.pathname)
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = a.pathname
    document.head.appendChild(link)
  }
  document.addEventListener('pointerover', warm, { passive: true })
  document.addEventListener('touchstart', warm, { passive: true })
}

export function initNavigation() {
  startReloadsAtTop()
  prefetchPages()
}
