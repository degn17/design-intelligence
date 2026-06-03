const { today, loadItems, writeFile, formatList, attribution, provenanceLabel } = require('./lib');

function draftFor(item, index) {
  const pageCount = Math.min(7, Math.max(5, (item.design_observations || []).length + 3));
  const pages = [
    `1. Cover: ${item.brand} ${item.model} — ${item.design_keywords[0] || 'design signal'}`,
    `2. Proportion page: ${item.proportion_observation}`,
    `3. Volume page: ${item.volume_observation}`,
    `4. Surface page: ${item.surface_observation}`,
    `5. Graphic page: ${item.graphic_observation}`,
    `6. Brand language page: ${item.brand_language_observation}`,
    `7. Source/review page: cite ${item.source} and keep image URLs only.`
  ].slice(0, pageCount);

  return `## Draft ${index + 1}: ${item.title}\n\n- Data status: **${provenanceLabel(item)}**\n- Collection method: ${item.collection_method}\n\n### 3 title options\n\n1. ${item.brand} ${item.model}: ${item.design_keywords[0] || 'design'} is the real story\n2. Why this ${item.category.replace('_', ' ')} feels different at first glance\n3. ${item.brand}'s latest design signal, explained in 60 seconds\n\n### Suggested cover text\n\n${item.brand} ${item.model}: ${item.design_keywords.slice(0, 2).join(' + ') || 'manual design review required'}\n\n### 5-7 image/page structure\n\n${formatList(pages)}\n\n### Main body draft\n\n${item.short_summary}\n\nWhat is worth watching: ${item.design_observations.join(' ') || 'Manual design analysis has not been added yet.'}\n\nDesign read: ${item.brand_language_observation}\n\n### Design keywords\n\n${formatList(item.design_keywords)}\n\n### Source attribution\n\n- Source: ${attribution(item)}\n- Image URL for manual review only: ${item.image_url || 'Not supplied by feed'}\n\n### Manual review warnings\n\n- Verify source accuracy before publishing.\n- Do not repost copyrighted images without permission; use URLs as reference only.\n- Avoid presenting design interpretation as official designer intent.\n- Check Xiaohongshu tone, claims, and brand risk manually.\n`;
}

function main() {
  const date = today();
  const candidates = loadItems().filter((item) => ['new_car', 'concept_car', 'brand_language'].includes(item.category)).slice(0, 4);
  const content = `# Xiaohongshu-Style Automotive Design Drafts — ${date}\n\nGenerated for editorial review from clearly labeled real, mock, or manual source records. Real RSS-collected items are preferred. These are not final posts.\n\n${candidates.map(draftFor).join('\n')}`;
  const file = `content/social/xiaohongshu-drafts/${date}.md`;
  writeFile(file, content);
  console.log(`[generate:social] Wrote ${file}`);
}

main();
