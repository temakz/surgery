# Next Steps

## Current Timeweb Migration State

Branch:
- `timeweb-migration`

Latest pushed commit:
- `486bd2400d6560a4649b1f5654c484b5b2a63186 chore: secure smtp configuration`

Recent migration chain:
- `5438a2a chore: persist apache routing config`
- `ce5c59b content: remove diagnostic center recommendations`
- `960646b feat: replace youtube cards with local video players`
- `7b7e655 content: remove free consultation claims`
- `5ec8e81 refactor: prepare forms for php handler`
- `79a6f24 feat: add secure php form handler`
- `b92607e feat: add smtp mail delivery`
- `486bd24 chore: secure smtp configuration`

What is done:
- Apache `.htaccess` exists in the project root and is copied into `site-dist`.
- Clean-URL Apache rewrite rules are prepared without changing canonical,
  sitemap, robots, or internal links.
- The diagnostic-center recommendation block was removed from `onlinehelp`.
- YouTube cards on `tmj_treatment` and `tmj_dysfunction` were replaced with
  local HTML5 MP4 players. MP4 files are not tracked in Git.
- Visible "free consultation" claims were removed or normalized.
- Four forms now post to `/send-form.php` with `form_type` values:
  `book`, `exo`, `review`, `online`.
- Netlify form attributes were removed from the four forms.
- Required privacy consent and honeypot fields are present.
- `send-form.php` validates input, rate-limits, suppresses duplicates, validates
  review uploads, and returns JSON.
- PHPMailer SMTP delivery is implemented, using only private config values.
- SMTP config path is now `private/form-config.php`.
- `private/.htaccess` denies public access to private config.

Important current behavior:
- The forms currently submit with normal browser POST navigation.
- There is no frontend submit interception/AJAX handler.
- On success or failure, the user sees the JSON response from `/send-form.php`.
- A future task should add inline frontend success/error UI after real hosting
  behavior is confirmed.

Before the next deploy/test on Timeweb:
- create real `private/form-config.php` on the server manually from
  `form-config.example.php`;
- do not commit real SMTP credentials;
- ensure `vendor/` exists physically in the uploaded package even though it is
  ignored by Git;
- check that `site-dist/private/form-config.php` is absent unless manually
  provisioned on the server outside Git;
- check that `site-dist/private/.htaccess` exists;
- check that `site-dist/send-form.php` matches the intended root handler.

Open follow-ups:
- Decide whether to add AJAX/inline frontend handling for all four forms.
- Confirm final Timeweb upload workflow: upload committed files plus ignored
  `vendor/`, and provision `private/form-config.php` separately.
- Re-test real SMTP delivery on Timeweb after the private config is installed.
- Remove or ignore any temporary server diagnostic files; none should be
  committed.

## Highest Priority

1. Current production state after service-page v2 approval.
   - GitHub is connected: `https://github.com/temakz/surgery.git`
   - Production branch: `main`
   - Service-page v2 branch: `service-pages-v2`
   - Historical service-page v2 release baseline: `e517528 add import and commercial offer pages`
   - Last synced static-site commit before Timeweb migration:
     `f3b3ff0 feat: restore analytics and site verification`
   - Active migration branch: `timeweb-migration`
   - `service-pages-v2` was approved and fast-forward merged into `main` on 2026-07-14.
   - Production URL: `https://cmf-surgery.netlify.app/`
   - Preview URL, retained for comparison: `http://service-pages-v2--cmf-surgery.netlify.app/`
   - First push completed by the user on 2026-05-23.
   - Netlify is connected: `https://cmf-surgery.netlify.app/`
   - Netlify publishes prebuilt `site-dist` with empty build command.
   - Do not run `node build-site.js` in Netlify UI.

