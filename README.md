# PeachWeb

A professional web development company website that builds custom websites and AI chatbots for local businesses and organizations.

## Project Overview

PeachWeb is a full-stack website with:
- **React + Vite + Tailwind CSS** frontend (port 5174), self-hosted Instrument Sans (the one typeface used site-wide)
- **Node.js + Express** backend (port 3002)
- **Nodemailer** for email notifications and auto-replies
- **Google Gemini** AI chatbot ("Peachy"), on the free tier

---

## Setup Instructions

### 1. Get a Gmail App Password (for Nodemailer)

Gmail requires an App Password instead of your regular password when using third-party apps.

1. Go to your Google Account → **Security**
2. Under "How you sign in to Google", enable **2-Step Verification** (required)
3. Search for **"App passwords"** in the search bar
4. Create a new App Password — name it "PeachWeb"
5. Copy the 16-character password shown

### 2. Get a Gemini API Key (for the AI Chatbot)

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and sign in with a Google account
2. Click **Create API key** (no credit card is needed for the free tier)
3. Copy the key

The key is a secret: it goes in the backend's environment only (`backend/.env` locally, and
the host's environment settings in production, e.g. Render > your service > Environment),
never in the frontend code.

### 3. Create the `.env` file

```bash
cd backend
cp .env.example .env
```

Then edit `backend/.env` and fill in your values:

```
EMAIL_USER=peachwebdevelopment@gmail.com
EMAIL_PASS=your_16_char_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
PORT=3002
```

---

## Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## Running the Project

You need two terminal windows — one for each server.

### Terminal 1 — Backend
```bash
cd backend
npm run dev
```
Backend will run at: **http://localhost:3002**

### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```
Frontend will run at: **http://localhost:5174**

Open **http://localhost:5174** in your browser.

---

## Admin: Viewing Inquiries

To view all submitted inquiries:
Set `ADMIN_KEY` in your environment to a long random string; the admin endpoints
refuse all requests until it is set.

```bash
curl -H "x-admin-key: $ADMIN_KEY" http://localhost:3002/api/inquiries
```

To update an inquiry's status:
```bash
curl -X PATCH -H "x-admin-key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"contacted"}' \
  http://localhost:3002/api/inquiries/<id>
```

---

## Project Structure

```
PeachWeb/
├── backend/
│   ├── server.js            # Express API: inquiries (email via relay) and the /api/chat route
│   ├── chat.js              # Peachy: system prompt + PeachWeb facts, and the Gemini call
│   └── .env.example
├── frontend/
│   ├── index.html           # SEO meta, Open Graph, JSON-LD, Search Console verification
│   ├── 404.html             # Custom 404 (Vercel serves it for unknown paths)
│   ├── api/send-email.js    # Vercel Function mail relay used by the backend
│   ├── public/
│   │   ├── work/            # Screenshots of the live portfolio sites (WebP)
│   │   ├── founders/        # Founder portraits
│   │   └── sitemap.xml, robots.txt, og-image.png, site.webmanifest
│   └── src/
│       ├── content/site.js  # ALL copy and data: projects, services, pricing, FAQ, estimator
│       ├── index.css        # Brand tokens (CSS variables), type, components
│       ├── lib/             # API URL, form submission, scroll-reveal hook
│       └── components/      # One file per section, in page order:
│           Intro (opening animation), Nav, Hero, Work (+BeforeAfter), Pricing
│           (+QuoteEstimator), Services (+ChatDemo), Process, Team, Faq, FinalCta,
│           Footer, MockupModal, ChatWidget (Peachy); LegalPage for /privacy and /terms
└── docs/redesign-audit.md   # Design audit and the placeholders still to fill
```

## Editing content

Change text, prices, projects, and FAQ answers in `frontend/src/content/site.js`; no layout
code needs to change. Pricing tiers with `price: null` show "Quoted after a call" on the live
site and a dark "PLACEHOLDER" tag in `npm run dev`.

To add a portfolio project, add an entry to `projects` and put three screenshots in
`frontend/public/work/`: `<slug>-1280.webp` and `<slug>-720.webp` (16:10 desktop) and
`<slug>-mobile.webp` (390x844).

## Opening animation

First-time visitors see a short (about 1.8s) opening: a peach screen where the PeachWeb logo builds in
(the peach, then the wordmark, then a one-line description), after which the screen slides up to
reveal the site while the hero text fades in.

- **Files:** `src/components/Intro.jsx` (the screen and its timing), `Intro.css` (all of its styling;
  transform and opacity only), `src/lib/intro.js` (the two timings and the play/skip decision), and the
  inline script in `index.html` that makes that decision before first paint.
