# Handoff 010

Date: 2026-06-11

## Session Close

This session continued on the `service-pages-v2` preview branch. Production `main` was not touched.

## Current Branches

- Production branch: `main`
- Current work branch: `service-pages-v2`
- Remote branch: `origin/service-pages-v2`
- Production URL: `https://cmf-surgery.netlify.app/`
- Preview URL: `http://service-pages-v2--cmf-surgery.netlify.app/`
- Netlify publish directory remains `site-dist`.
- Netlify build command must remain empty or `echo "No build"`.

## What Changed

### Global / Homepage / Navigation

- Updated homepage social preview title to:
  - `Center of Surgery – Центр реконструктивной хирургии.`
- Preserved the completed removal of `free.html` / quota VMP content from files, services, redirects, and sitemap.
- Added compact `Возможности лечения по бюджету` notice to all 20 service pages in the `Наши услуги` section.
- Replaced doctor dropdown color placeholders with real doctor photos:
  - Trofimov: `assets/images/tild6635-3665-4464-b939-353132636135_02-00.jpg`
  - Kravchenko: `assets/images/tild6433-6365-4363-b836-346539643963_doc2.jpg`

### Service Pages

- `mouthguards.html`
  - Added two patient information blocks about neurologic protection and spring properties of the mouthguard.
  - Reworked details section with original requirements and sports mouthguard type text.
  - Removed the first gallery photo from output.

- `exo.html`
  - Updated title and hero wording to `Экзопротезирование лица`.
  - Added treatment blocks for:
    - `протезы лица`
    - `протезирование лица`
    - `протезы носа`
    - `протезирование носа`
  - Added intro plaque:
    - `Экзопротезирование лица - лицевое протезирование, протезирование уха, ушной раковины, протезирование глаза, протезирование носа.`
  - Added new hero image from user reference as `exo-hero.png`, copied by the build into `assets/images/exo-hero.png` and `site-dist/assets/images/exo-hero.png`.
  - Hidden all gallery photos except the last two behind existing sensitive-media reveal plaques.

- `nose_surgery.html`
  - Reworked `О направлении`, `С чем обращаются`, detail copy, and methods list with the user-provided text.
  - Kept the approved polished service-page style and used non-bold body text where requested.

### Specialist Pages

- `trofimov.html`
  - Replaced generic service-like layout with a dedicated specialist/resume layout.
  - Restored original text from `https://cmf-surgery.ru/trofimov` without cutting the publication list.
  - Added biography, profile, scientific work, professional recognition, publication/work list, and photo sections.
  - Publication cards were compacted and text was kept 1:1 with the original, including original spelling.

- `kravchenko.html`
  - Replaced generic service-like layout with the same specialist style used on `trofimov.html`.
  - Original text was taken from `https://cmf-surgery.ru/kravchenko` and kept without cuts.
  - Added education/practice, qualification upgrades, scientific/practical directions, specialization, research/development, and photo sections.
  - Fixed a renderer bug where the header became `undefined`; `kravchenko.html` now uses the shared `parts.nav` header.
  - Matched the Kravchenko hero styling to Trofimov: same breadcrumb placement, badge style, hero spacing, CTA style, and photo card treatment.

## Verification

- `git branch --show-current` returned `service-pages-v2`.
- `node build-site.js` completed successfully and reported `Built 31 pages with original design.`
- `git diff --check` passed; Git only reported normal LF/CRLF warnings during diff/status commands.
- Verified key requested text/images in root output and `site-dist` for:
  - `mouthguards.html`
  - `exo.html`
  - `nose_surgery.html`
  - `trofimov.html`
  - `kravchenko.html`
  - `index.html`
- Verified `kravchenko.html` and `site-dist/kravchenko.html` contain the shared `<header class="sticky top-0...">` and no `undefined` marker.
- Verified doctor dropdowns in root and `site-dist` contain photo `<img>` tags instead of gradient placeholders.
- `.cursorindexingignore` and `.specstory/` remained untracked and must not be committed.

## Closing Commit

- Commit message: `polish specialist pages and service details`
- Push target: `origin/service-pages-v2`

## Next Session Plan

1. Check the Netlify preview after push:
   - `http://service-pages-v2--cmf-surgery.netlify.app/`
   - `http://service-pages-v2--cmf-surgery.netlify.app/trofimov.html`
   - `http://service-pages-v2--cmf-surgery.netlify.app/kravchenko.html`
   - `http://service-pages-v2--cmf-surgery.netlify.app/exo.html`
   - `http://service-pages-v2--cmf-surgery.netlify.app/mouthguards.html`
   - `http://service-pages-v2--cmf-surgery.netlify.app/nose_surgery.html`
2. Visually QA specialist hero alignment and doctor dropdown photos on desktop and mobile.
3. Continue any remaining page-specific review tasks from the user.
4. Do not merge `service-pages-v2` into `main` until the user explicitly approves the preview.
