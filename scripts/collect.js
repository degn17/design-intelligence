const { loadItems, readJson, validateItem, writeJson } = require('./lib');

function main() {
  console.log('[collect] Starting conservative collector scaffold.');
  const sources = readJson('data/sources.json');
  const existingItems = loadItems();
  const seenUrls = new Set(existingItems.map((item) => item.source_url));
  const accepted = [];

  for (const source of sources) {
    if (!source.enabled) {
      console.log(`[collect] Skipping disabled source: ${source.name}`);
      continue;
    }

    if (source.type === 'manual') {
      console.log(`[collect] Manual/mock source ready: ${source.name}. No network collection required.`);
      continue;
    }

    if (source.type === 'rss') {
      console.log(`[collect] RSS source scaffold only: ${source.name}. TODO: add minimal feed parsing after source approval.`);
      continue;
    }

    if (source.type === 'website') {
      console.log(`[collect] Website source scaffold only: ${source.name}. TODO: add explicit parser rules; do not scrape paywalled pages.`);
      continue;
    }

    console.log(`[collect] Unknown source type for ${source.name}; skipped safely.`);
  }

  // Future parsing should push normalized candidate items into `accepted`.
  // Candidates must include source attribution, image URLs only, and no copied long passages.
  const validNewItems = [];
  for (const item of accepted) {
    const result = validateItem(item);
    if (!result.valid) {
      console.log(`[collect] Rejected ${item.id || 'unknown item'}: ${result.reason}`);
      continue;
    }
    if (seenUrls.has(item.source_url)) {
      console.log(`[collect] Deduplicated by source_url: ${item.source_url}`);
      continue;
    }
    seenUrls.add(item.source_url);
    validNewItems.push(item);
  }

  if (validNewItems.length > 0) {
    const merged = existingItems.concat(validNewItems).sort((a, b) => String(b.published_date).localeCompare(String(a.published_date)));
    writeJson('data/items.json', merged);
    console.log(`[collect] Wrote ${validNewItems.length} new valid item(s) to data/items.json.`);
  } else {
    console.log('[collect] No new items collected. Existing mock/manual dataset left unchanged.');
  }
  console.log('[collect] Done.');
}

main();
