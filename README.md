# Design Intelligence

Design Intelligence is an **Automotive Design Intelligence content production pipeline**. The project direction has moved away from a public website-first MVP and toward an automated, source-attributed system for collecting automotive design signals and producing editorial review assets.

The static site in [`docs/index.html`](docs/index.html) is an **internal viewer** over generated files. It is not the core product, it has no login, and it does not require a backend or database.

## What this project generates

The current pipeline can generate:

1. A daily automotive design digest in `daily/YYYY-MM-DD.md`.
2. Structured model cards in `content/models/*.md`.
3. Brand language notes in `content/brands/*.md`.
4. Xiaohongshu-style social draft files in `content/social/xiaohongshu-drafts/YYYY-MM-DD.md`.
5. A simple mobile-friendly internal viewer at `docs/index.html`.

All generated records retain source attribution. Image handling stores **image URLs only**; the project does not download copyrighted images.

## Current implementation status

This version uses mock/manual source records and a conservative collector scaffold. It does **not** bypass paywalls, scrape copyrighted content, download images, publish to social platforms, use a database, or run a login-protected backend.

## Repository structure

```text
.github/workflows/daily-pipeline.yml   # Scheduled/manual GitHub Actions pipeline
content/brands/                        # Generated brand language notes
content/models/                        # Generated model cards
content/social/xiaohongshu-drafts/     # Generated social draft files
daily/                                 # Generated daily digest Markdown files
data/items.json                        # Canonical item knowledge base
data/schema.md                         # Data contract and validation expectations
data/sources.json                      # Source registry and collection hints
docs/index.html                        # Internal static viewer for GitHub Pages
scripts/collect.js                     # Conservative collector scaffold
scripts/generate-daily.js              # Daily digest generator
scripts/generate-model-cards.js        # Model-card generator
scripts/generate-brand-pages.js        # Brand-page generator
scripts/generate-social-drafts.js      # Social draft generator
scripts/build-site.js                  # Internal viewer builder
scripts/lib.js                         # Shared filesystem/formatting helpers
```

## Run the pipeline locally

Requirements:

- Node.js 20 or newer
- npm

Install dependencies and run everything:

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

To generate for a specific date, set `PIPELINE_DATE`:

```bash
PIPELINE_DATE=2026-06-02 npm run pipeline
```

## View the internal website

From the repository root:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/docs/
```

If GitHub Pages is configured to publish from `/docs`, the current setup remains compatible. A future improvement is to switch Pages deployment to GitHub Actions for more reliable automated updates, but this version keeps the `/docs` publishing path intact.

## Data structure

The data contract is documented in [`data/schema.md`](data/schema.md).

### `data/items.json`

`data/items.json` is the canonical flat-file knowledge base. Each item includes:

- Identity fields: `id`, `title`, `brand`, `model`, `category`
- Source fields: `source`, `source_url`, `image_url`
- Editorial fields: `short_summary`, `design_keywords`, `design_observations`, `designer_note`
- Design-analysis fields: `proportion_observation`, `volume_observation`, `surface_observation`, `graphic_observation`, `brand_language_observation`
- Timestamp fields: `published_date`, `created_at`, `updated_at`

Allowed categories are:

- `new_car`
- `concept_car`
- `design_interview`
- `brand_language`
- `auto_show`
- `other`

### `data/sources.json`

`data/sources.json` is the source registry. Each source has:

- `id`
- `name`
- `type`: `rss`, `website`, or `manual`
- `url`
- `category_hint`
- `enabled`
- `notes`

## Add a new item manually

1. Add a record to `data/items.json` following `data/schema.md`.
2. Use a stable `id` and valid `category`.
3. Include a source name and source URL for attribution.
4. Store an image URL only; do not download or commit source images.
5. Run `npm run pipeline`.
6. Review the generated Markdown and `docs/index.html` before using any draft externally.

## Add a new source

1. Add a source record to `data/sources.json`.
2. Set `enabled` to `false` until the source is reviewed.
3. Use `type: "manual"` for hand-entered sources, `type: "rss"` for future feed parsing, or `type: "website"` for future explicit parsers.
4. Add notes about attribution, copyright, paywalls, and reliability.
5. Keep RSS or website parsing minimal and fault-tolerant. One source failure should not break the pipeline.

## GitHub Actions

The workflow in `.github/workflows/daily-pipeline.yml` can be run manually or on a daily schedule.

Manual trigger steps:

1. Open the repository on GitHub.
2. Go to **Actions**.
3. Select **Daily Automotive Design Intelligence Pipeline**.
4. Click **Run workflow**.

The schedule runs at `00:30 UTC`, which is `08:30` in Singapore/Shanghai. The workflow installs Node.js dependencies, runs `npm run pipeline`, and commits generated content changes back to the current branch if files changed.

## What is mock data

The current records in `data/items.json` and `data/sources.json` are mock/manual examples. Their source URLs and image URLs use `example.com` placeholders. They exist to validate structure, generation logic, attribution handling, and internal viewer layout before real source collection is approved.

## Not implemented yet

- Real RSS parsing from approved public feeds
- Website-specific parsers
- AI summarization or LLM rewriting
- Database storage
- User login or permissions
- Image downloading or rights management
- Social platform publishing
- Paywall handling
- Full editorial approval workflow

## Safety and editorial boundary

Generated outputs are drafts for internal review. Before any external use, verify source links, source dates, image rights, quote accuracy, design claims, and platform tone. Do not bypass paywalls or copy long passages from copyrighted sources.
