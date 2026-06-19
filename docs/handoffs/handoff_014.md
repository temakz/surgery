# Handoff 014

Date: 2026-06-19

## Session Close

This session continued on the `service-pages-v2` preview branch. Production `main` was not touched.

This session was closed with a commit and push to `origin/service-pages-v2` after local verification.

## Current Branches

- Production branch: `main`
- Current work branch: `service-pages-v2`
- Remote branch: `origin/service-pages-v2`
- Production URL: `https://cmf-surgery.netlify.app/`
- Preview URL: `http://service-pages-v2--cmf-surgery.netlify.app/`
- Migration target / SEO domain: `https://cmf-surgery.ru`
- Netlify publish directory remains `site-dist`.
- Netlify build command must remain empty or `echo "No build"`.

## What Changed

### Static Tailwind CSS

- Removed the generated-page dependency on `https://cdn.tailwindcss.com`.
- Removed the inline browser `tailwind.config` block from generated root and `site-dist` HTML.
- Added local generated stylesheet output:
  - `assets/css/site.css`
  - `site-dist/assets/css/site.css`
- Added local CSS build inputs:
  - `tailwind.config.js`
  - `assets/css/site.tailwind.css`
- Moved the previous global inline Tailwind/custom style block into the Tailwind input via `@layer base` and `@layer components`.
- Updated `build-site.js` so generated pages link `assets/css/site.css` and so the CSS file is copied into `site-dist`.

### Local CSS Build Command

CSS was generated locally with:

```powershell
npx.cmd -y tailwindcss@3.4.17 -c tailwind.config.js -i assets/css/site.tailwind.css -o assets/css/site.css --minify
```

Future class changes should regenerate `assets/css/site.css` locally, then run `node build-site.js` so `site-dist/assets/css/site.css` stays synced.

## Verification

- `git branch --show-current` returned `service-pages-v2`.
- Initial `git status --short --branch` showed only expected untracked `.cursorindexingignore` and `.specstory/`.
- `node build-site.js` completed successfully and reported `Built 33 pages with original design.`
- `node --check build-site.js` passed.
- Root and `site-dist` were rebuilt.
- Static CSS markers:
  - root HTML files: `34`, local CSS refs: `34`, `tailwindCdn=0`, `tailwindConfig=0`;
  - `site-dist` HTML files: `34`, local CSS refs: `34`, `tailwindCdn=0`, `tailwindConfig=0`.
- Local asset refs for `assets/images` and `assets/css`: `0` broken refs.
- CSS output sizes:
  - `assets/css/site.css`: `43111` bytes;
  - `site-dist/assets/css/site.css`: `43111` bytes.
- `git diff --check` passed; Git only reported normal LF/CRLF warnings.

## Browser Smoke

Local browser smoke was run against `http://127.0.0.1:4173/` using a temporary local `http-server`.

Confirmed:

- Homepage desktop loaded with `assets/css/site.css`, no Tailwind CDN marker, no console errors, no horizontal overflow.
- Priority pages loaded with local CSS, no Tailwind CDN marker, one H1, no horizontal overflow, and no console errors:
  - `exo.html`
  - `nose_surgery.html`
  - `anons.html`
  - `privacy.html`
  - `contacts.html`
  - `reviews.html`
  - `onlinehelp.html`
- Mobile viewport check:
  - `mobBtn` is visible;
  - `mobPanel` opens;
  - menu contains `33` links;
  - no horizontal overflow.
- Form check:
  - `onlinehelp.html` form fields fill correctly;
  - form was not submitted because it is configured as a POST form.
- Lightbox check:
  - `contacts.html` image click opens `#imageLightbox`;
  - dialog image receives `assets/images/contacts-clinic.webp` and the expected alt text.

## Notes

- The in-app browser blocks direct `file://` navigation, so localhost was used for browser smoke.
- `.cursorindexingignore` and `.specstory/` remain untracked and must not be committed.
- Netlify preview verification was performed after the closing push.

## Closing Commit

- Work commit message: `remove tailwind cdn`
- Work commit: `e2629c2 remove tailwind cdn`
- Push target: `origin/service-pages-v2`
- Push status: succeeded, `0a1c19c..e2629c2 service-pages-v2 -> service-pages-v2`.

## Preview Verification

After pushing `e2629c2`, the preview was checked directly:

```txt
https://service-pages-v2--cmf-surgery.netlify.app/
https://service-pages-v2--cmf-surgery.netlify.app/contacts.html
https://service-pages-v2--cmf-surgery.netlify.app/assets/css/site.css
```

Confirmed:

- homepage status `200`;
- `contacts.html` status `200`;
- `assets/css/site.css` status `200`, content type `text/css; charset=UTF-8`;
- homepage and contacts HTML contain `assets/css/site.css`;
- homepage and contacts HTML do not contain `cdn.tailwindcss.com`;
- homepage and contacts HTML do not contain `tailwind.config`.

## Next Steps

1. Review local diff.
2. When approved, commit and push to `origin/service-pages-v2`.
3. After push, verify Netlify preview and rerun PageSpeed:
   - render-blocking Tailwind CDN should be gone;
   - compare mobile FCP/LCP and desktop render-blocking requests;
   - visually check homepage, mobile menu, service pages, `anons`, `privacy`, `contacts`, forms, and lightbox on preview.
