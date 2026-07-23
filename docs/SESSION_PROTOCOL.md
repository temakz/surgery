# Session Protocol

## Opening Ritual

1. Read `AGENTS.md`.
2. Read the latest `docs/handoffs/handoff_NN.md`.
   - Current latest handoff: `docs/handoffs/handoff_016.md`.
3. Read `docs/NEXT_STEPS.md`.
4. Check whether `C:\Code6\dima2` is a git repository:

   ```powershell
   git -C C:\Code6\dima2 status --short
   git -C C:\Code6\dima2 remote -v
   ```

5. Confirm the working target:
   - generator: `build-site.js`;
   - output: root HTML and `site-dist`;
   - source content: parser output in `C:\Code6\parse\scrape-output`.
6. Confirm the branch and deployment target before editing.
   - Active migration branch: `timeweb-migration`
   - Latest pushed migration commit:
     `486bd2400d6560a4649b1f5654c484b5b2a63186`
   - Production branch: `main`
   - Closed service-page v2 branch: `service-pages-v2`
   - Last synced production/static baseline before Timeweb migration:
     `f3b3ff0`.
   - Documentation-only closeout commits may sit on top of that release; keep `main` and `service-pages-v2` synced unless a new preview cycle is created.
   - Preview URL retained for comparison: `http://service-pages-v2--cmf-surgery.netlify.app/`
   - Production URL: `https://cmf-surgery.netlify.app/`
   - For Timeweb work, stay on `timeweb-migration` unless the user explicitly
     changes the target.
   - For non-Timeweb production work, ask whether to use `main` or a new preview
     branch.

7. Check for local untracked/service files that must not be committed unless
   explicitly requested:
   - `.cursorindexingignore`
   - `.specstory/`
   - `site-dist/site.zip`
   - `form-config.php`
   - `private/form-config.php`
   - `site-dist/private/form-config.php`

## Working Ritual

1. Make source changes in `build-site.js` where possible.
2. Rebuild with `node C:\Code6\dima2\build-site.js`.
3. Verify root and `site-dist`.
4. Keep changes scoped to the current request.
5. Do not revert user changes unless explicitly requested.
6. For forms/backend work:
   - keep real secrets out of Git;
   - use `private/form-config.php` only for real SMTP credentials;
   - lint PHP with Docker PHP 8.2 when local PHP is unavailable;
   - remember that frontend form UX is currently raw JSON after POST.

## Closing Ritual

1. Rebuild one last time.
2. Run checks:

   ```powershell
   node C:\Code6\dima2\build-site.js
   ```

   Then verify:
   - broken local image refs: `0`;
   - requested text/images present in root and `site-dist`;
   - homepage form, logo, favicon, social icons, and lightbox behavior are intact.

3. Create the next handoff file:
   - `docs/handoffs/handoff_001.md`
   - `docs/handoffs/handoff_002.md`
   - and so on.

4. Update `docs/NEXT_STEPS.md`.
5. Commit and push to GitHub only when the user asks.
   - Timeweb migration work currently pushes to `timeweb-migration`.
   - Production work pushes to `main` after explicit approval.
   - Preview work should use a named preview branch agreed with the user.
   - The old `service-pages-v2` branch is already merged into `main`.
6. Confirm the relevant deployment.
   - Production URL: `https://cmf-surgery.netlify.app/`
   - Service-page v2 preview URL: `http://service-pages-v2--cmf-surgery.netlify.app/`
   - Netlify build command must stay empty; use `echo "No build"` only as an approved fallback if Netlify UI refuses an empty command.
   - Publish directory must be `site-dist`.
   - Timeweb deployment is manual/server-side until the user confirms the final
     upload workflow.
7. In the final message, state:
   - what changed;
   - what was verified;
   - whether push succeeded;
   - whether Netlify deploy succeeded.
