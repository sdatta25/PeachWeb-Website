import { useEffect, useRef, useState } from 'react'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// A looping, scripted demo of a visitor using a small-business site: open the menu,
// add an item, fill in an order, send it. It is a sample, not a real client site.
export default function HeroPreview() {
  const stageRef = useRef(null)
  const cursorRef = useRef(null)
  const [scene, setScene] = useState('home')
  const [added, setAdded] = useState(false)
  const [typed, setTyped] = useState('')
  const [focused, setFocused] = useState(false)
  const [sent, setSent] = useState(false)
  const [pressed, setPressed] = useState('')
  const [ripple, setRipple] = useState(0)

  useEffect(() => {
    const stage = stageRef.current
    const cursor = cursorRef.current
    if (!stage || !cursor) return

    let alive = true
    let visible = true
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(stage)

    // Pauses the script while the demo is off screen or the tab is hidden.
    const wait = async (ms) => {
      await sleep(ms)
      while (alive && (!visible || document.hidden)) await sleep(300)
    }

    const place = (id, dx = 0.5, dy = 0.5, instant = false) => {
      const el = stage.querySelector(`[data-pv="${id}"]`)
      if (!el) return
      const s = stage.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      cursor.style.transition = instant ? 'none' : ''
      cursor.style.transform = `translate(${r.left - s.left + r.width * dx}px, ${r.top - s.top + r.height * dy}px)`
    }

    const moveTo = async (id, dx, dy) => {
      place(id, dx, dy)
      await wait(950)
    }

    const click = async (id) => {
      setPressed(id)
      setRipple(n => n + 1)
      await wait(180)
      setPressed('')
    }

    const park = () => {
      cursor.style.transform = `translate(${stage.clientWidth * 0.86}px, ${stage.clientHeight * 0.92}px)`
    }

    const run = async () => {
      while (alive) {
        setScene('home'); setAdded(false); setTyped(''); setFocused(false); setSent(false)
        park()
        await wait(1200)

        await moveTo('btn-menu', 0.35, 0.55)
        await click('btn-menu')
        setScene('menu')
        await wait(900)

        await moveTo('add-btn', 0.5, 0.5)
        await click('add-btn')
        setAdded(true)
        await wait(800)

        await moveTo('nav-order', 0.5, 0.5)
        await click('nav-order')
        setScene('order')
        await wait(900)

        await moveTo('fld-name', 0.25, 0.5)
        await click('fld-name')
        setFocused(true)
        for (const ch of 'Jane Smith') {
          setTyped(t => t + ch)
          await wait(95)
        }
        await wait(500)

        await moveTo('btn-send', 0.4, 0.5)
        setFocused(false)
        await click('btn-send')
        setSent(true)
        await wait(3200)
      }
    }

    if (reduceMotion) {
      // A single still frame: the menu with the item added and the cursor resting on it.
      setScene('menu'); setAdded(true)
      const t = setTimeout(() => place('add-btn', 0.55, 0.5, true), 80)
      const onResize = () => place('add-btn', 0.55, 0.5, true)
      window.addEventListener('resize', onResize)
      return () => { clearTimeout(t); window.removeEventListener('resize', onResize); io.disconnect() }
    }

    run()
    return () => { alive = false; io.disconnect() }
  }, [])

  const isPressed = (id) => (pressed === id ? ' pv-pressed' : '')

  return (
    <div className="pv-frame">
      <div className="pv-bar">
        <span className="pv-dot" /><span className="pv-dot" /><span className="pv-dot" />
        <span className="pv-url">yourbusiness.com</span>
      </div>

      <div className="pv-stage" ref={stageRef}>
        <div className="pv-nav">
          <span className="pv-logo">Corner Bakery</span>
          <span className="pv-links">
            <span>Menu</span>
            <span>Hours</span>
            <span data-pv="nav-order" className={'pv-navbtn' + isPressed('nav-order')}>
              Order{added ? ' (1)' : ''}
            </span>
          </span>
        </div>

        {scene === 'home' && (
          <div className="pv-scene pv-home" key="home">
            <p className="pv-kicker">Family bakery, Roswell</p>
            <p className="pv-h">Fresh bread, baked every morning.</p>
            <p className="pv-sub">Sourdough, rolls, and cakes made to order.</p>
            <span data-pv="btn-menu" className={'pv-btn' + isPressed('btn-menu')}>See the menu</span>
          </div>
        )}

        {scene === 'menu' && (
          <div className="pv-scene pv-menu" key="menu">
            <p className="pv-h pv-h-sm">Today's menu</p>
            {[
              ['Country sourdough', 'Slow-risen, crisp crust'],
              ['Honey oat loaf', 'Soft, good for sandwiches'],
              ['Butter rolls', 'Half dozen'],
            ].map(([name, note], i) => (
              <div className="pv-row" key={name}>
                <span className="pv-thumb" />
                <span className="pv-rowtext"><b>{name}</b><i>{note}</i></span>
                {i === 0 ? (
                  <span data-pv="add-btn" className={'pv-add' + (added ? ' pv-added' : '') + isPressed('add-btn')}>
                    {added ? 'Added' : 'Add'}
                  </span>
                ) : (
                  <span className="pv-add pv-add-idle">Add</span>
                )}
              </div>
            ))}
          </div>
        )}

        {scene === 'order' && (
          <div className="pv-scene pv-order" key="order">
            <p className="pv-h pv-h-sm">Your pickup order</p>
            <p className="pv-sub">1 × Country sourdough</p>
            <span className="pv-label">Name</span>
            <span data-pv="fld-name" className={'pv-field' + (focused ? ' pv-focus' : '')}>
              {typed}{focused && <span className="pv-caret" />}
            </span>
            {sent ? (
              <span className="pv-done" role="presentation">Order received. See you Saturday.</span>
            ) : (
              <span data-pv="btn-send" className={'pv-btn' + isPressed('btn-send')}>Send order</span>
            )}
          </div>
        )}

        <div className="pv-cursor" ref={cursorRef}>
          <span className="pv-ripple" key={ripple} style={{ display: ripple ? 'block' : 'none' }} />
          <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
            <path d="M5 3l14 8-6.2 1.6L9.6 19z" fill="#3B2A20" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}
