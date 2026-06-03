# Project Status

## Repository review findings

The repository already had useful planning documentation, mock data, a sample digest, sample generated content, and a static `/docs` viewer. The existing direction had already started shifting away from a website-first project, so this version kept the useful static viewer and sample output approach while turning the project into a runnable flat-file pipeline.

No existing useful work was deleted. Older sample files remain in place where they are harmless historical examples, while the new pipeline now generates date-based daily and social files plus structured model and brand pages.

## Completed in this version

- Reframed the project as an Automotive Design Intelligence content production pipeline.
- Expanded `data/items.json` to 10 mock/manual source-attributed records:
  - 3 new car releases
  - 3 concept cars
  - 2 design interviews
  - 2 brand design language updates
- Updated `data/sources.json` with example `manual`, `rss`, and source-registry records.
- Added `data/schema.md` with the canonical item and source schema.
- Added a conservative collector scaffold in `scripts/collect.js`.
- Added generators for:
  - Daily digest Markdown
  - Structured model cards
  - Brand language notes
  - Xiaohongshu-style social drafts
  - Static internal website viewer
- Added shared script utilities in `scripts/lib.js`.
- Added `package.json` scripts for individual generation steps and full `npm run pipeline` execution.
- Added a GitHub Actions workflow at `.github/workflows/daily-pipeline.yml` that runs manually or daily, runs the pipeline, and commits generated content changes if files changed.
- Rebuilt `docs/index.html` as a mobile-friendly internal viewer that shows project positioning, digest preview, model cards, brand notes, social draft preview, source attribution, and the current data timestamp.
- Documented that GitHub Pages can continue publishing from `/docs`, with GitHub Actions deployment as a future improvement.

## How to test

Run from the repository root:

```bash
npm ci
npm run collect
npm run generate:daily
npm run generate:models
npm run generate:brands
npm run generate:social
npm run build
npm run pipeline
```

To view the internal site locally:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/docs/
```

Expected result:

- The collector logs manual/mock sources and exits safely.
- Daily digest Markdown appears in `daily/YYYY-MM-DD.md`.
- Model cards appear in `content/models/`.
- Brand notes appear in `content/brands/`.
- Xiaohongshu draft Markdown appears in `content/social/xiaohongshu-drafts/YYYY-MM-DD.md`.
- `docs/index.html` renders an internal viewer with latest data and attribution.

## Known issues

- The dataset is mock/manual and uses `example.com` placeholder URLs.
- RSS collection is scaffolded but not implemented; this is intentional until sources are approved.
- Generated Markdown is deterministic template output, not AI-written analysis.
- `docs/index.html` is static and generated directly from JSON/Markdown previews.
- Existing GitHub Pages settings still require repository-level setup on GitHub if not already enabled.

## Next recommended steps

1. Replace mock sources with a small approved public-source registry.
2. Add minimal RSS parsing for one or two non-paywalled public feeds.
3. Add schema validation as a separate `npm run validate` command.
4. Add editorial status fields such as `draft`, `reviewed`, `approved`, and `archived`.
5. Add source reliability and image-rights notes to the data model.
6. Add AI-assisted summarization only after strict attribution, quote, and review rules are defined.
7. Consider GitHub Actions Pages deployment after confirming the current `/docs` Pages setup.

## Risks

### Copyright

Automotive design content is image-heavy and often copyrighted. The pipeline stores image URLs only and does not download or commit images. Human review is required before any external image use.

### Source reliability

Public automotive coverage can include rumors, reposts, or inaccurate auto-show details. Source records need reliability notes before real ingestion is trusted.

### Paywalls

The system must not bypass paywalls. Paywalled content should be excluded unless there is a clear licensed workflow and attribution policy.

### Inaccurate AI summaries

Future AI summaries may overstate design intent or confuse observed styling with official strategy. The current template output keeps a manual review boundary; future AI additions need stronger validation.

### Over-automation

Social drafts and digest copy should remain editorial drafts. The system should not auto-publish to external platforms without human approval, source verification, and image-rights review.
