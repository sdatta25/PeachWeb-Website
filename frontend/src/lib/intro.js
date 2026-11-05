// Settings and the play/skip decision for the opening animation (src/components/Intro.jsx):
// a peach screen where the PeachWeb logo builds in, then the screen lifts away to reveal the site.

// How long the logo screen stays up before it lifts.
export const INTRO_HOLD_MS = 1150
// How long the lift takes. The whole opening is about 1.8s.
export const LIFT_MS = 650

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
