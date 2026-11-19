// Loaded as a normal (blocking) script in index.html's <head>, so it still runs before the
// first paint. It lives in its own file so the site's Content Security Policy can forbid
// inline scripts.
// Decide, before the first paint, whether to play the opening animation. Doing it here lets the
// page background already be the intro's colour, so there is no flash of the real site.
// src/lib/intro.js reads this verdict. Rules:
//   - prefers-reduced-motion always wins: no intro, the real site loads straight away.
//   - Not shown again once seen in this browsing session (sessionStorage).
//   - Adding ?intro to the URL forces it, for replaying while you work on it.
(function () {
  try {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    var seen = sessionStorage.getItem('pw-intro-seen')
    var force = /[?&]intro(=|&|$)/.test(location.search)
    if (!reduce && (force || !seen)) document.documentElement.setAttribute('data-intro', 'playing')
  } catch (e) { /* storage unavailable: skip the intro rather than risk replaying it every visit */ }
})()
