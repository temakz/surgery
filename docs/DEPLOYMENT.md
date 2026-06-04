# Deployment

## Production

Live URL:
- `https://cmf-surgery.netlify.app/`

GitHub:
- `https://github.com/temakz/surgery.git`
- branch: `main`

Current preview workflow:
- `service-pages-v2` is the review branch for the service-page v2 redesign/content cleanup.
- Keep production `main` unchanged until the preview is approved.
- After approval, merge `service-pages-v2` into `main` and let Netlify publish the merged `site-dist`.

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
As of 2026-06-04, service-page v2 work is being pushed to:

```bat
git push -u origin service-pages-v2
```

Only merge/push to `main` after approval.

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
   - open Netlify Deploys;
   - confirm deploy from latest `main` commit is successful;
   - if needed, trigger redeploy manually.

4. Open:

   ```txt
   https://cmf-surgery.netlify.app/
   ```

5. Record deploy status in the latest handoff file.
