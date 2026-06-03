# Design Intelligence

Design Intelligence is an **Automotive Design Intelligence content production pipeline**. It collects metadata from approved public RSS feeds, keeps real collection visibly separate from mock/manual examples, and generates editorial review assets. The static site in [`docs/index.html`](docs/index.html) is an internal viewer over generated files, not the core product.

## What this project generates

1. A daily automotive design digest in `daily/YYYY-MM-DD.md`.
2. Structured model cards in `content/models/*.md`.
3. Brand language notes in `content/brands/*.md`.
4. Xiaohongshu-style social draft files in `content/social/xiaohongshu-drafts/YYYY-MM-DD.md`.
5. A mobile-friendly internal viewer at `docs/index.html`.

All outputs retain source attribution and show whether an item is **real**, **mock**, or **manual**. Image handling stores image URLs only; the project does not download images.

## Real public sources

The enabled RSS source registry in `data/sources.json` includes:

- **Porsche Newsroom** — official public Porsche Newsroom RSS feed.
- **Motor Authority** — public automotive news RSS feed.
- **Carscoops** — public automotive news RSS feed.
- **Car and Driver** — public latest-content RSS feed.

The collector reads only public feed metadata: item title, article URL, published date, feed-provided short summary, and feed-provided image URL when available. It does not open article pages, bypass paywalls, or download images.

## Mock and manual data

The original demonstration records remain in `data/items.json`. Their `example.com` source URLs are intentionally fake and every one is marked with:

```json
{
  "is_mock": true,
  "collection_method": "mock"
}
```

Any item whose `source_url` uses `example.com` is forced to mock status by the collector and is rejected by validation if it attempts to use `collection_method: "rss"`. Hand-entered non-mock records should use `collection_method: "manual"` and `is_mock: false`.

## Repository structure

```text
.github/workflows/daily-pipeline.yml   # Scheduled/manual GitHub Actions pipeline
content/brands/                        # Generated brand language notes
content/models/                        # Generated model cards
content/social/xiaohongshu-drafts/     # Generated social draft files
daily/                                 # Generated daily digest Markdown files
data/items.json                        # Canonical item knowledge base
data/schema.md                         # Data contract and validation expectations
data/sources.json                      # Public RSS and manual/mock source registry
docs/index.html                        # Internal static viewer for GitHub Pages
scripts/collect.js                     # Public RSS collector, validation, and deduplication
scripts/generate-*.js                  # Markdown generators
scripts/build-site.js                  # Internal viewer builder
scripts/lib.js                         # Shared validation and provenance helpers
```

## Run the pipeline locally

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm run pipeline
```

Run individual steps:

```bash
npm run collect
npm run generate:daily
npm run generate:models
npm run generate:brands
npm run generate:social
npm run build
```

To generate for a specific date:

```bash
PIPELINE_DATE=2026-06-03 npm run pipeline
```

## Verify real collection

1. Run `npm run collect` in an environment with access to the enabled public RSS URLs.
2. Check the collector log for `Parsed ... usable item(s)` and `Wrote ... new valid item(s)` messages.
3. Inspect `data/items.json` for records with `"collection_method": "rss"`, `"is_mock": false`, and a `collected_at` timestamp.
4. Confirm that each real record has a non-`example.com` `source_url` and that repeated runs do not add another record with the same URL.
5. Run `npm run pipeline`, then inspect the data status section in `docs/index.html` and the provenance labels in generated Markdown.

To view the internal site locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/docs/`.

## Data model

The complete contract is documented in [`data/schema.md`](data/schema.md). Important provenance fields are:

- `collection_method`: `rss`, `mock`, or `manual`.
- `is_mock`: boolean; always `true` for `example.com` records.
- `collected_at`: ISO timestamp for successfully RSS-collected records.
- `source` and `source_url`: retained in every generated output.

Real RSS items are sorted before manual and mock examples. The pipeline deduplicates by `source_url`, so repeated workflow runs do not create duplicate items.

## Add a new source

1. Add a source record to `data/sources.json` with `type: "rss"`.
2. Verify that the URL is a public feed and document reliability, access, and editorial caveats in `notes`.
3. Keep `enabled: false` until it is reviewed, then enable it for collection.
4. Run `npm run collect` and confirm the parser can read its RSS or Atom metadata without opening article pages.

## Known limitations

- The enabled feeds are broad automotive feeds, not design-only feeds. Collected items require editorial relevance review.
- RSS metadata varies by publisher; summaries, image URLs, and dates may be missing or inconsistent.
- RSS-collected records intentionally use neutral placeholders for detailed design analysis until a human reviews the source.
- Feed availability, redirects, rate limits, and network restrictions may result in zero new items; one failed source does not fail the entire collection step.
- The pipeline does not parse article pages, handle paywalls, assess image rights, publish to social platforms, or provide an approval workflow.

## Next recommended step

Add an editorial triage step that reviews RSS-collected items for automotive-design relevance, identifies brand/model accurately, and adds human-approved design observations before those records are used in outward-facing content.

## Safety and editorial boundary

Generated outputs are drafts for internal review. Before external use, verify source links, source dates, image rights, quote accuracy, design claims, and platform tone. Do not bypass paywalls, download source images, or copy long passages from copyrighted sources.
