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

2. Continue visual QA on the preview deployment after each content/design pass.
   - Check `http://service-pages-v2--cmf-surgery.netlify.app/`.
   - Priority pages: homepage, `scars`, `tmj_treatment`, `exo`, `implantology`, mobile layout and lightbox.

3. Next design/content scope.
   - Specialists, technologies, recommendations, doctors and contact-like pages still need a separate layout/design pass.
   - Current service-page cleanup was applied through `build-site.js`, so secondary generated pages also inherited the cleaner generic renderer until a dedicated layout replaces it.

4. Review service-page content completeness.
   - The 21 priority service pages now use the original Tilda/OG hero image as a rectangular top image.
   - Long parser duplicates were removed from service content by separating prose, bullet items, tags and detail copy.
   - Need medical/editorial spot-check for wording quality and exact order against the original site where it matters.

## Content And Design

1. Decide whether image galleries should show duplicates when Tilda used the same image multiple times.
   - Current behavior: unique meaningful images only.

2. Check whether service-page image cards should use `object-contain` for diagrams/slides instead of `object-cover`.
   - Current behavior: probable diagrams/slides use `object-contain`; photos use `object-cover`.

3. Confirm homepage service-card copy and order.

4. Confirm doctors section: names, titles, photos.

## Build/Deploy

1. Confirm Netlify Drop package is `C:\Code6\dima2\site-dist`.
2. Check `_redirects` routes.
3. Check `robots.txt` and `sitemap.xml`.
4. For the current service-page v2 work, push to `service-pages-v2` first.
5. Push or merge to `main` only after review approval.
6. Confirm Netlify deploy succeeds after any push/merge that affects production.
