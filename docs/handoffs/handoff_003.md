# Handoff 003

Date: 2026-06-04

## Scope

Worked on the 21 priority service pages:

- `exo`, `nose_surgery`, `free`, `tmj_treatment`, `implantology`, `nasal_surgery`, `microsurgical`, `scars`, `cleft`, `tmj_dysfunction`, `tmj`, `orthognathic_surgery`, `ilizarov_method`, `plastic_surgeries`, `alveolar`, `face_surgery`, `restoration`, `surgical_dentistry`, `bite_restoration`, `mouthguards`, `endolifting`.

## Changes

- Updated `build-site.js` so service pages choose the original site hero image from Tilda/OG metadata when possible.
- Changed service hero media from a square/vertical card to a wide rectangular image card with eager loading and high fetch priority.
- Removed parser-style duplication by splitting extracted content into prose, bullets, cards, detail copy and tags.
- Replaced the old `Ключевые запросы` presentation with a softer `С чем обращаются` tag block.
- Added dedupe guards so the same long phrase does not repeat between lead, intro, cards, detail and tags.
- Included `exo.html` in the generated service-page template instead of preserving the raw parsed page.

## Verification

- `node --check build-site.js`
- `node build-site.js`
- Checked all 21 priority pages for existing hero image files and absence of `Ключевые запросы`.
- Checked local root and `site-dist` for broken local image references: `brokenImages=0`.
- Checked root/site-dist sync for representative files: `exo.html`, `scars.html`, `tmj_treatment.html`, `implantology.html`, `_redirects`, `robots.txt`, `sitemap.xml`.
- Unicode duplicate-content scan across the 21 service pages: `totalDuplicatePhrases=0` for long chunks.
- Headless Chrome local QA:
  - desktop/mobile `scars.html`, `tmj_treatment.html`, `exo.html`, `implantology.html`
  - hero loaded, no horizontal overflow, old keyword block absent
  - `scars.html` lightbox opens
  - gallery images load after real scroll

Screenshots:

- `C:\tmp\surgery-scars-desktop-after.png`
- `C:\tmp\surgery-scars-mobile-after.png`

## Notes

- Branch decision after the local QA: keep production `main` untouched and publish this work as a separate preview branch named `service-pages-v2`.
- Next session should continue from `service-pages-v2`; merge into `main` only after review approval.
- Specialists, technologies, recommendations and related secondary pages still need a separate design/layout pass later.
- `.cursorindexingignore` and `.specstory/` are still untracked and were not added.
