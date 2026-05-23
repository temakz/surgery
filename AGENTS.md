# Project Agent Rules

## Project

Static website rebuild for `cmf-surgery.ru` in `C:\Code6\dima2`.

Stack:
- HTML5
- Tailwind CSS via CDN/runtime classes in static HTML
- Vanilla JS
- Static output prepared for Netlify Drop

Primary generator:
- `C:\Code6\dima2\build-site.js`

Generated outputs:
- Root HTML files in `C:\Code6\dima2`
- Deploy mirror in `C:\Code6\dima2\site-dist`

Source data:
- Task/reference file: `C:\Code6\parse\TZ-build-static-cmf-surgery.md`
- Parser output: `C:\Code6\parse\scrape-output`
- Page JSON: `C:\Code6\parse\scrape-output\pages\*.json`
- Raw Tilda HTML: `C:\Code6\parse\scrape-output\pages\raw-html\*.html`
- Downloaded images: `C:\Code6\parse\scrape-output\assets\images`
- Original template/design reference: `C:\Code6\dima2\original`

## Core Rules

1. Preserve the existing `dima2/original` visual style unless the user explicitly asks for a redesign.
2. Make persistent changes in `build-site.js` first, then rebuild with:

   ```powershell
   node C:\Code6\dima2\build-site.js
   ```

3. Do not hand-edit generated HTML as the main fix unless it is a temporary diagnostic. Generated pages are overwritten by the build.
4. Keep `site-dist` in sync with root output by running the generator after changes.
5. Use parser images/text instead of invented content.
6. For service pages, include full long-form source text and all meaningful content images from parser output. Skip only service assets such as logos, maps, social icons, phone/mail icons, favicon, and popup backgrounds.
7. Use `logo.png` from the project root/source as header logo, footer logo, and favicon.
8. Keep page titles using the short dash `–`, not the long dash `—`.
9. After rebuilding, verify:
   - no broken local image refs;
   - key requested content exists in both root output and `site-dist`;
   - homepage key sections still match the original style;
   - `site-dist` contains `_redirects`, `robots.txt`, and `sitemap.xml`.

## Current Behaviors To Preserve

- Homepage service cards use the older/original card style, with parser images inside each card.
- Header social links use inline SVG icons for WhatsApp, Instagram, and email.
- Homepage doctors and trust cards use parser images.
- Service-page gallery images open in a native lightbox dialog on click.
- Homepage contact form section is back to the original dark `bg-ink` style.

## Git Rule

At the end of a working session:
1. Run status.
2. Rebuild if generator changed.
3. Run quick verification.
4. Commit with a clear message.
5. Push to GitHub.

Current blocker: `C:\Code6` / `C:\Code6\dima2` is not currently a git repository and has no remote configured. Ask for the GitHub repo URL or initialize/link the repository before the first push.
