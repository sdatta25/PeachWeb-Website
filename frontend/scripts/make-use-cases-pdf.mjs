// Builds public/peachweb-use-cases.pdf from the use cases in src/content/site.js, so the PDF
// and the /use-cases page always say the same thing.
//
//   node scripts/make-use-cases-pdf.mjs
//
// It writes a print-styled HTML file and asks a locally installed Chrome or Edge to print it
// to PDF. Set BROWSER to the browser's path if it is not found automatically.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { EMAIL, LOCATION, projects, stack, steps, useCases } from '../src/content/site.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'peachweb-use-cases.pdf')
const SITE = 'www.peachwebatl.com'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const logo = readFileSync(join(root, 'public', 'favicon.svg'), 'utf8').replace(/<\?xml[^>]*>/, '')

const caseHtml = (u, i) => {
  const example = u.example && projects.find(p => p.slug === u.example)
  return `<section class="case${i > 0 && i % 2 === 0 ? ' first' : ''}">
    <p class="num">${String(i + 1).padStart(2, '0')}</p>
    <h2>${esc(u.name)}</h2>
    ${u.who ? `<p class="who">${esc(u.who)}</p>` : ''}
    <h3>The problem</h3>
    <p class="lead">${esc(u.problem)}</p>
    <h3>What we build</h3>
    <ul>${u.build.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
    <h3>How it connects</h3>
    <ol class="flow">${u.flow.map(f => `<li>${esc(f)}</li>`).join('')}</ol>
    ${example ? `<p class="example"><b>One we built:</b> ${esc(example.name)} (${esc(example.url.replace(/^https?:\/\//, ''))}). ${esc(example.line)}</p>` : ''}
  </section>`
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>PeachWeb use cases</title>
<style>
  @page { size: Letter; margin: 0.75in 0.8in; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Segoe UI', -apple-system, 'Helvetica Neue', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #2B1810; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  h1 { font-size: 34pt; line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 14pt; }
  h2 { font-size: 21pt; line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 4pt; }
  h3 { font-size: 9.5pt; margin: 10pt 0 3pt; color: #B04A14; }
  p { margin: 0 0 8pt; }
  ul { margin: 0; padding-left: 16pt; } li { margin-bottom: 3pt; }
  .cover { height: 9.4in; display: flex; flex-direction: column; justify-content: space-between; background: #FFBE8F; border-radius: 10pt; padding: 0.6in; page-break-after: always; }
  .brand { display: flex; align-items: center; gap: 10pt; font-size: 17pt; font-weight: 700; letter-spacing: -0.02em; }
  .brand svg { width: 30pt; height: 34pt; }
  .cover p.sub { font-size: 14pt; max-width: 5.2in; color: #50301C; }
  .cover .foot { font-size: 10.5pt; color: #50301C; max-width: 5.6in; }
  .cover .foot b { color: #2B1810; }
  .case { page-break-inside: avoid; break-inside: avoid; padding: 12pt 0 12pt; border-top: 1.5pt solid #2B1810; }
  .case.first { page-break-before: always; }
  .case + .case { margin-top: 10pt; }
  .num { font-size: 9.5pt; color: #7A4E36; margin: 0 0 2pt; }
  .who { color: #7A4E36; font-size: 10pt; margin: 0; }
  .lead { font-size: 11.5pt; }
  .flow { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 5pt 0; counter-reset: s; }
  .flow li { background: #FFE7D3; border-radius: 4pt; padding: 4pt 8pt; font-size: 9.5pt; font-weight: 600; margin: 0 14pt 0 0; position: relative; }
  .flow li:not(:last-child)::after { content: '\\2192'; position: absolute; right: -12pt; color: #B04A14; }
  .example { margin-top: 12pt; font-size: 10pt; color: #7A4E36; }
  .panel { page-break-before: always; font-size: 10pt; }
  .panel h2 { font-size: 17pt; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 22pt; border-top: 1.5pt solid #2B1810; margin-top: 10pt; }
  .grid div { padding: 7pt 0; border-bottom: 0.75pt solid #F0C4A0; break-inside: avoid; }
  .grid b { display: block; font-size: 12pt; } .grid i { font-style: normal; color: #B04A14; font-size: 9.5pt; display: block; margin-bottom: 3pt; }
  .steps { counter-reset: st; list-style: none; padding: 0; margin: 10pt 0 0; border-top: 1.5pt solid #2B1810; }
  .steps li { padding: 5pt 0; border-bottom: 0.75pt solid #F0C4A0; }
  .cta { margin-top: 14pt; font-size: 10.5pt; background: #2B1810; color: #FFFAF5; border-radius: 8pt; padding: 12pt 16pt; }
  .cta b { color: #FFBE8F; font-size: 13pt; display: block; margin-bottom: 4pt; }
</style></head><body>
  <div class="cover">
    <div class="brand">${logo}<span>PeachWeb</span></div>
    <div>
      <h1>What a site does for a business like yours.</h1>
      <p class="sub">Six use cases: the problem each kind of business has online, what we build for it, and how a customer's request gets from the page to your inbox.</p>
    </div>
    <div class="foot">
      <p><b>See your new site before you pay a thing.</b> Tell us about your business and we will design a first look at your homepage, free. Projects run from $500 to $2,000.</p>
      <p>${SITE}/contact &nbsp;·&nbsp; ${esc(EMAIL)} &nbsp;·&nbsp; ${esc(LOCATION)}</p>
    </div>
  </div>

  ${useCases.map(caseHtml).join('\n')}

  <section class="panel">
    <h2>What is under every site</h2>
    <p>Our own site runs on the same pieces we build for clients, so you can try them before you hire us.</p>
    <div class="grid">${stack.map(s => `<div><b>${esc(s.name)}</b><i>${esc(s.tools)}</i>${esc(s.text)}</div>`).join('')}</div>

    <h2 style="margin-top:18pt">How a project runs</h2>
    <ol class="steps">${steps.map((s, i) => `<li><b>${i + 1}. ${esc(s.name)}.</b> ${esc(s.text)}</li>`).join('')}</ol>

  </section>
</body></html>`

const candidates = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].filter(Boolean)
const browser = candidates.find(existsSync)
if (!browser) throw new Error('No Chrome or Edge found. Set BROWSER to its path.')

const dir = mkdtempSync(join(tmpdir(), 'pw-pdf-'))
const src = join(dir, 'use-cases.html')
writeFileSync(src, html)
execFileSync(browser, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--user-data-dir=${join(dir, 'profile')}`, `--print-to-pdf=${out}`, pathToFileURL(src).href], { stdio: 'ignore' })
console.log('wrote', out, `(${(readFileSync(out).length / 1024).toFixed(0)} KB)`)
