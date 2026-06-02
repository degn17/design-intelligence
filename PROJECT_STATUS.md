# Project Status

## What has been built

- A first MVP static website skeleton for **Automotive Design Intelligence**.
- The GitHub Pages entry point lives at `docs/index.html`.
- The site uses plain HTML, CSS, and JavaScript with no build step.
- The site includes these sections:
  - Today Digest
  - Model Cards
  - Brand Language
  - Sources
- Mock knowledge-base records live in `data/items.json`.
- Each mock item includes the required fields:
  - `title`
  - `brand`
  - `model`
  - `category`
  - `date`
  - `source`
  - `source_url`
  - `short_summary`
  - `design_keywords`
  - `design_observations`

## How to test it

From the repository root, run a local static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/docs/
```

Expected result:

- The Automotive Design Intelligence homepage loads.
- The four sections are visible.
- Cards render from `data/items.json`.
- Source links open in a new browser tab.

## What is missing

- No scraping, crawling, scheduled ingestion, or external API integration has been implemented.
- No backend, database, authentication, or admin workflow exists yet.
- No search, filters, saved collections, tagging UI, or comparison views exist yet.
- No automated test suite exists yet.
- Mock source URLs point to placeholder `example.com` links.

## Next recommended step

Add a small client-side filtering and search layer over `data/items.json`, then define the first real ingestion contract before implementing scraping. A good next milestone would be:

1. Add filters for brand, category, keyword, and date.
2. Add a text search field for title, model, summary, keywords, and observations.
3. Document the expected source schema and ingestion rules.
4. Only after the schema is stable, implement a first opt-in ingestion script for one approved source.
