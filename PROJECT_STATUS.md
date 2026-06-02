# Project Status

## Current direction

The project direction has shifted from a website-first MVP to an **Automotive Design Intelligence System**.

The first goal is to build an automated public information collection and content production pipeline. The system should collect public information about new car releases, concept cars, design interviews, and brand design language updates; organize that information into structured design cards; generate daily digests; and produce Xiaohongshu-style social media draft content for human editorial review.

The website is only an optional internal viewer for the collected knowledge base. It is not the core product and should not drive the system architecture.

## Completed work

- Added product direction documentation in `PRODUCT_DIRECTION.md`.
- Updated `README.md` to describe the repository as an automotive design intelligence pipeline project rather than a public website.
- Kept the existing static website skeleton in `docs/index.html` and reframed it as an internal knowledge-base viewer.
- Preserved mock knowledge-base records in `data/items.json`.
- Added a mock source registry in `data/sources.json`.
- Added the planned repository structure:
  - `data/items.json`
  - `data/sources.json`
  - `daily/`
  - `content/models/`
  - `content/brands/`
  - `content/social/xiaohongshu-drafts/`
  - `scripts/`
  - `docs/`
- Added sample mock outputs:
  - `daily/2026-06-02-daily-digest.md`
  - `content/models/aurora-a9-e-suv-design-card.md`
  - `content/social/xiaohongshu-drafts/aurora-a9-e-suv-draft.md`

## How to test the current internal viewer

From the repository root, run a local static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/docs/
```

Expected result:

- The Automotive Design Intelligence internal viewer loads.
- The four sections are visible.
- Cards render from `data/items.json`.
- Source links open in a new browser tab.

## Next step

Do not implement scraping yet.

The next step is to define the ingestion and generation contracts before writing any crawler or scraper:

1. Define the approved source registry schema in `data/sources.json`.
2. Define the canonical design-card schema for `content/models/` and `content/brands/`.
3. Define daily digest generation rules for `daily/`.
4. Define Xiaohongshu-style draft generation rules for `content/social/xiaohongshu-drafts/`.
5. Define editorial review states, including draft, reviewed, approved, and archived.
6. Define source attribution, quote limits, image reuse rules, and copyright review requirements.

## Known risks

### Copyright and content reuse

The system will rely on public information, but public availability does not mean unrestricted reuse. Production workflows must avoid copying long passages, reposting protected images without permission, or presenting source material as original reporting.

### Source attribution

Every generated design card, digest item, and social draft should preserve source name, source URL, access date, and attribution notes. The source registry should make attribution requirements explicit before automated collection begins.

### Quotation accuracy

Design interviews and public comments from designers can be sensitive. The system should distinguish between direct quotes, paraphrases, and model-generated interpretation. Direct quotes should be short, verified, and linked to the original source.

### Hallucinated design claims

Automated summaries can overstate design intent. The system should separate observed visual facts from inferred design interpretation and require human review before publication.

### Source reliability

Auto show coverage, rumors, leaks, and reposted images can be inaccurate. Source records should include type, reliability, and approval status before being used in generated outputs.

### Image rights

Automotive design content is image-heavy. Image use must be reviewed separately from text summarization. Social drafts should include image suggestions or source links rather than assuming images can be reused.

### Brand and platform compliance

Xiaohongshu-style drafts should be treated as editorial drafts, not automated publishing instructions. Final posts need human review for platform tone, brand risk, attribution, and claims accuracy.
