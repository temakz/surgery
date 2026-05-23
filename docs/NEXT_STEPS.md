# Next Steps

## Highest Priority

1. Connect the project to GitHub.
   - Current state: no `.git` directory found under `C:\Code6`.
   - Need either an existing GitHub repo URL or permission to initialize a new repo and add a remote.

2. Visual QA in browser.
   - Check homepage desktop and mobile.
   - Check at least these service pages:
     - `tmj_treatment.html`
     - `exo.html`
     - `implantology.html`
     - `nose_surgery.html`
   - Confirm service images open in full-size lightbox.

3. Review service-page content completeness.
   - The generator now includes all long text blocks from raw Tilda HTML.
   - Need spot-check several pages against Tilda screenshots/original content.
   - If exact Tilda ordering matters, improve raw HTML extraction/order section by section.

## Content And Design

1. Decide whether image galleries should show duplicates when Tilda used the same image multiple times.
   - Current behavior: unique meaningful images only.

2. Check whether service-page image cards should use `object-contain` for diagrams/slides instead of `object-cover`.
   - Current behavior: gallery thumbnails are cropped to `4/3`.

3. Confirm homepage service-card copy and order.

4. Confirm doctors section: names, titles, photos.

## Build/Deploy

1. Confirm Netlify Drop package is `C:\Code6\dima2\site-dist`.
2. Check `_redirects` routes.
3. Check `robots.txt` and `sitemap.xml`.
4. After GitHub is connected, push at every session close.
