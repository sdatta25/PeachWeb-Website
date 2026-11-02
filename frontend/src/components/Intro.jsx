import { useEffect, useRef, useState } from 'react'
import { INTRO_HOLD_MS, WIPE_MS, SKIP_AFTER_MS, WIPE_ANGLE } from '../lib/intro'
import './Intro.css'

// The opening fake-out. Phase 1 is a deliberately horrible 2000s website (pure HTML and CSS:
// no images, no scripts, no external requests). At INTRO_HOLD_MS a diagonal "wiper" sweeps
// across the screen and the whole parody is removed from the DOM, revealing the real site,
// which has been sitting underneath the whole time.
//
//   props.onWipe()  called when the wipe starts (the real site's entrance animation keys off it)
//   props.onDone()  called when the intro is finished or skipped; the parent then unmounts this
//
// Everything in the parody is aria-hidden, so screen readers never read it. The only
// accessible thing here is the "Skip intro" button.

// The satirical copy lives here so it is easy to change.
const MARQUEE = '★★★ WELCOME TO MY HOMEPAGE!!! ★★★ BEST VIEWED AT 800x600 ★★★ SIGN MY GUESTBOOK ★★★ '
const SITE_TITLE = "~*~ JOE'S PLUMBING & MORE!!! ~*~"

function Popup({ className, title, icon, children }) {
  return (
    <div className={`xp ${className}`}>
      <div className="xp-bar">
        <span>{title}</span>
        <span className="xp-btns">
          <span className="xp-btn">_</span>
          <span className="xp-btn">□</span>
          <span className="xp-btn x">×</span>
        </span>
      </div>
      <div className="xp-body">
        <span className={`xp-icon ${icon}`}>{icon === 'warn' ? '!' : icon === 'win' ? '$' : 'i'}</span>
        <p>{children}</p>
      </div>
      <span className="xp-ok">OK</span>
    </div>
  )
}

function TrashSite() {
  return (
    <div className="tr" aria-hidden="true">
      <div className="tr-marquee"><span className="tr-marquee-in">{MARQUEE}{MARQUEE}</span></div>

      <div className="tr-title">{SITE_TITLE}</div>
      <div className="tr-rainbow" />

      <div className="tr-globe"><div className="tr-land" /></div>
      <div className="tr-new">NEW!</div>
      <div className="tr-click">CLICK HERE!!!<small>for FREE smileys</small></div>

      <p className="tr-body">
        We do <b className="c1">PLUMBING</b> and <b className="c2">MORE!!!</b>{' '}
        <b className="c3">CALL NOW 555-0199</b> satisfaction almost guaranteed
      </p>
      <p className="tr-links">
        <u>HOME</u> | <u className="v">ABOUT US</u> | <u>LINKS</u> | <u className="v">GUESTBOOK</u> | <u>LINKS 2</u>
      </p>

      <div className="tr-counter">YOU ARE VISITOR #000042</div>
      <div className="tr-construction"><span>UNDER CONSTRUCTION</span></div>

      {/* Exactly three, appearing together and overlapping. */}
      <Popup className="xp-a" title="Special Offer!" icon="info">Win a Free iPad from 2004!</Popup>
      <Popup className="xp-b" title="Winner!!!" icon="win">CONGRATULATIONS! You are our 1,000,000th visitor!</Popup>
      <Popup className="xp-c" title="Warning" icon="warn">ALERT: Your website design is outdated!</Popup>
    </div>
  )
}

export default function Intro({ onWipe, onDone }) {
  const layerRef = useRef(null)
  const bladeRef = useRef(null)
  const timers = useRef([])
  const anims = useRef([])
  const finished = useRef(false)
  const [canSkip, setCanSkip] = useState(false)
  const [wiping, setWiping] = useState(false)

  // Calls onDone exactly once, whichever way we get there (wipe finished, skipped, or no animation support).
  const finish = () => {
    if (finished.current) return
    finished.current = true
    onDone()
  }

  const startWipe = () => {
    setCanSkip(false)
    setWiping(true)
    onWipe()

    const layer = layerRef.current
    const blade = bladeRef.current
    if (!layer || !blade || !layer.animate) { finish(); return }

    // The cut line runs from (p, 0) at the top to (p - slant, H) at the bottom, so it leans
    // like a "/" and sweeps left to right. Everything to its right is still the parody,
    // everything to its left is the real site. The blade rides along the line.
    const W = window.innerWidth
    const H = window.innerHeight
    const slant = Math.round(H * Math.tan((WIPE_ANGLE * Math.PI) / 180))
    const BLADE = 30
    const end = W + slant + BLADE
    const cut = p => `polygon(${p}px 0, 100% 0, 100% 100%, ${p - slant}px 100%)`
    const timing = { duration: WIPE_MS, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'forwards' }

    const bladeAt = p => `translateX(${p - BLADE}px) skewX(-${WIPE_ANGLE}deg)`
    anims.current = [
      layer.animate([{ clipPath: cut(0) }, { clipPath: cut(end) }], timing),
      blade.animate([{ transform: bladeAt(0) }, { transform: bladeAt(end) }], timing),
    ]
    blade.style.opacity = '1'
    anims.current[0].onfinish = finish
  }

  const skip = () => {
    timers.current.forEach(clearTimeout)
    anims.current.forEach(a => a.cancel())
    finish()
  }

  useEffect(() => {
    timers.current = [
      setTimeout(() => setCanSkip(true), SKIP_AFTER_MS),
      setTimeout(startWipe, INTRO_HOLD_MS),
    ]
    return () => {
      timers.current.forEach(clearTimeout)
      anims.current.forEach(a => a.cancel())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={wiping ? 'intro is-wiping' : 'intro'}>
      <div className="intro-layer" ref={layerRef}>
        <TrashSite />
      </div>
      <span className="intro-blade" ref={bladeRef} aria-hidden="true" />
      {canSkip && (
        <button type="button" className="intro-skip" onClick={skip}>Skip intro</button>
      )}
    </div>
  )
}