2. Continue production QA after the completed merge.
   - Check `https://cmf-surgery.netlify.app/`.
   - Latest Timeweb migration handoff: see `docs/handoffs/handoff_016.md`.
   - Latest service-page v2 production merge handoff: see `docs/handoffs/handoff_015.md`.
   - Latest static-site commit pushed to both `main` and `service-pages-v2` before Timeweb migration:
     `f3b3ff0 feat: restore analytics and site verification`.
   - Production HTTP checks passed on 2026-07-14:
     - `/` returned `200`;
     - `/contacts.html` returned `200`;
     - `/importozameshchenie.html` returned `200`;
     - `/commercial_offer.html` returned `200`;
     - `/assets/css/site.css` returned `200` with `text/css`.
   - Production marker checks passed for the MAX contact card/link, Sechenov/Dovatora address, import replacement page, and commercial offer page.
   - Latest local Tailwind CSS migration and local visual smoke: see `docs/handoffs/handoff_014.md`.
   - Tailwind CDN removal commit: `e2629c2 remove tailwind cdn`.
   - Current 2026-06-19 closing pass includes:
     - production-domain canonical, Open Graph, Twitter card, JSON-LD, and sitemap normalization for `https://cmf-surgery.ru`;
     - generated `404.html` and removed VMP/free-treatment redirects to 404;
     - duplicate-H1 risk fix for recommendation print pages;
     - homepage service-card WebP thumbnails with `srcset` / `sizes`;
     - lazy/async image loading for below-fold homepage, gallery, YouTube, and dropdown images;
     - homepage hero preload;
     - async Google Fonts loading.
   - Current 2026-06-19 follow-up closing pass includes:
     - removed `https://cdn.tailwindcss.com` and inline `tailwind.config` from generated root and `site-dist` HTML;
     - added local generated Tailwind output at `assets/css/site.css` and `site-dist/assets/css/site.css`;
     - added `tailwind.config.js` and `assets/css/site.tailwind.css` for local CSS regeneration;
     - updated `build-site.js` to replace the CDN/config block with the local stylesheet and copy CSS into `site-dist`;
     - verified homepage, priority service pages, `anons`, `privacy`, `contacts`, forms, mobile menu, and lightbox locally.
   - Latest semantic assets and policy work: `54c2cd1 add semantic assets and policy pages`; see `docs/handoffs/handoff_012.md`.
   - Current 2026-06-18 follow-up closing pass includes:
     - semantic image asset renaming through `build-site.js`;
     - updated image ALT report files;
     - new `anons.html` page and highlighted `Наши услуги` menu entry;
     - user-provided `anons-hero.png` hero image;
     - homepage removal of `ВМП квота · бесплатно`;
     - contacts secondary reception location at УКБ №4 / ул. Доватора, 15;
     - new plain text-only `privacy.html` page from the provided DOCX;
     - footer privacy link changed from `#` to `privacy.html`.
   - Previous pushed and preview-verified work: `0125baa polish secondary pages and contact flow`; see `docs/handoffs/handoff_011.md`.
   - Current 2026-06-18 closing pass includes:
     - dedicated recommendation pages for `analyzes` and `oral_hygiene` with print/PDF controls;
     - dedicated technology pages for `newtech_imp`, `newtech_ekzo`, and `newtech_tmj`;
     - rebuilt `reviews`, `onlinehelp`, and `contacts` pages;
     - live contact address/Yandex map update;
     - homepage hero clinic photo, new favicon, footer text update, and MAX button/social updates.
   - Previous 2026-06-11 closing pass includes:
     - `mouthguards` content/detail/gallery edits;
     - `exo` title/cards/hero image/sensitive-gallery edits;
     - `nose_surgery` content and methods edits;
     - compact `Возможности лечения по бюджету` notices on all 20 service pages;
     - dedicated specialist layouts for `trofimov` and `kravchenko`;
     - doctor photos in the `Наши специалисты` header dropdown;
     - homepage social preview title update.
   - Priority QA pages: homepage, `anons`, `privacy`, `contacts`, `reviews`, `onlinehelp`, `analyzes`, `oral_hygiene`, `newtech_imp`, `newtech_ekzo`, `newtech_tmj`, plus previous priority pages `mouthguards`, `exo`, `nose_surgery`, `trofimov`, `kravchenko`, header doctor dropdown photos, mobile menu numbering, lightbox, and selective sensitive-photo reveal banners.
   - `tmj_treatment` preview was confirmed updated after push: status `200`, compact YouTube thumbnail cards present, restored TMJ text present.

3. Service-page review is closed.
   - The approved `nose_surgery` sample polish has now been generalized through `build-site.js`.
   - Root HTML and `site-dist` were rebuilt and pushed.
   - `service-pages-v2` was merged into `main` after explicit user approval.
   - `main` and `service-pages-v2` should remain synced after the documentation closeout.
   - Persistent rule for future service-page work: customize upcoming service pages by reusing the already approved `nose_surgery`, `tmj_treatment`, `implantology`, and `microsurgical` patterns first. Add only small new details when those patterns do not fit.
   - Preserve the compact `sensitive-media` reveal banner for selected clinical/operative gallery images. It is controlled by curated image filename patterns in `build-site.js`; avoid hiding entire pages or broad image ranges unless the user explicitly asks.
   - For future changes, confirm whether to work directly on `main` or create a new preview branch.

4. Next design/content scope after service-page approval.
   - New pages added in the closing production merge:
     - `importozameshchenie.html`
     - `commercial_offer.html`
   - Both are linked from homepage/service navigation and included in generated root output and `site-dist`.
   - Specialists `trofimov` and `kravchenko` now have dedicated biography/resume layouts.
   - Technologies, recommendations, reviews, online consultation, and contacts now have dedicated layout/design passes.
   - Doctors index-like sections may still need separate layout/design passes.
   - Current service-page cleanup was applied through `build-site.js`, so secondary generated pages still inherit the cleaner generic renderer until a dedicated layout replaces them.

