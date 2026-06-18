# Next Steps

## Highest Priority

1. Current preview branch workflow.
   - GitHub is connected: `https://github.com/temakz/surgery.git`
   - Production branch: `main`
   - Service-page v2 preview branch: `service-pages-v2`
   - Service-page v2 preview URL: `http://service-pages-v2--cmf-surgery.netlify.app/`
   - Do not push this work directly to `main` until the local preview is approved.
   - After approval, merge `service-pages-v2` into `main`.
   - First push completed by the user on 2026-05-23.
   - Netlify is connected: `https://cmf-surgery.netlify.app/`
   - Netlify publishes prebuilt `site-dist` with empty build command.

2. Continue visual QA on the preview deployment after the completed service-page polish rollout.
   - Check `http://service-pages-v2--cmf-surgery.netlify.app/`.
   - Latest pushed and preview-verified work: `0125baa polish secondary pages and contact flow`; see `docs/handoffs/handoff_011.md`.
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
   - Priority QA pages: homepage, `contacts`, `reviews`, `onlinehelp`, `analyzes`, `oral_hygiene`, `newtech_imp`, `newtech_ekzo`, `newtech_tmj`, plus previous priority pages `mouthguards`, `exo`, `nose_surgery`, `trofimov`, `kravchenko`, header doctor dropdown photos, mobile menu numbering, lightbox, and selective sensitive-photo reveal banners.
   - `tmj_treatment` preview was confirmed updated after push: status `200`, compact YouTube thumbnail cards present, restored TMJ text present.

3. Approve or continue service-page review.
   - The approved `nose_surgery` sample polish has now been generalized through `build-site.js`.
   - Root HTML and `site-dist` were rebuilt and pushed to `origin/service-pages-v2`.
   - Do not merge to `main` until the user explicitly approves the preview.
   - Persistent rule for the rest of the review: customize upcoming service pages by reusing the already approved `nose_surgery`, `tmj_treatment`, `implantology`, and `microsurgical` patterns first. Add only small new details when those patterns do not fit.
   - Preserve the compact `sensitive-media` reveal banner for selected clinical/operative gallery images. It is controlled by curated image filename patterns in `build-site.js`; avoid hiding entire pages or broad image ranges unless the user explicitly asks.

4. Next design/content scope after service-page approval.
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
4. For the current service-page v2 work, push to `service-pages-v2` first.
5. Push or merge to `main` only after review approval.
6. Confirm Netlify deploy succeeds after any push/merge that affects production.
