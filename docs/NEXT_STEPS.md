# Next Steps

## Highest Priority

1. Continue visual QA in browser after each content/design pass.
   - GitHub is connected: `https://github.com/temakz/surgery.git`
   - Branch: `main`
   - First push completed by the user on 2026-05-23.
   - Netlify is connected: `https://cmf-surgery.netlify.app/`
   - Netlify publishes prebuilt `site-dist` with empty build command.

2. Next design/content scope.
   - Specialists, technologies, recommendations, doctors and contact-like pages still need a separate layout/design pass.
   - Current service-page cleanup was applied through `build-site.js`, so secondary generated pages also inherited the cleaner generic renderer until a dedicated layout replaces it.

3. Review service-page content completeness.
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
4. Push at every session close.
5. Confirm Netlify deploy succeeds after every push.
