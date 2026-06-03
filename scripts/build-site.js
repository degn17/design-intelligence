const fs = require('fs');
const path = require('path');
const { root, today, loadItems, byCategory, escapeHtml, slugify, writeFile, readJson, itemStatus, isRealItem, provenanceLabel } = require('./lib');

function readIfExists(relativePath) {
  const file = path.join(root, relativePath);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function card(item) {
  return `<article class="card">
    <div class="meta"><span class="status-${itemStatus(item)}">${escapeHtml(provenanceLabel(item))}</span><span>${escapeHtml(item.category.replace('_', ' '))}</span><span>${escapeHtml(item.published_date)}</span></div>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.short_summary)}</p>
    <ul>${(item.design_keywords || []).slice(0, 5).map((keyword) => `<li>${escapeHtml(keyword)}</li>`).join('')}</ul>
    <p class="source">Source: <a href="${escapeHtml(item.source_url)}" target="_blank" rel="noreferrer">${escapeHtml(item.source)}</a></p>
    <p class="image-url">Image URL only: ${escapeHtml(item.image_url || 'Not supplied by feed')}</p>
  </article>`;
}

function linkList(items, folder) {
  return items.map((item) => `<li><a href="../${folder}/${slugify(`${item.brand}-${item.model}-${item.id}`)}.md">${escapeHtml(item.brand)} ${escapeHtml(item.model)}</a> <span>${escapeHtml(provenanceLabel(item))}</span></li>`).join('');
}

function brandList(items) {
  const brands = [...new Set(items.map((item) => item.brand))].sort();
  return brands.map((brand) => `<li><a href="../content/brands/${slugify(brand)}.md">${escapeHtml(brand)}</a></li>`).join('');
}

function digestPreview(markdown) {
  return markdown.split('\n').filter((line) => line.startsWith('## ') || line.startsWith('1.') || line.startsWith('- **') || line.startsWith('> ⚠️')).slice(0, 14).map(escapeHtml).join('\n');
}

function main() {
  const date = today();
  const items = loadItems();
  const sources = readJson('data/sources.json');
  const digest = readIfExists(`daily/${date}.md`);
  const social = readIfExists(`content/social/xiaohongshu-drafts/${date}.md`);
  const realItems = items.filter(isRealItem);
  const nonRealItems = items.filter((item) => !isRealItem(item));
  const collectedTimes = realItems.map((item) => item.collected_at).filter(Boolean).sort();
  const lastCollection = collectedTimes.slice(-1)[0] || 'No successful RSS collection recorded';
  const itemSources = [...new Set(realItems.map((item) => item.source))].sort();
  const enabledRssSources = sources.filter((source) => source.enabled && source.type === 'rss');
  const collectionMethods = [...new Set(items.map((item) => item.collection_method || 'manual'))].sort();
  const onlyMockWarning = realItems.length === 0 ? '<p class="warning"><strong>Warning:</strong> Only mock/manual data is currently available. Run <code>npm run collect</code> in an environment that can reach the public RSS feeds.</p>' : '';
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Automotive Design Intelligence Pipeline</title>
  <style>
    :root { --bg:#f4efe6; --paper:#fffdf8; --ink:#201d1a; --muted:#71685f; --line:#d8cfc3; --accent:#9f3b20; --real:#176b45; --manual:#76550b; --mock:#8b2f2f; }
    * { box-sizing:border-box; } body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.55 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    a { color:var(--accent); } header, main, footer { width:min(1120px, calc(100% - 2rem)); margin:auto; } header { padding:3rem 0 1.5rem; }
    h1,h2,h3 { line-height:1.15; } h1 { font-size:clamp(2rem,6vw,4.8rem); max-width:900px; margin:.2rem 0 1rem; letter-spacing:-.05em; }
    .eyebrow { color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:.12em; font-size:.78rem; } .intro,.section-note { color:var(--muted); }
    .status,.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:.8rem; } .pill,.card,section { background:var(--paper); border:1px solid var(--line); border-radius:1rem; }
    .pill { padding:.8rem; } .pill strong { display:block; font-size:1.4rem; } section { padding:1rem; margin:1rem 0; } .card { padding:.9rem; min-width:0; }
    .meta { display:flex; flex-wrap:wrap; gap:.35rem; } .meta span,.card li { font-size:.82rem; border-radius:999px; padding:.2rem .5rem; background:#f1e6d8; color:#55483d; font-weight:700; }
    .meta .status-real { background:#dcefe5; color:var(--real); } .meta .status-manual { background:#f5e9c9; color:var(--manual); } .meta .status-mock { background:#f5dddd; color:var(--mock); }
    .card ul { display:flex; flex-wrap:wrap; gap:.35rem; padding:0; list-style:none; } .source { font-size:.9rem; } .image-url { color:var(--muted); font-size:.78rem; overflow-wrap:anywhere; }
    .split { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1rem; } .warning { border-left:.35rem solid var(--mock); background:#fff1f1; padding:.8rem; }
    pre { white-space:pre-wrap; word-break:break-word; border:1px solid var(--line); border-radius:.8rem; padding:.8rem; background:#fbf7ef; max-height:360px; overflow:auto; }
    footer { color:var(--muted); padding:0 0 3rem; font-size:.92rem; } @media (max-width:640px) { header,main,footer { width:min(100% - 1rem,1120px); } header { padding-top:1.5rem; } section { padding:.85rem; } }
  </style>
</head>
<body>
  <header>
    <p class="eyebrow">Internal viewer · not the core product</p>
    <h1>Automotive Design Intelligence Pipeline</h1>
    <p class="intro">A lightweight content production system for daily automotive design digests, structured model cards, brand-language notes, and editorial drafts. Real RSS-collected records are clearly separated from mock and manual examples.</p>
  </header>
  <main>
    <section id="data-status">
      <h2>Data status</h2>
      ${onlyMockWarning}
      <div class="status">
        <div class="pill"><strong>${realItems.length}</strong>real collected items</div>
        <div class="pill"><strong>${nonRealItems.length}</strong>mock/manual items</div>
        <div class="pill"><strong>${escapeHtml(lastCollection)}</strong>last collection time</div>
        <div class="pill"><strong>${escapeHtml(collectionMethods.join(', ') || 'none')}</strong>collection methods</div>
      </div>
      <div class="split"><div><h3>Sources used by real items</h3><ul>${itemSources.length ? itemSources.map((source) => `<li>${escapeHtml(source)}</li>`).join('') : '<li>None collected yet.</li>'}</ul></div><div><h3>Enabled public RSS sources</h3><ul>${enabledRssSources.map((source) => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.name)}</a></li>`).join('')}</ul></div></div>
    </section>
    <section id="digest"><h2>Today Digest</h2><p class="section-note">Generated Markdown: <a href="../daily/${date}.md">daily/${date}.md</a></p><pre>${digestPreview(digest) || 'Run npm run generate:daily to create today\'s digest.'}</pre></section>
    <section id="models"><h2>Latest model cards</h2><p class="section-note">Real collected items are ranked before mock/manual examples. Markdown files live in <code>content/models/</code>.</p><div class="grid">${items.filter((item) => ['new_car','concept_car','other'].includes(item.category)).slice(0,6).map(card).join('')}</div><ul>${linkList(items.filter((item) => ['new_car','concept_car','other'].includes(item.category)).slice(0,8),'content/models')}</ul></section>
    <section id="brands"><h2>Brand language notes</h2><p class="section-note">Brand pages aggregate design signals while preserving provenance and source attribution.</p><div class="split"><div><h3>Brand pages</h3><ul>${brandList(items)}</ul></div><div><h3>Latest brand-language records</h3><div class="grid">${byCategory(items,'brand_language').map(card).join('')}</div></div></div></section>
    <section id="social"><h2>Social media draft preview</h2><p class="section-note">Draft file: <a href="../content/social/xiaohongshu-drafts/${date}.md">content/social/xiaohongshu-drafts/${date}.md</a>. Human review is required before publishing.</p><pre>${escapeHtml(social.split('\n').slice(0,80).join('\n')) || 'Run npm run generate:social to create today\'s draft.'}</pre></section>
    <section id="sources"><h2>Source attribution</h2><p class="section-note">Every item includes a source name, source URL, and data status. Image URLs are stored for reference only; no image files are downloaded.</p><div class="grid">${items.slice(0,10).map(card).join('')}</div></section>
  </main>
  <footer><p>Last successful RSS collection: ${escapeHtml(lastCollection)}. The collector reads public feed metadata only and does not bypass paywalls or download images.</p></footer>
</body>
</html>`;
  writeFile('docs/index.html', html);
  console.log('[build] Wrote docs/index.html');
}

main();
