# Product Direction

## Product positioning

**Design Intelligence** is an **Automotive Design Intelligence System**, not primarily a public website.

The first product goal is to build an automated pipeline that collects public automotive design information, organizes it into reusable knowledge assets, and turns those assets into daily intelligence and content drafts.

## Primary goal

Build an automated public information collection and content production pipeline that can:

1. Monitor public information about automotive design.
2. Organize new car releases, concept cars, design interviews, and brand design language updates.
3. Convert collected information into structured design cards.
4. Generate daily design intelligence digests.
5. Generate Xiaohongshu-style social media draft content for editorial review.

## What the system should collect

The system should focus on public, attributable sources such as official brand announcements, press releases, design interviews, auto show coverage, public images, and other approved references.

Priority collection categories:

- New production car releases
- Concept cars and design studies
- Designer interviews and studio commentary
- Brand design language updates
- Exterior design details
- Interior design details
- CMF, material, color, and lighting direction
- Design strategy and market-positioning signals

## Core outputs

### Structured design cards

Design cards should summarize each important vehicle, concept, interview, or brand-language update into a consistent format:

- Title
- Brand
- Model or program name
- Category
- Date
- Source name
- Source URL
- Short summary
- Design keywords
- Design observations
- Attribution notes
- Editorial status

### Daily digests

Daily digests should provide a fast, scannable readout of the most important design signals collected that day.

A digest should include:

- Key releases or concepts
- Notable design-language shifts
- Interview insights
- Repeated design themes
- Recommended follow-up cards
- Source links for verification

### Xiaohongshu-style social media drafts

The system should also generate social media draft content inspired by Xiaohongshu editorial formats.

These drafts are **not final posts**. They should be reviewed by a human editor before publishing.

Drafts should include:

- Hook/title options
- Short post body
- Design observation bullets
- Suggested hashtags
- Suggested image notes
- Source attribution notes
- Copyright and reuse cautions

## Website role

The existing website skeleton should be treated as an optional **internal viewer** for the collected knowledge base.

It is not the core product and should not drive product decisions. Its role is to help review collected items, inspect design cards, browse daily digests, and validate attribution before content is produced or shared.

## Planned repository structure

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

## Current implementation boundary

Scraping, crawling, scheduled ingestion, external API integration, and automated publishing are intentionally out of scope for the current repository state.

The current milestone is documentation, mock output structure, and product alignment only.
