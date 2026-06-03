# Data Schema

This project uses flat JSON files instead of a database. `data/items.json` is the canonical knowledge base for generated outputs.

## Item fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable kebab-case identifier. |
| `title` | string | Human-readable item title. |
| `brand` | string | Brand, studio, organization, or source name pending editorial classification. |
| `model` | string | Vehicle model, concept, program label, or feed title pending editorial classification. |
| `category` | enum | One of `new_car`, `concept_car`, `design_interview`, `brand_language`, `auto_show`, `other`. |
| `published_date` | string | Source publication date in `YYYY-MM-DD` format. |
| `source` | string | Source display name retained in every generated output. |
| `source_url` | string | Canonical public item URL used for attribution and deduplication. |
| `image_url` | string | Optional feed-provided image URL. Images are never downloaded. |
| `short_summary` | string | Short feed-provided or manually paraphrased summary. |
| `collection_method` | enum | One of `rss`, `mock`, `manual`. |
| `is_mock` | boolean | `true` for mock records. All `example.com` records must be mock. |
| `collected_at` | string | ISO timestamp for RSS-collected records. |
| `design_keywords` | string[] | Human-reviewed design keywords; may be empty for new RSS records. |
| `design_observations` | string[] | Human-reviewed design observations; may be empty for new RSS records. |
| `proportion_observation` | string | Proportion analysis or a review-pending placeholder. |
| `volume_observation` | string | Volume analysis or a review-pending placeholder. |
| `surface_observation` | string | Surface analysis or a review-pending placeholder. |
| `graphic_observation` | string | Graphic analysis or a review-pending placeholder. |
| `brand_language_observation` | string | Brand-language analysis or a review-pending placeholder. |
| `designer_note` | string | Editorial caution or follow-up note. |
| `created_at` | string | ISO timestamp for dataset creation. |
| `updated_at` | string | ISO timestamp for the latest dataset update. |

## Validation and provenance expectations

- `source_url` must be a valid URL and is the deduplication key.
- An `example.com` item cannot be real or use `collection_method: "rss"`.
- Real collected items use `collection_method: "rss"`, `is_mock: false`, and include `collected_at`.
- Manual non-mock items use `collection_method: "manual"`; demonstration items use `collection_method: "mock"`.
- Generated content must retain source attribution and display provenance status.
- Image handling stores URLs only. Do not download or commit source images.

## Source registry fields

Each entry in `data/sources.json` includes `id`, `name`, `type`, `url`, `category_hint`, `enabled`, and `notes`. The current collector supports enabled `rss` sources and logs manual sources without network collection.

## Collection boundary

The collector reads public RSS or Atom feed metadata only. It does not open article pages, bypass paywalls, or download images. Feed failures are logged and skipped so one unavailable source does not stop the pipeline.
