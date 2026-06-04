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

Live deployment:
- `https://cmf-surgery.netlify.app/`
- Netlify publishes the prebuilt `site-dist` folder.
- Netlify build command must be empty or `echo "No build"`.

Current preview deployment:
- Branch: `service-pages-v2`
- Preview URL: `http://service-pages-v2--cmf-surgery.netlify.app/`
- Use this preview for the current service-page v2 review cycle.
- Do not merge or push these changes to production `main` until the user approves.

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
6. Confirm Netlify deployed the latest `main` commit.

Repository: `https://github.com/temakz/surgery.git`
Branch: `main`
First push completed by the user on 2026-05-23.

Current review branch: `service-pages-v2`.
Continue service-page v2 work on this branch and push to `origin/service-pages-v2`.
Merge into `main` only after the user approves the preview.

Netlify production URL: `https://cmf-surgery.netlify.app/`
Netlify preview URL for service-page v2: `http://service-pages-v2--cmf-surgery.netlify.app/`

Netlify note: do not run `node build-site.js` in Netlify UI. The parser data lives outside the repo locally, so Netlify should publish `site-dist` directly.

Codex sandbox note: git may report `dubious ownership` because the repo is owned by the Windows user `Artyom`, while Codex runs as `CodexSandboxOffline`. If Codex needs to run git commands directly, the user can allow/check:

```powershell
git config --global --add safe.directory C:/Code6/dima2
```
