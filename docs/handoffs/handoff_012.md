# Handoff 012

Date: 2026-06-18

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

### Semantic Image Assets

- Replaced generated Tilda-style image filenames in built pages with semantic filenames.
- Service/page images now use names such as:
  - `alveolar-01.jpg`
  - `nose_surgery-01.jpg`
  - `service-card-exo.png`
  - `doctor-trofimov-01.jpg`
  - `home-trust-01.jpg`
- The rewrite is persistent in `build-site.js` through the semantic image manifest/copy helpers.
- Old `assets/images/tild...` references were removed from generated HTML and old tild files are removed from output image folders during build.
- Updated image ALT report:
  - `docs/image-alt-report.md`
  - `docs/image-alt-report.csv`

### Homepage And Contacts

- Removed the homepage stat/text `ВМП квота · бесплатно`.
- Added secondary possible reception location on `contacts.html`:
  - `УКБ №4 (Университетская клиническая больница №4) многопрофильная клиника Первого МГМУ им. И.М. Сеченова`
  - `г. Москва, ул. Доватора, 15, метро Спортивная`

### Announcement Page

- Added `anons.html`.
- Added `!!! Анонс новых разработок !!!` as the first highlighted item in the desktop and mobile `Наши услуги` menus.
- Built the page in the existing technology/announcement style with the user-provided text about:
  - laser scanned prototyping;
  - mirror-copy reconstruction;
  - 100% reproduction accuracy;
  - polymer matrices with 6-7 micron precision;
  - AI-assisted reconstruction and exo/endoprosthesis prototyping.
- Replaced the announcement hero image with the user-provided face/scan image:
  - source: `anons-hero.png`
  - output: `assets/images/anons-hero.png`
  - output mirror: `site-dist/assets/images/anons-hero.png`
- Hero ALT:
  - `Лазерное сканирование лица и прототипирование экзо- и эндопротезов в Center of Surgery`

### Privacy Policy

- Added a plain text-only privacy policy page:
  - `privacy.html`
  - `site-dist/privacy.html`
- Source text was extracted from:
  - `C:\Users\Artyom\Desktop\Dima\Политика обработки персональных данных.docx`
- Added persistent source text:
  - `privacy-policy.txt`
- The page intentionally has no hero, no cards, no CTA, no contact form, and no footer. It contains only the policy text with simple readable document typography.
- Footer `Политика конфиденциальности` links now point to `privacy.html`.

## Verification

- `git branch --show-current` returned `service-pages-v2`.
- `node build-site.js` completed successfully and reported `Built 33 pages with original design.`
- Root and `site-dist` were rebuilt.
- `git diff --check` passed; Git only reported normal LF/CRLF warnings.
- Verified key markers in root and `site-dist`:
  - `anons.html`
  - `privacy.html`
  - `anons-hero.png`
  - `/anons /anons.html 200`
  - `/privacy /privacy.html 200`
  - sitemap entries for `anons.html` and `privacy.html`
  - no old `assets/images/tild...` refs in generated HTML
- Playwright checks were run with bundled Node and system Chrome:
  - `anons.html` desktop and mobile;
  - `site-dist/anons.html` hero image load;
  - `site-dist/privacy.html`;
  - privacy page has `footerCount: 0`, `formCount: 0`, no mobile overflow, and no console errors.
- `.cursorindexingignore` and `.specstory/` remained untracked and must not be committed.

## Closing Commit

- Work commit message: `add semantic assets and policy pages`
- Work commit: `54c2cd1 add semantic assets and policy pages`
- Push target: `origin/service-pages-v2`
- Push status: succeeded, `3e8b623..54c2cd1 service-pages-v2 -> service-pages-v2`.

## Preview Verification After Push

Checked with Node `fetch` after pushing `54c2cd1`:

- `https://service-pages-v2--cmf-surgery.netlify.app/` returned `200`.
- `https://service-pages-v2--cmf-surgery.netlify.app/anons.html` returned `200`.
- `https://service-pages-v2--cmf-surgery.netlify.app/privacy.html` returned `200`.
- `https://service-pages-v2--cmf-surgery.netlify.app/contacts.html` returned `200`.

Confirmed live preview markers:

- root links: `/anons`, `/privacy`
- announcement markers: `anons-hero.png`, `prototype lab`
- privacy markers: `cmf-surgery.ru`; no `<footer`; no `<form>`
- contacts markers: `map-widget/v1/?mode=search`, `УКБ №4`, `Доватора`, `Спортивная`

## Notes For Next Session

1. Continue on `service-pages-v2`.
2. Do not touch or merge `main` until the user explicitly approves the preview.
3. Persistent edits should continue through `build-site.js`, followed by `node build-site.js`.
4. Netlify should continue publishing prebuilt `site-dist`; build command should stay empty.
5. If more SEO image work is requested, continue from `docs/image-alt-report.md` / `.csv`. Current known follow-up: decorative empty ALT values and duplicate ALT groups still exist.
