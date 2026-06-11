# Deployment

## Production

Live URL:
- `https://cmf-surgery.netlify.app/`

GitHub:
- `https://github.com/temakz/surgery.git`
- branch: `main`

Current preview workflow:
- `service-pages-v2` is the review branch for the service-page v2 redesign/content cleanup.
- Preview URL: `http://service-pages-v2--cmf-surgery.netlify.app/`
- Keep production `main` unchanged until the preview is approved.
- After approval, merge `service-pages-v2` into `main` and let Netlify publish the merged `site-dist`.
- Latest confirmed preview commit as of 2026-06-05: `dbb3e68 polish service pages and tmj content`.

Netlify:
- Publish directory: `site-dist`
- Build command: empty
- If Netlify UI requires a command, use:

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

For in-review work that should not go live yet, push the current branch instead of `main`.
As of 2026-06-05, service-page v2 work is being pushed to:

```bat
git push origin service-pages-v2
```

Only merge/push to `main` after approval.
For this review cycle, verify the preview deployment at:

```txt
http://service-pages-v2--cmf-surgery.netlify.app/
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
   - for preview work, confirm deploy from latest `service-pages-v2` commit is successful;
   - for production work after approval, confirm deploy from latest `main` commit is successful;
   - if needed, trigger redeploy manually.

4. Open the relevant URL:

   ```txt
   http://service-pages-v2--cmf-surgery.netlify.app/
   https://cmf-surgery.netlify.app/
   ```

5. Record deploy status in the latest handoff file.

## Latest Preview Verification

After pushing `dbb3e68` on 2026-06-05, the preview page was checked directly:

```txt
https://service-pages-v2--cmf-surgery.netlify.app/tmj_treatment.html
```

Confirmed:
- HTTP status `200`;
- restored TMJ text marker `Динамическая МРТ аксиография`;
- compact YouTube thumbnail marker `i.ytimg.com/vi/_I0rorCC29s/hqdefault.jpg`;
- fourth video marker `JAs0wK6AK4g`.

## Current Preview Push Scope

The 2026-06-11 handoff 010 session should be pushed to:

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
