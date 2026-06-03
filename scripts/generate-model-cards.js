const { loadItems, slugify, writeFile, itemMarkdown, provenanceLabel } = require('./lib');

function main() {
  const items = loadItems().filter((item) => ['new_car', 'concept_car', 'auto_show', 'other'].includes(item.category));
  for (const item of items) {
    const content = `# Model Card — ${item.brand} ${item.model}\n\n${itemMarkdown(item)}\n## Source attribution\n\nThis card is generated from a **${provenanceLabel(item)}** record and must retain attribution to [${item.source}](${item.source_url}). RSS-collected records contain feed metadata only and require editorial review before design claims are added.\n`;
    const file = `content/models/${slugify(`${item.brand}-${item.model}-${item.id}`)}.md`;
    writeFile(file, content);
    console.log(`[generate:models] Wrote ${file}`);
  }
}

main();