5. Review service-page content completeness.
   - The active service list now has 20 pages after removing `free.html` / `Бесплатное лечение по квоте ВМП`.
   - The 20 priority service pages now use the original Tilda/OG hero image as a rectangular top image.
   - Long parser duplicates were removed from service content by separating prose, bullet items, tags and detail copy.
   - Need medical/editorial spot-check for wording quality and exact order against the original site where it matters.
   - `tmj_treatment` received extra manual restoration of lost long-form content and video thumbnail links during the 2026-06-05 session.
   - `implantology` and `microsurgical` received page-specific content/layout passes during the 2026-06-05 follow-up session.
   - `scars`, `cleft`, `tmj_dysfunction`, `tmj`, `orthognathic_surgery`, `ilizarov_method`, `plastic_surgeries`, `alveolar`, `face_surgery`, `restoration`, `surgical_dentistry`, `bite_restoration`, and `endolifting` received page-specific content/layout passes during the 2026-06-10 work; verify final wording and sensitive-image selection visually on preview.
   - `mouthguards`, `exo`, and `nose_surgery` received additional user-directed content/layout passes during the 2026-06-11 work; verify final wording against the original/user screenshots where exact text matters.
   - Specialist pages `trofimov` and `kravchenko` now use original source text from `cmf-surgery.ru` and should be visually checked as biography/resume pages, not service pages.
   - Follow-up still open from the contacts request: the user mentioned legal-entity details from "screenshot 2", but only one screenshot was available in the thread. Add the full legal-entity info to `contacts` if the missing screenshot/details are provided.

## Content And Design

1. Decide whether image galleries should show duplicates when Tilda used the same image multiple times.
   - Current behavior: unique meaningful images only.

2. Check whether service-page image cards should use `object-contain` for diagrams/slides instead of `object-cover`.
   - Current behavior: probable diagrams/slides use `object-contain`; photos use `object-cover`.

3. Confirm homepage service-card copy and order after the service list was reduced from 21 to 20 items.

4. Confirm doctors section: names, titles, photos.
   - Header dropdown doctor previews now use real photos instead of gradient placeholders.

## Build/Deploy

1. Confirm Netlify Drop package is `C:\Code6\dima2\site-dist`.
2. Check `_redirects` routes.
3. Check `robots.txt` and `sitemap.xml`.
4. The service-page v2 approval merge is complete; historical site release baseline is `e517528`.
   Current synced static-site baseline before Timeweb migration is `f3b3ff0`.
5. For future work, confirm the target branch before editing:
   - use `main` for approved production fixes;
   - use a new preview branch for larger review cycles.
6. Confirm Netlify deploy succeeds after any push/merge that affects production.
7. Netlify production HTTP checks passed after the 2026-07-14 merge; see `docs/handoffs/handoff_015.md`.

## SEO / Images

1. Continue image ALT review from:
   - `docs/image-alt-report.md`
   - `docs/image-alt-report.csv`
2. Current image renaming system is persistent in `build-site.js`.
3. Current SEO/PageSpeed system is persistent in `build-site.js`.
   - SEO tags and sitemap should keep `https://cmf-surgery.ru` for the migration target.
   - Homepage service cards should keep using generated WebP thumbnails.
   - Removed `free` / `free.html` should keep returning 404 unless the user changes strategy.
4. Follow-up items still visible in the report:
   - decorative empty ALT values;
   - duplicate non-empty ALT groups.

## Performance / CSS

1. Tailwind CDN removal is implemented locally.
   - Generated HTML now links `assets/css/site.css`.
   - Root and `site-dist` both have `tailwindCdn=0` and `tailwindConfig=0`.
   - CSS source/build files:
     - `tailwind.config.js`
     - `assets/css/site.tailwind.css`
     - `assets/css/site.css`
     - `site-dist/assets/css/site.css`
   - Local rebuild remains `node build-site.js`; Netlify build command must stay empty because `site-dist` is prebuilt.
   - To regenerate CSS after future class changes, run locally:
     `npx.cmd -y tailwindcss@3.4.17 -c tailwind.config.js -i assets/css/site.tailwind.css -o assets/css/site.css --minify`
     then `node build-site.js`.
2. Tailwind CDN removal preview smoke passed after push.
   - `https://service-pages-v2--cmf-surgery.netlify.app/` returned `200`.
   - `https://service-pages-v2--cmf-surgery.netlify.app/contacts.html` returned `200`.
   - `https://service-pages-v2--cmf-surgery.netlify.app/assets/css/site.css` returned `200` with `text/css`.
   - Preview homepage and contacts markers: `assets/css/site.css` present, `cdn.tailwindcss.com=0`, `tailwind.config=0`.
3. Rerun PageSpeed on production and compare:
   - mobile FCP/LCP;
   - desktop render-blocking requests;
   - visual parity.
