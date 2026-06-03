const { loadItems, slugify, writeFile, itemMarkdown } = require('./lib');

function main() {
  const items = loadItems().filter((item) => ['new_car', 'concept_car', 'auto_show', 'other'].includes(item.category));
  for (const item of items) {
    const content = `# Model Card — ${item.brand} ${item.model}\n\n${itemMarkdown(item)}\n## Source attribution\n\nThis card is generated from a mock/manual source record and must retain attribution to [${item.source}](${item.source_url}).\n`;
    const file = `content/models/${slugify(`${item.brand}-${item.model}-${item.id}`)}.md`;
    writeFile(file, content);
    console.log(`[generate:models] Wrote ${file}`);
  }
}

main();
