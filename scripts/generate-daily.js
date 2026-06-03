const { today, loadItems, byCategory, writeFile, formatList, attribution } = require('./lib');

function section(title, items) {
  const body = items.length
    ? items.map((item) => `### ${item.title}\n\n- Brand/model: ${item.brand} ${item.model}\n- Published: ${item.published_date}\n- Summary: ${item.short_summary}\n- Design signal: ${item.brand_language_observation}\n- Source: ${attribution(item)}`).join('\n\n')
    : 'No items in this category. Add or collect source-attributed records before review.';
  return `## ${title}\n\n${body}\n`;
}

function keywordTrends(items) {
  const counts = new Map();
  for (const item of items) {
    for (const keyword of item.design_keywords || []) counts.set(keyword, (counts.get(keyword) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([keyword, count]) => `${keyword} (${count})`);
}

function main() {
  const date = today();
  const items = loadItems();
  const latest = items.slice(0, 5);
  const socialCandidates = items.filter((item) => item.category === 'concept_car' || item.category === 'brand_language').slice(0, 4);
  const content = `# Daily Automotive Design Digest — ${date}\n\n## Editorial status\n\nGenerated from mock/manual public-source structure. Human review required before publication or social posting.\n\n## Today's important items\n\n${latest.map((item, index) => `${index + 1}. **${item.title}** — ${item.short_summary} Source: ${attribution(item)}.`).join('\n')}\n\n${section('New car releases', byCategory(items, 'new_car'))}\n${section('Concept cars', byCategory(items, 'concept_car'))}\n${section('Design interviews', byCategory(items, 'design_interview'))}\n${section('Brand language updates', byCategory(items, 'brand_language'))}\n## Design trend observations\n\n${formatList(keywordTrends(items))}\n\n## Items worth turning into social media content\n\n${socialCandidates.map((item) => `- **${item.title}** — angle: ${item.designer_note} Source: ${attribution(item)}.`).join('\n')}\n\n## Manual review checklist\n\n- Verify every source link and source date before external use.\n- Confirm image rights; store and share URLs only unless permission is granted.\n- Separate directly sourced facts from design interpretation.\n- Check that AI/editorial summaries do not overstate designer intent.\n- Avoid paywalled, leaked, or unverifiable material.\n`;
  writeFile(`daily/${date}.md`, content);
  console.log(`[generate:daily] Wrote daily/${date}.md`);
}

main();
