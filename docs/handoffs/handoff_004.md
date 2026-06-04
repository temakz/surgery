# Handoff 004

Date: 2026-06-04

## Session Close

The service-page v2 work is now being reviewed from a separate branch and Netlify preview.

## Current Branches

- Production branch: `main`
- Current work branch: `service-pages-v2`
- Remote branch: `origin/service-pages-v2`
- Production URL: `https://cmf-surgery.netlify.app/`
- Preview URL for current work: `http://service-pages-v2--cmf-surgery.netlify.app/`

## Commits On `service-pages-v2`

- `5cd9305` - service-page hero images and parser-content dedupe.
- `8005236` - documented the preview branch workflow.

This handoff adds the final session-close documentation for the preview URL and next-session protocol.

## What Was Done Before Close

- User published the branch preview at `http://service-pages-v2--cmf-surgery.netlify.app/`.
- Project docs were updated so the next session continues on `service-pages-v2`.
- Docs now explicitly say not to merge or push this work to production `main` until the user approves the preview.

## Next Session Plan

1. Start from branch `service-pages-v2`.
2. Read `AGENTS.md`, `docs/SESSION_PROTOCOL.md`, `docs/NEXT_STEPS.md`, `docs/DEPLOYMENT.md`, and this handoff.
3. QA the preview URL, especially:
   - homepage;
   - `scars`;
   - `tmj_treatment`;
   - `exo`;
   - `implantology`;
   - mobile layout;
   - service image lightbox.
4. Continue edits through `build-site.js`, then run `node build-site.js`.
5. Keep root HTML and `site-dist` in sync.
6. Push further review changes to `origin/service-pages-v2`.
7. Merge into `main` only after user approval.

## Important Notes

- Netlify must keep publishing prebuilt `site-dist`; build command stays empty.
- `build-site.js` depends on local parser output in `C:\Code6\parse\scrape-output`, so Netlify must not run it.
- `.cursorindexingignore` and `.specstory/` are untracked service files and should not be added unless explicitly needed.
