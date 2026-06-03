const fs = require('fs');
const path = require('path');
const { root, today, loadItems, byCategory, escapeHtml, slugify, writeFile } = require('./lib');

function readIfExists(relativePath) {
  const file = path.join(root, relativePath);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function card(item) {
  return `<article class="card">
    <div class="meta"><span>${escapeHtml(item.category.replace('_', ' '))}</span><span>${escapeHtml(item.published_date)}</span></div>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.short_summary)}</p>
    <ul>${(item.design_keywords || []).slice(0, 5).map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join('')}</ul>
    <p class="source">Source: <a href="${escapeHtml(item.source_url)}" target="_blank" rel="noreferrer">${escapeHtml(item.source)}</a></p>
    <p class="image-url">Image URL only: ${escapeHtml(item.image_url)}</p>
  </article>`;
}

function linkList(items, folder) {
  return items.map((item) => `<li><a href="../${folder}/${slugify(`${item.brand}-${item.model}-${item.id}`)}.md">${escapeHtml(item.brand)} ${escapeHtml(item.model)}</a> <span>${escapeHtml(item.category)}</span></li>`).join('');
}

function brandList(items) {
  const brands = [...new Set(items.map((item) => item.brand))].sort();
  return brands.map((brand) => `<li><a href="../content/brands/${slugify(brand)}.md">${escapeHtml(brand)}</a></li>`).join('');
}

function digestPreview(markdown) {
  return markdown.split('\n').filter((line) => line.startsWith('## ') || line.startsWith('1.') || line.startsWith('- **')).slice(0, 12).map(escapeHtml).join('\n');
}

function main() {
  const date = today();
  const items = loadItems();
  const digest = readIfExists(`daily/${date}.md`);
  const social = readIfExists(`content/social/xiaohongshu-drafts/${date}.md`);
  const timestamp = items.map((item) => item.updated_at).sort().slice(-1)[0] || `${date}T00:00:00Z`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Automotive Design Intelligence Viewer</title>
  <style>
    :root { color-scheme: light; --bg:#f7f3ec; --panel:#fffdf8; --ink:#201a14; --muted:#6f6256; --line:#e4d6c5; --accent:#b94624; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--bg); color: var(--ink); line-height: 1.55; }
    a { color: var(--accent); }
    header, main, footer { width: min(1120px, calc(100% - 2rem)); margin: 0 auto; }
    header { padding: 3rem 0 1.5rem; }
    .eyebrow { margin: 0 0 .5rem; color: var(--accent); font-size: .78rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    h1 { max-width: 780px; margin: 0; font-size: clamp(2.2rem, 7vw, 4.8rem); line-height: .95; letter-spacing: -.06em; }
    .intro { max-width: 760px; color: var(--muted); font-size: 1.06rem; }
    .status { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: .75rem; margin-top: 1.4rem; }
    .pill { border: 1px solid var(--line); border-radius: 1rem; background: var(--panel); padding: .85rem; }
    .pill strong { display: block; font-size: 1.35rem; }
    main { display: grid; gap: 1rem; padding-bottom: 3rem; }
    section { border: 1px solid var(--line); border-radius: 1.25rem; background: rgba(255,253,248,.92); padding: 1rem; }
    h2 { margin: 0 0 .25rem; font-size: clamp(1.4rem, 4vw, 2rem); letter-spacing: -.035em; }
    .section-note { margin: 0 0 1rem; color: var(--muted); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(245px, 1fr)); gap: .85rem; }
    .card { border: 1px solid var(--line); border-radius: 1rem; padding: .95rem; background: #fff; }
    .card h3 { margin: .5rem 0; line-height: 1.2; }
    .meta { display:flex; flex-wrap:wrap; gap:.35rem; }
    .meta span, .card li, .source { font-size: .88rem; }
    .meta span { border-radius:999px; background:#f1e6d8; color:#55483d; padding:.2rem .5rem; font-weight:700; }
    .card ul { display:flex; flex-wrap:wrap; gap:.35rem; padding:0; list-style:none; }
    .card li { border:1px solid var(--line); border-radius:999px; padding:.18rem .45rem; }
    .image-url { color: var(--muted); font-size: .78rem; overflow-wrap:anywhere; }
    .split { display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
    pre { white-space: pre-wrap; word-break: break-word; border:1px solid var(--line); border-radius: .8rem; padding: .8rem; background:#fbf7ef; max-height: 360px; overflow:auto; }
    footer { color: var(--muted); padding: 0 0 3rem; font-size: .92rem; }
    @media (max-width: 640px) { header, main, footer { width: min(100% - 1rem, 1120px); } header { padding-top: 1.5rem; } section { padding: .85rem; } }
  </style>
</head>
<body>
  <header>
    <p class="eyebrow">Internal viewer · not the core product</p>
    <h1>Automotive Design Intelligence Pipeline</h1>
    <p class="intro">A lightweight content production system for daily automotive design digests, structured model cards, brand-language notes, and Xiaohongshu-style editorial drafts. The site is only a readable viewer over generated files and mock/manual source data.</p>
    <div class="status">
      <div class="pill"><strong>${items.length}</strong>source-attributed items</div>
      <div class="pill"><strong>${byCategory(items, 'new_car').length}</strong>new car releases</div>
      <div class="pill"><strong>${byCategory(items, 'concept_car').length}</strong>concept cars</div>
      <div class="pill"><strong>${escapeHtml(timestamp)}</strong>data timestamp</div>
    </div>
  </header>
  <main>
    <section id="digest">
      <h2>Today Digest</h2>
      <p class="section-note">Generated Markdown: <a href="../daily/${date}.md">daily/${date}.md</a></p>
      <pre>${digestPreview(digest) || 'Run npm run generate:daily to create today\'s digest.'}</pre>
    </section>
    <section id="models">
      <h2>Latest model cards</h2>
      <p class="section-note">Generated from new car and concept records. Markdown files live in <code>content/models/</code>.</p>
      <div class="grid">${items.filter((item) => ['new_car', 'concept_car'].includes(item.category)).slice(0, 6).map(card).join('')}</div>
      <ul>${linkList(items.filter((item) => ['new_car', 'concept_car'].includes(item.category)).slice(0, 8), 'content/models')}</ul>
    </section>
    <section id="brands">
      <h2>Brand language notes</h2>
      <p class="section-note">Brand pages aggregate design signals by brand while preserving source attribution.</p>
      <div class="split"><div><h3>Brand pages</h3><ul>${brandList(items)}</ul></div><div><h3>Latest brand-language records</h3><div class="grid">${byCategory(items, 'brand_language').map(card).join('')}</div></div></div>
    </section>
    <section id="social">
      <h2>Social media draft preview</h2>
      <p class="section-note">Draft file: <a href="../content/social/xiaohongshu-drafts/${date}.md">content/social/xiaohongshu-drafts/${date}.md</a>. Human review is required before any publishing.</p>
      <pre>${escapeHtml(social.split('\n').slice(0, 80).join('\n')) || 'Run npm run generate:social to create today\'s draft.'}</pre>
    </section>
    <section id="sources">
      <h2>Source attribution</h2>
      <p class="section-note">Every generated item includes source name and source URL. Image URLs are stored for reference only; no copyrighted image files are downloaded.</p>
      <div class="grid">${items.slice(0, 10).map((item) => `<article class="card"><h3>${escapeHtml(item.title)}</h3><p>Source: <a href="${escapeHtml(item.source_url)}" target="_blank" rel="noreferrer">${escapeHtml(item.source)}</a></p><p class="image-url">Image URL only: ${escapeHtml(item.image_url)}</p></article>`).join('')}</div>
    </section>
  </main>
  <footer>
    <p>Current data timestamp: ${escapeHtml(timestamp)}. Future improvement: GitHub Pages can later be switched from /docs publishing to GitHub Actions deployment for more reliable automated updates.</p>
  </footer>
</body>
</html>`;
  writeFile('docs/index.html', html);
  console.log('[build] Wrote docs/index.html');
}

main();
