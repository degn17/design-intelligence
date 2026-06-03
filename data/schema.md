# Data Schema

This project uses flat JSON files instead of a database. The current goal is a safe, easy-to-run content production pipeline that can later be expanded with carefully reviewed collection logic.

## `data/items.json`

`items.json` is the canonical knowledge base for generated outputs. Each record represents one attributable automotive design intelligence item.

### Required fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable kebab-case identifier. Prefer brand/model/date context. |
| `title` | string | Human-readable title for the item. |
| `brand` | string | Automotive brand, studio, or organization. |
| `model` | string | Vehicle model, concept name, or program label. |
| `category` | enum | One of `new_car`, `concept_car`, `design_interview`, `brand_language`, `auto_show`, `other`. |
| `published_date` | string | ISO date, `YYYY-MM-DD`, from the source or manual editorial record. |
| `source` | string | Source display name. Must be preserved in every generated output. |
| `source_url` | string | Canonical public source URL. Used for deduplication and attribution. |
| `image_url` | string | Link to an image or media page only. Do not download copyrighted images into the repo. |
| `short_summary` | string | Short paraphrased summary. Avoid long copied passages. |
| `design_keywords` | string[] | 3-8 design keywords for filtering and content drafting. |
| `design_observations` | string[] | Attributable or visually observable design notes. Separate observation from speculation. |
| `proportion_observation` | string | Notes on stance, package, overhangs, cabin position, wheelbase, or silhouette. |
| `volume_observation` | string | Notes on major massing and body/cabin volume relationships. |
| `surface_observation` | string | Notes on surfacing, highlights, feature lines, texture, and material impression. |
| `graphic_observation` | string | Notes on lamps, DLO, trim, contrast blocks, badges, and other 2D identity graphics. |
| `brand_language_observation` | string | Notes on how the item fits or changes a brand design language. |
| `designer_note` | string | Editorial caution, review note, or suggested follow-up angle. |
| `created_at` | string | ISO timestamp for when the item was created in the dataset. |
| `updated_at` | string | ISO timestamp for the most recent dataset update. |

### Validation expectations

- `id`, `title`, `source`, and `source_url` must be non-empty.
- `category` must match the enum list.
- `published_date` must be a valid ISO date string.
- Every generated content item must include `source` and `source_url` attribution.
- Image handling stores URLs only. Do not download or commit copyrighted images.
- Automated summaries should be treated as draft analysis until reviewed by a human editor.

## `data/sources.json`

`sources.json` is a lightweight registry of approved or planned sources.

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable source identifier. |
| `name` | string | Source display name for logs and attribution. |
| `type` | enum | One of `rss`, `website`, `manual`. |
| `url` | string | Source homepage, feed URL, or local manual reference. |
| `category_hint` | string | Default category suggestion for future collected records. |
| `enabled` | boolean | Disabled sources are logged but skipped. |
| `notes` | string | Attribution, copyright, reliability, paywall, or parsing notes. |

## Collection boundary

The current collector is intentionally conservative. It supports manual/mock mode and logs disabled RSS placeholders. Future RSS parsing should remain fault-tolerant, deduplicate by `source_url`, and skip invalid records instead of failing the whole pipeline.
