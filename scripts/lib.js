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

function loadItems() {
  const items = readJson('data/items.json');
  return items.slice().sort((a, b) => String(b.published_date).localeCompare(String(a.published_date)));
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

function validateItem(item) {
  const required = [
    'id', 'title', 'brand', 'model', 'category', 'published_date', 'source', 'source_url', 'image_url',
    'short_summary', 'design_keywords', 'design_observations', 'proportion_observation', 'volume_observation',
    'surface_observation', 'graphic_observation', 'brand_language_observation', 'designer_note', 'created_at', 'updated_at'
  ];
  const missing = required.filter((field) => item[field] === undefined || item[field] === null || item[field] === '');
  if (missing.length) return { valid: false, reason: `missing fields: ${missing.join(', ')}` };
  if (!categories.includes(item.category)) return { valid: false, reason: `invalid category: ${item.category}` };
  if (!Array.isArray(item.design_keywords) || !Array.isArray(item.design_observations)) {
    return { valid: false, reason: 'design_keywords and design_observations must be arrays' };
  }
  return { valid: true };
}

function itemMarkdown(item) {
  return `## ${item.title}\n\n- Brand: ${item.brand}\n- Model: ${item.model}\n- Category: ${item.category}\n- Published: ${item.published_date}\n- Source: ${attribution(item)}\n- Image URL: ${item.image_url}\n\n### Summary\n\n${item.short_summary}\n\n### Design keywords\n\n${formatList(item.design_keywords)}\n\n### Design observations\n\n${formatList(item.design_observations)}\n\n### Design breakdown\n\n- Proportion: ${item.proportion_observation}\n- Volume: ${item.volume_observation}\n- Surface: ${item.surface_observation}\n- Graphic: ${item.graphic_observation}\n- Brand language: ${item.brand_language_observation}\n\n### Designer note\n\n${item.designer_note}\n`;
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
  validateItem,
  itemMarkdown,
};
