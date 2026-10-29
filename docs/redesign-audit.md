# Design audit (before the redesign)

Audited at commit b5349bb on 1440px and 375px viewports.

The site is already more restrained than a typical template: there are no emoji icons,
gradient blobs, glassmorphism or Inter. The problems are about proof, structure and rhythm.

## What reads as "template" or "vibe coded"

1. **No real proof anywhere.** The hero shows "Corner Bakery", an invented sample site, and the
   portfolio is a list of names in large type with no screenshots. A visitor never sees a
   single page we actually built without leaving the site.
2. **A "Why choose us" section** ("What working with PeachWeb is like") that repeats claims
   made elsewhere (talk to the builders, small budgets, live portfolio).
3. **Identical rounded cards in a grid.** "What we build" is two matching `rounded-2xl` cards
   with an icon, a title, a paragraph and a checklist, then two more matching columns underneath.
4. **The same section header five times.** Why, What we build, Founders and Portfolio all use
   "big h2 on the left, grey paragraph on the right", so consecutive sections look alike.
5. **A crowded nav:** six links plus a button, which collapses to a hamburger below 1024px.
6. **The hero preview doesn't fit.** At 1440px the browser frame runs off the right edge, and
   the "sample site concept" caption is clipped behind the chat bubble.
7. **Pricing is buried.** The only price on the site ("Requests start under $500") sits inside
   the third bullet of the "why" list. There's no pricing section and no FAQ.
8. **The call to action is vague.** "Request a website" opens a long 8-field form. There is no
   low-commitment offer like a free mockup.
9. **Inconsistent spacing and type values:** ad-hoc sizes (0.95rem, 1.35rem, 1.85rem, 3.6rem,
   4.6rem) and margins (mb-7, mb-9, mb-14) that aren't on any scale.
10. **Shadows:** three different shadow styles (hero frame, modal `shadow-2xl`, chat panel).
11. **Contrast:** the step numbers in "How a project runs" use #EFA77E on ivory (about 2:1).
12. **Fonts load from Google Fonts** in a render-blocking stylesheet.
13. **Mobile:** the hero CTAs stack into two full-width buttons of different widths, and the
    mock frame sits under a long block of copy, about 1.5 screens down.

## Decisions taken

- Lead with real work: screenshots of the six live sites, captured from their URLs.
- Cut the "why" section; fold its one real fact (the starting price) into pricing.
- Services become a table, process becomes a timeline, founders become an editorial spread.
  Section layouts alternate so no two consecutive sections share a structure.
- Nav: logo, four links, one "Get a free mockup" button.
- Self-hosted Instrument Serif and Instrument Sans; an 8px spacing scale; a single shadow token.
- Burnt orange (#C1440E) for any small orange text; #E57A34 is only used for large display
  text and fills.

## Placeholders and open questions after the redesign

All of these live in `frontend/src/content/site.js` unless noted.

- **Pricing for "Website + AI chatbot" and "Care plan"** (`pricing[].price: null`). The site
  only ever published "starts under $500", so these show "Quoted after a call". In
  `npm run dev` they carry a visible PLACEHOLDER tag.
- **Quote estimator mapping** (`estimator`). The four output ranges are the budget brackets
  from the old request form. How answers add up to a bracket (pages 0/1/2; chatbot +1; store +1;
  booking +0.5; rounded down) is a guess to tune.
- **What the free mockup includes** (FAQ "What is the free mockup?"). Written as "a first
  design of your homepage". Confirm that's the offer.
- **Before/after slider** uses PeachWeb's own old and new homepage, because no client "before"
  screenshots exist. Swap in a client's old site (`public/work/peachweb-before.webp` /
  `-after.webp` and the copy in `components/BeforeAfter.jsx`) when you have one.
- **Chatbot demo** is a scripted conversation for a fictional "Fern & Flour Bakery" and is
  labelled as a demo in the UI.
- **Project one-liners** were written from what each live site says about itself (e.g.
  Finance For Movement's "youth-led 501(c)(3) ... Gwinnett County"). Worth a read-through.
