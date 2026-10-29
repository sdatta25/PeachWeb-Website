// A screenshot of a live site inside minimal browser chrome.
export function Screenshot({ slug, alt, sizes, eager = false, className = '' }) {
  return (
    <img
      src={`/work/${slug}-1280.webp`}
      srcSet={`/work/${slug}-720.webp 720w, /work/${slug}-1280.webp 1280w`}
      sizes={sizes}
      alt={alt}
      width="1280"
      height="800"
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : undefined}
      decoding="async"
      className={`block h-auto w-full ${className}`}
    />
  )
}

export default function BrowserFrame({ url, children, className = '' }) {
  return (
    <div className={`frame ${className}`}>
      <div className="frame-bar" aria-hidden="true">
        <span className="frame-dot" /><span className="frame-dot" /><span className="frame-dot" />
        <span className="frame-url">{url.replace(/^https?:\/\//, '')}</span>
      </div>
      {children}
    </div>
  )
}
