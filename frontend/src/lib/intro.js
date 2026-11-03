// Settings and the play/skip decision for the opening "fake-out" intro
// (src/components/Intro.jsx): a deliberately awful 2000s website that gets wiped away
// to reveal the real one.

// How long the awful site stays on screen before the wipe starts.
export const INTRO_HOLD_MS = 1100
// How long the wipe itself takes.
export const WIPE_MS = 500
// The "Skip intro" button appears this long after load.
export const SKIP_AFTER_MS = 300
// Angle of the wiper blade, in degrees from vertical.
export const WIPE_ANGLE = 20

const SEEN_KEY = 'pw-intro-seen'

// The verdict is made by the inline script in index.html, before first paint, so the page
// background can already be the intro's colour. It sets <html data-intro="playing"> when:
//   - the visitor has NOT asked their OS for reduced motion (that always wins), and
//   - they have not already seen the intro in this browsing session (sessionStorage), or
//     the URL carries ?intro (handy for replaying it while you work on it).
// We read that verdict here and record the visit so reloads and later visits skip it.
function decide() {
  if (typeof document === 'undefined') return false
  const play = document.documentElement.getAttribute('data-intro') === 'playing'
  if (play) {
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch { /* storage blocked: harmless, it just may replay */ }
  }
  return play
}

export const PLAY_INTRO = decide()
