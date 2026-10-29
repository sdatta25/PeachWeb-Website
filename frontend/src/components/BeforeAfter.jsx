import { useState } from 'react'

// Drag (or use arrow keys on) the handle to compare two screenshots.
// A native range input does the work, so it is keyboard and screen-reader accessible for free.
export default function BeforeAfter() {
  const [pos, setPos] = useState(50)

  return (
    <div className="grid-12 mt-32 items-center gap-y-8 border-t border-line pt-16 sm:mt-48 lg:pt-24">
      <div className="reveal col-span-4 sm:col-span-8 lg:col-span-4">
        <p className="mb-2 text-sm text-muted">Before and after</p>
        <h3 className="mb-4 text-h3">Our own site</h3>
        <p className="max-w-prose text-muted">
          The left side is the PeachWeb homepage before this redesign. It looked tidy, but our real work was hidden
          in a list of names. The new one puts screenshots of every site up front. Drag the handle
          to compare.
        </p>
      </div>

      <figure className="reveal col-span-4 sm:col-span-12 lg:col-span-8">
        <div className="frame relative select-none">
          <img
            src="/work/peachweb-after.webp"
            alt="The redesigned PeachWeb homepage"
            width="1280" height="800" loading="lazy" decoding="async"
            className="block h-auto w-full"
          />
          <img
            src="/work/peachweb-before.webp"
            alt="The previous PeachWeb homepage"
            width="1280" height="800" loading="lazy" decoding="async"
            className="absolute inset-0 block h-full w-full"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          />

          <span className="pointer-events-none absolute left-4 top-4 rounded bg-dark px-2 py-1 text-xs font-semibold text-cream">Before</span>
          <span className="pointer-events-none absolute right-4 top-4 rounded bg-burnt px-2 py-1 text-xs font-semibold text-cream">After</span>

          <input
            type="range" min="0" max="100" step="1"
            value={pos}
            onChange={e => setPos(+e.target.value)}
            aria-label="Compare the old and new PeachWeb homepage"
            aria-valuetext={`${pos}% old site`}
            className="ba-input absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            style={{ touchAction: 'pan-y' }}
          />

          {/* Divider and handle */}
          <div className="ba-divider pointer-events-none absolute inset-y-0 w-px bg-cream" style={{ left: `${pos}%` }} aria-hidden="true">
            <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-cream text-dark ba-handle">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg>
            </span>
          </div>
        </div>
        <figcaption className="mt-4 text-sm text-muted">Screenshots at 1440px wide.</figcaption>
      </figure>
    </div>
  )
}
