import { useEffect, useRef, useState } from 'react'
import { steps } from '../content/site'
import { usePrefersReducedMotion } from '../lib/useReveal'

// A five-step timeline whose orange line fills as the section scrolls through the viewport.
// Horizontal from 1024px up, vertical below.
export default function Process() {
  const reduce = usePrefersReducedMotion()
  const [progress, setProgress] = useState(reduce ? 1 : 0)
  const ref = useRef(null)

  useEffect(() => {
    if (reduce) return
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the list's top reaches 80% down the screen, 1 when its bottom reaches 60%.
      const p = (vh * 0.8 - r.top) / (r.height + vh * 0.2)
      // Only ever moves forward, so scrolling back up doesn't un-fill the timeline.
      setProgress(prev => Math.max(prev, Math.min(1, Math.max(0, p))))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  const last = steps.length - 1

  return (
    <section id="process" aria-labelledby="process-heading" className="on-dark bg-dark py-16 text-cream sm:py-24 lg:py-32">
      <div className="page">
        <div className="grid-12 mb-16 lg:mb-24">
          <p className="reveal col-span-4 mb-4 text-sm font-semibold text-orange sm:col-span-12">How a project runs</p>
          <h2 id="process-heading" className="reveal col-span-4 text-h2 sm:col-span-9 lg:col-span-8">
            Five steps from first call to a site you can run yourself.
          </h2>
        </div>

        <ol ref={ref} className="relative grid gap-12 lg:grid-cols-5 lg:gap-8">
          {/* Track and fill: vertical on phones, horizontal on desktop. */}
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-cream/20 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto" />
          <span
            aria-hidden="true"
            className="tl-fill absolute bottom-2 left-[7px] top-2 w-px origin-top bg-orange lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto lg:origin-left"
            style={{ '--p': progress }}
          />
          {steps.map((s, i) => {
            const on = progress >= (i / last) * 0.92
            return (
              <li
                key={s.name}
                className={`relative pl-12 transition-transform duration-500 ease-out lg:pl-0 lg:pt-12 ${on ? '' : 'translate-y-3'}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-4 w-4 rounded-full border transition-colors duration-300 ${
                    on ? 'border-orange bg-orange' : 'border-cream/40 bg-dark'
                  }`}
                />
                <p className="mb-2 text-sm tabular-nums text-cream/70">Step {i + 1}</p>
                <h3 className="mb-4 text-h3">{s.name}</h3>
                <p className="max-w-[22rem] text-cream/80">{s.text}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
