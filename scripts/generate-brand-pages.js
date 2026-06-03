const { loadItems, groupBy, slugify, writeFile, formatList, attribution } = require('./lib');

function main() {
  const groups = groupBy(loadItems(), 'brand');
  for (const [brand, items] of Object.entries(groups)) {
    const languageItems = items.filter((item) => item.category === 'brand_language');
    const allKeywords = [...new Set(items.flatMap((item) => item.design_keywords || []))].slice(0, 12);
    const body = `# Brand Language Notes — ${brand}\n\n## Current positioning\n\nGenerated internal notes from ${items.length} source-attributed mock/manual item(s). Treat as draft intelligence pending human review.\n\n## Repeated design keywords\n\n${formatList(allKeywords)}\n\n## Brand language observations\n\n${items.map((item) => `### ${item.title}\n\n- Model/program: ${item.model}\n- Category: ${item.category}\n- Observation: ${item.brand_language_observation}\n- Proportion: ${item.proportion_observation}\n- Graphic: ${item.graphic_observation}\n- Source: ${attribution(item)}`).join('\n\n')}\n\n## Dedicated brand-language update records\n\n${languageItems.length ? languageItems.map((item) => `- ${item.title} — ${attribution(item)}`).join('\n') : '- No dedicated brand-language update record yet.'}\n\n## Manual review notes\n\n- Confirm that brand-language claims are supported by source material.\n- Do not infer official strategy from isolated styling details without review.\n- Keep source attribution attached when reusing this page in other outputs.\n`;
    const file = `content/brands/${slugify(brand)}.md`;
    writeFile(file, body);
    console.log(`[generate:brands] Wrote ${file}`);
  }
}

main();
