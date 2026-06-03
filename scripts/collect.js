const { loadItems, readJson, slugify, validateItem, writeJson } = require('./lib');

const MAX_ITEMS_PER_FEED = 20;
const REQUEST_TIMEOUT_MS = 15000;

function decodeXml(value = '') {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function stripMarkup(value = '') {
  return decodeXml(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tagValue(block, names) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
    if (match) return match[1];
  }
  return '';
}

function attrValue(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match ? decodeXml(match[1]).trim() : '';
}

function safeHttpUrl(value) {
  try {
    const url = new URL(decodeXml(value).trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function isExampleUrl(value) {
  return String(value || '').toLowerCase().includes('example.com');
}

function itemLink(block) {
  const rssLink = safeHttpUrl(stripMarkup(tagValue(block, ['link'])));
  if (rssLink) return rssLink;
  const atomLinks = block.match(/<link\b[^>]*>/gi) || [];
  const alternate = atomLinks.find((tag) => !attrValue(tag, 'rel') || attrValue(tag, 'rel') === 'alternate');
  return safeHttpUrl(attrValue(alternate || atomLinks[0] || '', 'href'));
}

function imageUrl(block) {
  const metadataTags = block.match(/<(?:media:content|media:thumbnail|enclosure)\b[^>]*>/gi) || [];
  for (const tag of metadataTags) {
    const type = attrValue(tag, 'type').toLowerCase();
    const url = safeHttpUrl(attrValue(tag, 'url') || attrValue(tag, 'href'));
    if (!url) continue;
    const looksLikeImage = /\.(?:avif|gif|jpe?g|png|webp)(?:[?#]|$)/i.test(url);
    const isThumbnail = /^<media:thumbnail\b/i.test(tag);
    if (isThumbnail || type.startsWith('image/') || (!type && looksLikeImage)) return url;
  }
  return '';
}

function publishedDate(block) {
  const raw = stripMarkup(tagValue(block, ['pubDate', 'published', 'updated', 'dc:date']));
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10);
}

function summary(block) {
  const text = stripMarkup(tagValue(block, ['description', 'summary', 'content:encoded', 'content']));
  if (!text) return 'No short summary was supplied by the RSS feed. Review the source article before using this record.';
  return text.length > 500 ? `${text.slice(0, 497).trim()}...` : text;
}

function parseFeed(xml) {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || [];
  return blocks.map((block) => ({
    title: stripMarkup(tagValue(block, ['title'])),
    source_url: itemLink(block),
    published_date: publishedDate(block),
    short_summary: summary(block),
    image_url: imageUrl(block),
  })).filter((item) => item.title && item.source_url && item.published_date);
}

function rssItem(source, feedItem, collectedAt) {
  const titleSlug = slugify(feedItem.title);
  return {
    id: `${source.id}-${feedItem.published_date}-${titleSlug}`,
    title: feedItem.title,
    brand: source.name,
    model: feedItem.title,
    category: source.category_hint || 'other',
    published_date: feedItem.published_date,
    source: source.name,
    source_url: feedItem.source_url,
    image_url: feedItem.image_url,
    short_summary: feedItem.short_summary,
    design_keywords: [],
    design_observations: [],
    proportion_observation: 'Not assessed from RSS metadata. Manual source review required.',
    volume_observation: 'Not assessed from RSS metadata. Manual source review required.',
    surface_observation: 'Not assessed from RSS metadata. Manual source review required.',
    graphic_observation: 'Not assessed from RSS metadata. Manual source review required.',
    brand_language_observation: 'RSS-collected source item awaiting editorial design analysis.',
    designer_note: 'Review the linked public source before adding design interpretation or publishing this item.',
    created_at: collectedAt,
    updated_at: collectedAt,
    collected_at: collectedAt,
    collection_method: 'rss',
    is_mock: false,
  };
}

function normalizeExisting(item) {
  const normalized = { ...item };
  if (isExampleUrl(normalized.source_url)) {
    normalized.is_mock = true;
    normalized.collection_method = 'mock';
  } else {
    if (normalized.is_mock === undefined) normalized.is_mock = normalized.collection_method === 'mock';
    if (!normalized.collection_method) normalized.collection_method = normalized.is_mock ? 'mock' : 'manual';
  }
  return normalized;
}

async function collectSource(source) {
  console.log(`[collect] Fetching RSS source: ${source.name} (${source.url})`);
  const response = await fetch(source.url, {
    headers: { 'user-agent': 'design-intelligence-rss-collector/0.3 (+public feed metadata only)' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const xml = await response.text();
  const parsed = parseFeed(xml).slice(0, MAX_ITEMS_PER_FEED);
  console.log(`[collect] Parsed ${parsed.length} usable item(s) from ${source.name}.`);
  return parsed;
}

async function main() {
  console.log('[collect] Starting public RSS collector. Feed metadata only; no images are downloaded.');
  const sources = readJson('data/sources.json');
  const existingItems = loadItems().map(normalizeExisting);
  const seenUrls = new Set(existingItems.map((item) => item.source_url));
  const accepted = [];
  const collectedAt = new Date().toISOString();

  for (const source of sources) {
    if (!source.enabled) {
      console.log(`[collect] Skipping disabled source: ${source.name}`);
      continue;
    }
    if (source.type === 'manual') {
      console.log(`[collect] Manual/mock source registered: ${source.name}. No network collection required.`);
      continue;
    }
    if (source.type !== 'rss') {
      console.log(`[collect] Unsupported source type for ${source.name}; skipped safely.`);
      continue;
    }

    try {
      const feedItems = await collectSource(source);
      for (const feedItem of feedItems) accepted.push(rssItem(source, feedItem, collectedAt));
    } catch (error) {
      console.warn(`[collect] Could not collect ${source.name}: ${error.message}. Continuing without bypassing access controls.`);
    }
  }

  const validNewItems = [];
  for (const candidate of accepted) {
    const item = normalizeExisting(candidate);
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

  const deduplicated = [];
  const allSeenUrls = new Set();
  for (const item of existingItems.concat(validNewItems)) {
    if (allSeenUrls.has(item.source_url)) continue;
    allSeenUrls.add(item.source_url);
    deduplicated.push(item);
  }
  deduplicated.sort((a, b) => String(b.published_date).localeCompare(String(a.published_date)));
  writeJson('data/items.json', deduplicated);
  console.log(`[collect] Wrote ${validNewItems.length} new valid item(s); ${deduplicated.length} total unique item(s) in data/items.json.`);
  console.log('[collect] Done.');
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`[collect] Fatal collector error: ${error.stack || error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { parseFeed, rssItem, normalizeExisting };
