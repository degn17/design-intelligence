# Product Direction

## Product positioning

**Design Intelligence** is an **Automotive Design Intelligence System**, not primarily a public website.

The product is a lightweight content production pipeline that collects or accepts source-attributed public automotive design information, organizes it into structured knowledge assets, and generates editorial drafts for human review.

The website is an internal viewer over generated files. It should remain simple and static until there is a clear reason to add backend services.

## Primary goal

Build an automated public information collection and content production pipeline that can:

1. Monitor or accept public automotive design information.
2. Organize new car releases, concept cars, design interviews, and brand design language updates.
3. Convert collected information into structured model cards.
4. Generate daily automotive design intelligence digests.
5. Generate brand-language notes by brand.
6. Generate Xiaohongshu-style social media draft content for editorial review.
7. Publish a simple internal viewer from `/docs` without a database or login system.

## Product boundaries

The system must remain safe and understandable:

- No complex backend yet.
- No user login yet.
- No database yet.
- No paywall bypassing.
- No copyrighted image downloads.
- Store source URLs and image URLs only.
- Keep all generated content source-attributed.
- Use mock/manual data first; add real collection only after source review.
- Keep GitHub Actions easy to inspect and run.

## What the system should collect

Priority categories:

- New production car releases
- Concept cars and design studies
- Designer interviews and studio commentary
- Brand design language updates
- Auto show design signals
- Exterior, interior, CMF, lighting, proportion, and design-strategy signals

Approved source types should include public official brand announcements, public press rooms, public RSS feeds, reputable public coverage, and manually entered editorial notes. Paywalled or unclear-rights material should be excluded until a human defines usage rules.

## Core outputs

### Daily digests

Daily digests should provide a fast, scannable readout of the most important design signals. Each digest should include:

- Today's important items
- New car releases
- Concept cars
- Design interviews
- Brand language updates
- Design trend observations
- Items worth turning into social content
- Manual review checklist
- Source attribution for every item

### Structured model cards

Model cards should normalize each important vehicle or concept into a consistent format:

- Title, brand, model, category, and date
- Source name and source URL
- Image URL reference only
- Short summary
- Design keywords
- Proportion, volume, surface, graphic, and brand-language observations
- Designer/editorial note

### Brand language notes

Brand pages should aggregate items by brand and help identify repeated design signals, design-language shifts, and open questions for future review.

### Xiaohongshu-style social drafts

Social drafts are **not final posts**. They should support a human editor by providing:

- Three title options
- Suggested cover text
- Five to seven page/image structure
- Main body draft
- Design keywords
- Source attribution
- Manual review warnings

## Internal viewer role

The internal viewer in `docs/index.html` should show the current data state, latest digest preview, model-card links, brand-language notes, social draft preview, and source attribution. It should prioritize readability and mobile access over visual complexity.

If GitHub Pages is currently published from `/docs`, keep that working. Later, Pages can be switched to GitHub Actions deployment when automated update reliability becomes more important.

## Recommended build sequence

1. Keep the JSON schema stable and easy to validate.
2. Use mock/manual data to test generated outputs.
3. Add conservative RSS collection only after source approval.
4. Add human review fields before real publishing workflows.
5. Add AI summarization only with strict attribution and claim-review rules.
6. Consider a database only when flat JSON becomes a real bottleneck.
