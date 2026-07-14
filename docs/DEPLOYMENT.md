# Deployment

## Production

Live URL:
- `https://cmf-surgery.netlify.app/`

GitHub:
- `https://github.com/temakz/surgery.git`
- branch: `main`

Current production state:
- `service-pages-v2` was the review branch for the service-page v2 redesign/content cleanup.
- The preview was approved and fast-forward merged into `main` on 2026-07-14.
- `main` and `service-pages-v2` currently point to `e517528 add import and commercial offer pages`.
- Preview URL retained for comparison: `http://service-pages-v2--cmf-surgery.netlify.app/`
- Production is published from the prebuilt `site-dist` folder in `main`.
- Latest confirmed production commit as of 2026-07-14: `e517528 add import and commercial offer pages`.

Netlify:
- Publish directory: `site-dist`
- Build command: empty
- If Netlify UI refuses an empty command, use this only as an approved fallback:

  ```sh
  echo "No build"
  ```

## Important

Do not run `node build-site.js` on Netlify.

Reason: `build-site.js` depends on local parser data outside this repository:
- `C:\Code6\parse\scrape-output`

On Netlify this folder does not exist, so the build fails with missing parser JSON such as:

```txt
ENOENT: no such file or directory, open '/opt/build/parse/scrape-output/pages/nose_surgery.json'
```

The correct workflow is:
1. Build locally.
2. Commit generated `site-dist`.
3. Push to GitHub.
4. Let Netlify publish `site-dist` as a prebuilt static site.

## Local Build Before Deploy

Run:

```powershell
cd C:\Code6\dima2
node build-site.js
```

Then verify:
- root HTML updated;
- `site-dist` updated;
- broken local image refs: `0`;
- requested content exists.

## End-Of-Session Deploy Ritual

For in-review work that should not go live yet, push the current preview branch instead of `main`.
The previous service-page v2 branch is now closed and synced with `main`.
For future large review cycles, create or confirm a preview branch before pushing.
The old service-page v2 branch can still be pushed if the user explicitly chooses to reuse it:

```bat
git push origin service-pages-v2
```

Only merge/push to `main` after approval.
For production work, verify the production deployment at:

```txt
https://cmf-surgery.netlify.app/
```

1. Rebuild locally if generator/content changed:

   ```powershell
   node C:\Code6\dima2\build-site.js
   ```

2. Commit and push:

   ```bat
   cd /d C:\Code6\dima2
   git status
   git add .
   git commit -m "Describe changes"
   git push
   ```

3. Check Netlify deploy:
   - for preview work, confirm deploy from the latest agreed preview-branch commit is successful;
   - for production work after approval, confirm deploy from latest `main` commit is successful;
   - if needed, trigger redeploy manually.

4. Open the relevant URL:

   ```txt
   http://service-pages-v2--cmf-surgery.netlify.app/
   https://cmf-surgery.netlify.app/
   ```

5. Record deploy status in the latest handoff file.

## Latest Production Verification

After pushing `e517528` to `main` on 2026-07-14, production was checked directly:

```txt
https://cmf-surgery.netlify.app/
https://cmf-surgery.netlify.app/contacts.html
https://cmf-surgery.netlify.app/importozameshchenie.html
https://cmf-surgery.netlify.app/commercial_offer.html
https://cmf-surgery.netlify.app/assets/css/site.css
```

Confirmed:
- homepage status `200`;
- `contacts.html` status `200`;
- `importozameshchenie.html` status `200`;
- `commercial_offer.html` status `200`;
- `assets/css/site.css` status `200`, content type `text/css; charset=UTF-8`;
- contacts page contains the MAX operative-contact text, new MAX URL, and Sechenov/Dovatora address;
- import replacement page contains `KLS Martin` and `Zimmer Biomet`;
- commercial offer page contains `Коммерческое предложение`, `Стоимость работ`, and `Кравченко Дмитрий Валерьевич`.

## Previous Preview Verification

After pushing `dbb3e68` on 2026-06-05, the preview page was checked directly:

```txt
https://service-pages-v2--cmf-surgery.netlify.app/tmj_treatment.html
```

Confirmed:
- HTTP status `200`;
- restored TMJ text marker `Динамическая МРТ аксиография`;
- compact YouTube thumbnail marker `i.ytimg.com/vi/_I0rorCC29s/hqdefault.jpg`;
- fourth video marker `JAs0wK6AK4g`.

## Previous Preview Push Scope

The 2026-06-11 handoff 010 session was pushed to:

```bat
git push origin service-pages-v2
```

After the push, verify the Netlify preview branch at:

```txt
http://service-pages-v2--cmf-surgery.netlify.app/
http://service-pages-v2--cmf-surgery.netlify.app/trofimov.html
http://service-pages-v2--cmf-surgery.netlify.app/kravchenko.html
http://service-pages-v2--cmf-surgery.netlify.app/exo.html
http://service-pages-v2--cmf-surgery.netlify.app/mouthguards.html
http://service-pages-v2--cmf-surgery.netlify.app/nose_surgery.html
```

Expected markers:
- homepage social preview title uses `Center of Surgery – Центр реконструктивной хирургии.`;
- specialist pages use biography/resume layouts, not the generic service renderer;
- `kravchenko.html` contains the shared sticky header and no `undefined` marker;
- doctor dropdown previews use real doctor photos;
- `exo.html` uses `assets/images/exo-hero.png`;
- all 20 service pages include the compact `Возможности лечения по бюджету` notice.
