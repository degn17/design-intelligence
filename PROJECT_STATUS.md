# Project Status

## Current milestone

The pipeline now has its first real collection step. Enabled public RSS sources are fetched, feed metadata is normalized into `data/items.json`, records are validated, and repeated workflow runs are deduplicated by `source_url`.

## Real public sources

The source registry currently enables four public RSS feeds:

- Porsche Newsroom — official Porsche public newsroom feed.
- Motor Authority — public automotive news feed.
- Carscoops — public automotive news feed.
- Car and Driver — public latest-content feed.

These sources are broad automotive feeds and are not assumed to be design-only. Their records require editorial triage before publication.

## Mock and manual data

The original 10 demonstration records remain available for fallback output and layout testing. They use `example.com` URLs and are explicitly marked `is_mock: true` with `collection_method: mock`. The collector also forces any future `example.com` item to mock status so it cannot appear as real collected data.

## Completed in this version

- Added 4 enabled real public RSS sources to `data/sources.json`.
- Implemented fault-tolerant RSS and Atom parsing in `scripts/collect.js` using Node.js built-ins.
- Collected title, source, source URL, published date, short summary, safe feed-metadata image URL, collection timestamp, RSS collection method, and real/mock status.
- Added `example.com` provenance protection and validation.
- Added `source_url` deduplication across new and existing records.
- Updated daily digests, model cards, social drafts, brand notes, and the website viewer to show real/mock/manual provenance and clear source attribution.
- Ranked real RSS-collected items before manual and mock examples.
- Added warnings when no real items are available for the generated day or when the viewer has only mock/manual data.
- Added a website data status section with real and mock/manual counts, last collection time, sources, and collection methods.
- Preserved the boundary that the pipeline does not bypass paywalls or download images.

## How to verify real collection

```bash
npm run collect
```

Expected verification steps:

1. Look for successful `Parsed ... usable item(s)` log lines.
2. Inspect `data/items.json` for `collection_method: "rss"`, `is_mock: false`, and `collected_at`.
3. Confirm real `source_url` values do not use `example.com`.
4. Run `npm run collect` again and confirm the total does not grow from duplicate URLs.
5. Run `npm run pipeline` and review `docs/index.html` plus generated Markdown provenance labels.

## Known limitations

- RSS feed availability and metadata quality vary by publisher.
- Some environments may block outbound feed requests; failures are logged and skipped.
- Broad automotive feeds may collect items unrelated to design or releases.
- Brand and model classification for new RSS items is intentionally conservative and needs editorial review.
- Detailed design fields are not inferred from feed summaries; new real records contain review-pending placeholders.
- The pipeline does not parse article pages, bypass paywalls, download images, assess image rights, or publish content.

## Next recommended step

Add a human editorial triage workflow for real RSS items: approve design relevance, classify brand/model/category, add source-supported observations, and mark records ready for downstream content generation.

## Risks and boundaries

### Copyright and images

The pipeline stores source URLs and feed-provided image URLs only. Human review is required before external image use.

### Source reliability

Public automotive coverage may include rumors, reposts, or incomplete release information. Every collected item remains a draft until reviewed.

### Paywalls and access controls

The collector consumes public feed metadata only and must not bypass paywalls or other access controls.

### Over-automation

Generated digests and social drafts are internal review assets. They must not be auto-published without source verification and editorial approval.
