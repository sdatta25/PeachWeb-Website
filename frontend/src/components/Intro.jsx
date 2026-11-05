import { useEffect, useRef, useState } from 'react'
import { PeachIcon } from './PeachLogo'
import { INTRO_HOLD_MS, LIFT_MS } from '../lib/intro'
import './Intro.css'

// The opening animation: a peach screen where the logo builds in (the peach, then the wordmark,
// then a one-line description), which then slides up to reveal the real site. The site has been
// rendered underneath the whole time, so the reveal is instant and nothing shifts.
//
//   props.onLift()  called when the screen starts to lift (the hero's entrance keys off it)
//   props.onDone()  called when it has gone; the parent then unmounts this
//
// It is decorative (aria-hidden). A click or the Escape key lifts it early.

const TAGLINE = 'Websites and AI chatbots for local businesses'

export default function Intro({ onLift, onDone }) {
  const [lifting, setLifting] = useState(false)
  const timers = useRef([])
  const state = useRef({ lifted: false, done: false })

  const finish = () => {
    if (state.current.done) return
    state.current.done = true
    onDone()
  }

  const lift = () => {
    if (state.current.lifted) return
    state.current.lifted = true
    timers.current.forEach(clearTimeout)
    setLifting(true)
    onLift()
    // A timer rather than transitionend, so the page can never be left covered.
    timers.current = [setTimeout(finish, LIFT_MS + 60)]
  }

  useEffect(() => {
    timers.current = [setTimeout(lift, INTRO_HOLD_MS)]
    const onKey = e => { if (e.key === 'Escape') lift() }
    window.addEventListener('keydown', onKey)
    return () => {
      timers.current.forEach(clearTimeout)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className={lifting ? 'intro is-lifting' : 'intro'}
      style={{ '--lift': `${LIFT_MS}ms`, '--hold': `${INTRO_HOLD_MS}ms` }}
      onClick={lift}
      aria-hidden="true"
    >
      <div className="intro-lockup">
        <span className="intro-mark"><PeachIcon size={64} uid="intro" /></span>
        <span className="intro-word"><span>PeachWeb</span></span>
      </div>
      <p className="intro-tag">{TAGLINE}</p>
      <span className="intro-line" />
    </div>
  )
}