- **When it plays:** only if the visitor has not asked their OS for reduced motion *and* has not already
  seen it in this browsing session (`sessionStorage` key `pw-intro-seen`). A click or the Escape key
  lifts it early. While it plays, the real site underneath is `inert` and the screen is `aria-hidden`;
  the screen is removed from the DOM once it has gone.
- **Replay it while working on it:** add `?intro` to the URL (e.g. `http://localhost:5174/?intro`).
  It still respects reduced motion.
- **Change it:** hold and lift times are in `src/lib/intro.js`, the description line is at the top of
  `Intro.jsx`, and the look is in `Intro.css`.
- **Turn it off entirely:** delete the inline `<script>` in `index.html` (with no script it never plays).

## Colours

The palette is built from the logo's peach and lives in `:root` in `src/index.css` (one line per
colour, with contrast notes). Peach (`--peach`) is the surface colour for the hero, pricing and final
call-to-action blocks, ink (`--dark`) is text and buttons, and `--burnt` is for small accent text.
Add the `on-peach` class to any new solid-peach section: it darkens secondary text there so it stays
readable.

## Privacy Policy and Terms of Service

Two real pages, `/privacy` and `/terms`, built from `privacy.html` / `terms.html` (so they are separate
entries in `vite.config.js`, like `404.html`) and `vercel.json` (`cleanUrls`, which serves `privacy.html` at
`/privacy`). Layout: `src/components/LegalPage.jsx`. **All the wording is in `src/content/legal.jsx`.**

- The copy was written from an audit of what the site and backend actually do. If you add analytics, a new
  form provider, an embed, or change where data goes, update `legal.jsx` in the same change.
- Retention periods and the response time are **placeholders**: search `legal.jsx` for `TODO(PLACEHOLDER)`.
  They show on the page as highlighted `[PLACEHOLDER: ...]` until you set `SHOW_PLACEHOLDERS` to `false`.
- Change `LAST_UPDATED` in `legal.jsx` whenever either document changes, and the `lastmod` in
  `public/sitemap.xml`.
- Both forms show "By submitting, you agree to our Privacy Policy" under their submit button, and the
  footer links to both pages.

## Forms

The "Get a free mockup" form and the quote estimator both POST to the backend's
`/api/inquiries`, which emails peachwebdevelopment@gmail.com and sends the visitor a
confirmation. Nothing extra to configure as long as the backend's email settings stay in place.

The mockup request is a three-step, one-question-at-a-time flow (`src/components/MockupFlow.jsx`): kind
of business (tap a card), about the business, then name and email. It is shown inline in the `#contact`
section and inside the modal (`MockupModal.jsx`) that the other "Get a free mockup" buttons open. It sends
exactly the payload the old single form did (`name`, `email`, `phone`, `organization`, `orgType`,
`services`, `description`), so the backend needed no change. If you change a step's content, re-measure the
`min-h` values on the step area (`data-flow-area`) so the card keeps a steady height.

## Peachy, the chatbot

Peachy writes each reply with Gemini from the visitor's message and the conversation so far,
grounded in the facts at the top of `backend/chat.js`. It also writes the follow-up question
chips under each answer. There are no scripted replies; the only fixed text is the opening
greeting and the "couldn't connect" fallback in `ChatWidget.jsx`.

- **Keep the facts current.** The backend deploys separately from the site, so it cannot read
  `frontend/src/content/site.js`. When prices, services, the process or projects change there,
  update the `KNOWLEDGE` block in `backend/chat.js` too, or Peachy will keep quoting the old version.
- **Models and limits.** `GEMINI_MODEL` takes one model ID or a comma-separated list tried in
  order, so a retired model (404) or one whose free quota is spent (429) falls through to the next.
  Free-tier quotas are per model and change over time; check the current numbers at
  [ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits).
  `CHAT_RATE_PER_MIN` caps each visitor so one person cannot use up the shared quota.
- **Privacy.** On Google's free tier, prompts and responses may be used to improve Google's
  products. The chat tells visitors not to share personal details, but if that matters for a
  client's chatbot, use a paid-tier key for them.
- **Check it is working.** `GET /api/health` shows `geminiKeySet` and the model list. A failing
  chat request logs `Chat error: <status> <code>` on the backend, and the JSON response includes
  `upstreamStatus` / `upstreamCode` (403 = key problem, 429 = quota, 404 = model name).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/inquiries` | Submit a new website request |
| GET | `/api/inquiries` | List all inquiries (admin key required) |
| PATCH | `/api/inquiries/:id` | Update inquiry status (admin key required) |
| POST | `/api/chat` | Chat with Peachy AI assistant |
