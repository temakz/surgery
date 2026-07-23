# Project Agent Rules

## Project

Static website rebuild for `cmf-surgery.ru` in `C:\Code6\dima2`.

Stack:
- HTML5
- Tailwind CSS via local generated static CSS
- Vanilla JS
- Static output prepared in `site-dist`
- PHP form backend for Timeweb hosting
- Composer dependency: PHPMailer

Primary generator:
- `C:\Code6\dima2\build-site.js`

Generated outputs:
- Root HTML files in `C:\Code6\dima2`
- Deploy mirror in `C:\Code6\dima2\site-dist`
- Deploy mirror also receives `.htaccess`, `send-form.php`, `vendor/`,
  `storage/form-rate-limit/.htaccess`, and `private/.htaccess` when present.
- `form-config.php` is private server config and must not be committed or copied
  into `site-dist`.

Live deployment:
- `https://cmf-surgery.netlify.app/`
- Netlify publishes the prebuilt `site-dist` folder.
- Netlify build command must stay empty. Use `echo "No build"` only if Netlify UI refuses an empty command and the user approves that fallback.

Current deployment state:
- Active migration branch: `timeweb-migration`
- Latest pushed migration commit: `486bd2400d6560a4649b1f5654c484b5b2a63186`
  (`chore: secure smtp configuration`)
- Migration target: Timeweb / Apache with clean URLs backed by `.htaccess`.
- Production branch: `main`
- Final service-page v2 branch: `service-pages-v2`
- Last synced production/static baseline before Timeweb work:
  `f3b3ff0 feat: restore analytics and site verification`
- After documentation-only closeout commits, keep `main` and `service-pages-v2` synced to the same latest commit.
- Production URL: `https://cmf-surgery.netlify.app/`
- Preview URL, retained for comparison: `http://service-pages-v2--cmf-surgery.netlify.app/`
- The service-page v2 review cycle was approved and fast-forward merged into production `main` on 2026-07-14.

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

- Contact details are normalized globally:
  - phone text: `+7 (926) 332-93-69`
  - phone link: `tel:+79263329369`
  - WhatsApp: `https://wa.me/79263329369`
  - main address: `г. Одинцово, Московская область, Красногорское ш., д. 17`
  - visible contact blocks may additionally keep
    `(Территория Клинической Больницы №123)`.
  - Sechenov address remains only as an additional possible reception location.
- Analytics and verification are restored centrally:
  - Google verification meta
  - Yandex verification meta
  - Yandex Metrika `72010240`
  - GTM `GTM-K7LGHNZ`
  - Do not restore old UA analytics or Tilda scripts.
- Apache routing is stored in root `.htaccess` and copied into `site-dist`.
  It enables clean URLs without changing canonical/sitemap/internal links.
- Four forms post to `/send-form.php`:
  - `bookForm` -> `form_type=book`
  - `exoForm` -> `form_type=exo`
  - `review-feedback` -> `form_type=review`
  - `online-consultation` -> `form_type=online`
- Forms use required `privacy_consent=accepted` and hidden honeypot `website`.
- Frontend forms currently do not intercept `submit`; successful or failed PHP
  responses are shown as JSON after normal browser POST navigation. AJAX/inline
  UX is still a future task.
- PHPMailer delivery is implemented in `send-form.php`; SMTP credentials must
  come only from `private/form-config.php`.
- `private/.htaccess` denies public access to private server config.
- Local MP4 players replaced YouTube cards only on `tmj_treatment` and
  `tmj_dysfunction`; do not add MP4 files to Git unless explicitly requested.
- Do not reintroduce visible "free consultation" claims.
- Homepage service cards use the older/original card style, with parser images inside each card.
- Header social links use inline SVG icons for WhatsApp, Instagram, and email.
- Homepage doctors and trust cards use parser images.
- Service-page gallery images open in a native lightbox dialog on click.
- Selected sensitive medical gallery images are hidden behind the reusable `sensitive-media` reveal banner before lightbox viewing. The current curated patterns are maintained in `build-site.js` via `sensitiveGalleryImagePatterns`; do not broaden this to whole pages unless the user asks.
- The sensitive-photo reveal banner is intentionally compact/minimal: pale card overlay, `Медицинское фото` pill with hidden-eye icon, `Скрыто до просмотра`, short explanatory line, and a smaller gradient `Показать` button. Preserve its proportions inside gallery cards.
- Homepage contact form section is back to the original dark `bg-ink` style.

## Service Page Customization Rule

When customizing service pages, reuse the already approved page patterns first instead of inventing a new style for each page.

Established patterns:
- `nose_surgery`: baseline polished service-page style.
- `tmj_treatment`: long-form medical text, semantic subheadings, compact media/video cards, and restored special content.
- `implantology`: page-specific structured content split across the left details column, right step column, `Дополнительная информация`, compact two-column media cards with captions, and selected sensitive-photo reveal treatment.
- `microsurgical`: short treatment cards plus detailed bullet copy below, restored hero subtitle, and selected sensitive-photo reveal treatment for clinical/operative collages.

Only introduce a new visual/detail pattern when the existing patterns do not fit the content. Any new pattern should be small, consistent with the existing polish system, and reusable by future pages where possible.

## Git Rule

At the end of a working session:
1. Run status.
2. Rebuild if generator changed.
3. Run quick verification.
4. Commit with a clear message.
5. Push to GitHub.
6. Confirm Netlify deployed the relevant branch:
   - `main` production after explicit approval;
   - `service-pages-v2` only if a future preview cycle explicitly reuses that branch.

Repository: `https://github.com/temakz/surgery.git`
Production branch: `main`
Current migration branch: `timeweb-migration`
First push completed by the user on 2026-05-23.

Current production branch: `main`.
The `service-pages-v2` review branch is closed; keep it matched with `main` unless a future preview cycle explicitly reuses it.
For new work, confirm the target branch with the user before changing or pushing.

Latest documented service-page v2 state:
- 2026-07-23: Timeweb migration branch latest pushed commit
  `486bd24 chore: secure smtp configuration`; see
  `docs/handoffs/handoff_016.md`.
- 2026-06-10: `6a87d7c remove quota page and polish service content`
- 2026-06-11: `354f71b polish specialist pages and service details`; see `docs/handoffs/handoff_010.md`.
- 2026-06-18: `0125baa polish secondary pages and contact flow`; see `docs/handoffs/handoff_011.md`.
- 2026-06-18: `54c2cd1 add semantic assets and policy pages`; see `docs/handoffs/handoff_012.md`.
- 2026-06-19: `e2629c2 remove tailwind cdn`; see `docs/handoffs/handoff_014.md`.
- 2026-07-14: `e517528 add import and commercial offer pages`; fast-forward merged to `main`; see `docs/handoffs/handoff_015.md`.

Netlify production URL: `https://cmf-surgery.netlify.app/`
Netlify preview URL for service-page v2: `http://service-pages-v2--cmf-surgery.netlify.app/`

Netlify note: do not run `node build-site.js` in Netlify UI. The parser data lives outside the repo locally, so Netlify should publish `site-dist` directly.

Codex sandbox note: git may report `dubious ownership` because the repo is owned by the Windows user `Artyom`, while Codex runs as `CodexSandboxOffline`. If Codex needs to run git commands directly, the user can allow/check:

```powershell
git config --global --add safe.directory C:/Code6/dima2
```
