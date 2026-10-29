import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/useReveal'

// Drag (or use arrow keys on) the handle to compare two screenshots.
// A native range input does the work, so it is keyboard and screen-reader accessible for free.
// `pos` is how much of the frame, in percent, shows the "before" image.
export default function BeforeAfter() {
  const reduce = usePrefersReducedMotion()
  const [pos, setPos] = useState(50)
  const [touched, setTouched] = useState(false)
  const frameRef = useRef(null)
  const touchedRef = useRef(false)

  // When the slider first scrolls into view, sweep it once so people see it moves.
  useEffect(() => {
    if (reduce || !frameRef.current) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const keys = [[0, 50], [900, 80], [2000, 20], [2900, 50]]
      const start = performance.now()
      const ease = t => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
      const tick = now => {
        if (touchedRef.current) return
        const t = now - start
        const i = keys.findIndex(([at]) => at > t)
        if (i === -1) { setPos(50); return }
        const [t0, p0] = keys[i - 1], [t1, p1] = keys[i]
        setPos(p0 + (p1 - p0) * ease((t - t0) / (t1 - t0)))
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(frameRef.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [reduce])

  const onInput = e => {
    touchedRef.current = true
    setTouched(true)
    setPos(+e.target.value)
  }

  const showingBefore = pos >= 50

  return (
    <div className="grid-12 mt-32 items-center gap-y-8 border-t border-line pt-16 sm:mt-48 lg:pt-24">
      <div className="reveal col-span-4 sm:col-span-8 lg:col-span-4">
        <p className="mb-2 text-sm text-muted">Before and after</p>
        <h3 className="mb-4 text-h3">From cluttered to clear</h3>
        <p className="max-w-prose text-muted">
          On the left is the kind of do-it-yourself site a lot of local businesses are stuck with: cluttered, hard to
          read, and the phone number buried halfway down. On the right is a site we designed. Drag the handle to
          compare.
        </p>
      </div>

      <figure className="reveal col-span-4 sm:col-span-12 lg:col-span-8">
        <div ref={frameRef} className="frame relative select-none">
          <img
            src="/work/peachweb-after.webp"
            alt="The PeachWeb homepage, designed by us"
            width="1280" height="800" loading="lazy" decoding="async"
            className="block h-auto w-full"
          />
          <img
            src="/work/example-before.webp"
            alt="A made-up example of a cluttered do-it-yourself small-business website"
            width="1280" height="800" loading="lazy" decoding="async"
            className="absolute inset-0 block h-full w-full"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          />

          {/* One label at a time, for whichever site fills most of the frame. */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute top-4 rounded px-4 py-2 text-sm font-semibold text-cream ${
              showingBefore ? 'left-4 bg-dark' : 'right-4 bg-burnt'
            }`}
          >
            {showingBefore ? 'Before' : 'After'}
          </span>

          <input
            type="range" min="0" max="100" step="1"
            value={Math.round(pos)}
            onChange={onInput}
            onPointerDown={() => { touchedRef.current = true; setTouched(true) }}
            aria-label="Compare a cluttered example site with a site we designed"
            aria-valuetext={showingBefore ? `Mostly the before site, ${Math.round(pos)}%` : `Mostly the after site, ${100 - Math.round(pos)}%`}
            className="ba-input absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            style={{ touchAction: 'pan-y' }}
          />

          {/* Divider and handle */}
          <div
            className="ba-divider pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-cream shadow-[0_0_0_1px_rgb(var(--dark)/0.5)]"
            style={{ left: `${pos}%` }}
            aria-hidden="true"
          >
            <span className="ba-handle absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-cream bg-burnt text-cream shadow-frame">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
              </svg>
            </span>
            <span
              className={`absolute left-1/2 top-1/2 mt-10 -translate-x-1/2 whitespace-nowrap rounded bg-dark px-2 py-1 text-xs font-semibold text-cream transition-opacity duration-300 ${
                touched ? 'opacity-0' : 'opacity-100'
              }`}
            >
              Drag to compare
            </span>
          </div>
        </div>
        <figcaption className="mt-4 text-sm text-muted">
          "Before" is an illustration of a made-up business, not a real site. "After" is our own homepage.
        </figcaption>
      </figure>
    </div>
  )
}
