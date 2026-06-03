const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const categories = ['new_car', 'concept_car', 'design_interview', 'brand_language', 'auto_show', 'other'];

function today() {
  return process.env.PIPELINE_DATE || new Date().toISOString().slice(0, 10);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function writeFile(relativePath, content) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function writeJson(relativePath, value) {
  writeFile(relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

function ensureDir(relativePath) {
  fs.mkdirSync(path.join(root, relativePath), { recursive: true });
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'untitled';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function itemStatus(item) {
  if (item.is_mock) return 'mock';
  if (item.collection_method === 'manual') return 'manual';
  if (item.collection_method === 'rss') return 'real';
  return 'manual';
}

function isRealItem(item) {
  return itemStatus(item) === 'real';
}

function loadItems() {
  const items = readJson('data/items.json');
  return items.slice().sort((a, b) => {
    const statusOrder = { real: 0, manual: 1, mock: 2 };
    const statusDifference = statusOrder[itemStatus(a)] - statusOrder[itemStatus(b)];
    return statusDifference || String(b.published_date).localeCompare(String(a.published_date));
  });
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key] || 'Uncategorized';
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {});
}

function byCategory(items, category) {
  return items.filter((item) => item.category === category);
}

function formatList(values) {
  return (values || []).map((value) => `- ${value}`).join('\n') || '- Manual review required.';
}

function attribution(item) {
  return `[${item.source}](${item.source_url})`;
}

function provenanceLabel(item) {
  const status = itemStatus(item);
  if (status === 'real') return 'Real · RSS';
  if (status === 'mock') return 'Mock · mock data';
  return 'Manual · editorial entry';
}

function validateItem(item) {
  const required = [
    'id', 'title', 'brand', 'model', 'category', 'published_date', 'source', 'source_url',
    'short_summary', 'design_keywords', 'design_observations', 'proportion_observation', 'volume_observation',
    'surface_observation', 'graphic_observation', 'brand_language_observation', 'designer_note', 'created_at', 'updated_at'
  ];
  const missing = required.filter((field) => item[field] === undefined || item[field] === null || item[field] === '');
  if (missing.length) return { valid: false, reason: `missing fields: ${missing.join(', ')}` };
  if (!categories.includes(item.category)) return { valid: false, reason: `invalid category: ${item.category}` };
  if (!['rss', 'mock', 'manual'].includes(item.collection_method)) return { valid: false, reason: `invalid collection_method: ${item.collection_method}` };
  if (typeof item.is_mock !== 'boolean') return { valid: false, reason: 'is_mock must be a boolean' };
  if (item.collection_method === 'rss' && item.is_mock) return { valid: false, reason: 'rss items cannot be mock' };
  if (item.collection_method === 'rss' && !item.collected_at) return { valid: false, reason: 'rss items must include collected_at' };
  try {
    new URL(item.source_url);
    if (String(item.source_url).toLowerCase().includes('example.com') && (!item.is_mock || item.collection_method === 'rss')) {
      return { valid: false, reason: 'example.com items must be mock and cannot use collection_method rss' };
    }
  } catch {
    return { valid: false, reason: 'source_url must be a valid URL' };
  }
  if (!Array.isArray(item.design_keywords) || !Array.isArray(item.design_observations)) {
    return { valid: false, reason: 'design_keywords and design_observations must be arrays' };
  }
  return { valid: true };
}

function itemMarkdown(item) {
  return `## ${item.title}

- Brand: ${item.brand}
- Model: ${item.model}
- Category: ${item.category}
- Published: ${item.published_date}
- Data status: ${provenanceLabel(item)}
- Collection method: ${item.collection_method}
- Source: ${attribution(item)}
- Image URL: ${item.image_url || 'Not supplied by feed'}

### Summary

${item.short_summary}

### Design keywords

${formatList(item.design_keywords)}

### Design observations

${formatList(item.design_observations)}

### Design breakdown

- Proportion: ${item.proportion_observation}
- Volume: ${item.volume_observation}
- Surface: ${item.surface_observation}
- Graphic: ${item.graphic_observation}
- Brand language: ${item.brand_language_observation}

### Designer note

${item.designer_note}
`;
}

module.exports = {
  root,
  today,
  readJson,
  writeFile,
  writeJson,
  ensureDir,
  slugify,
  escapeHtml,
  loadItems,
  groupBy,
  byCategory,
  formatList,
  attribution,
  itemStatus,
  isRealItem,
  provenanceLabel,
  validateItem,
  itemMarkdown,
};
