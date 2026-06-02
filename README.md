# Design Intelligence

Design Intelligence is an **Automotive Design Intelligence System**.

The project should not be treated primarily as a public website. The first goal is to build an automated public information collection and content production pipeline for automotive design intelligence.

## Product direction

The system is intended to collect public automotive design information, organize it into structured knowledge assets, and generate editorial-ready outputs.

The first product goal is automated public information collection for:

- New car releases
- Concept cars and design studies
- Design interviews and studio commentary
- Brand design language updates
- Exterior, interior, CMF, lighting, and design-strategy signals

The pipeline should then turn collected information into:

- Structured design cards
- Daily design intelligence digests
- Xiaohongshu-style social media draft content

See [`PRODUCT_DIRECTION.md`](PRODUCT_DIRECTION.md) for the detailed product positioning and implementation boundary.

## Current repository state

This repository currently contains planning documentation, mock data, sample output files, and a lightweight static viewer skeleton.

No scraping, crawling, scheduled ingestion, external API integration, or automated publishing has been implemented yet.

## Website role

The existing static website skeleton in [`docs/index.html`](docs/index.html) is an optional **internal viewer** for the collected knowledge base.

It is not the core product. It should be used only to inspect mock items, validate the shape of design cards, and review collected intelligence once ingestion is implemented.

## Planned folder structure

```text
/data/
  items.json
  sources.json
/daily/
/content/
  models/
  brands/
  social/
    xiaohongshu-drafts/
/scripts/
/docs/
```

## Current files

- `PRODUCT_DIRECTION.md` — product positioning and first-goal definition.
- `PROJECT_STATUS.md` — current direction, completed work, next step, and risks.
- `data/items.json` — mock knowledge-base items for the internal viewer.
- `data/sources.json` — mock source registry for attribution planning.
- `daily/2026-06-02-daily-digest.md` — sample daily digest output.
- `content/models/aurora-a9-e-suv-design-card.md` — sample structured model design card.
- `content/social/xiaohongshu-drafts/aurora-a9-e-suv-draft.md` — sample Xiaohongshu-style draft.
- `docs/index.html` — optional static internal viewer.
- `scripts/` — planned location for future ingestion, normalization, and generation scripts.

## How to view the internal viewer

From the repository root, run a local static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/docs/
```

Expected result:

- The internal viewer loads.
- Mock knowledge-base cards render from `data/items.json`.
- Source links open in a new browser tab.

## Implementation boundary

Do not implement scraping yet.

Before ingestion is built, the next milestone should define:

1. The source registry schema and source approval process.
2. The structured design-card schema.
3. Attribution, copyright, and quotation rules.
4. The daily digest generation contract.
5. The Xiaohongshu draft generation contract.
