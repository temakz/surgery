# Session Protocol

## Opening Ritual

1. Read `AGENTS.md`.
2. Read the latest `docs/handoffs/handoff_NN.md`.
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

## Working Ritual

1. Make source changes in `build-site.js` where possible.
2. Rebuild with `node C:\Code6\dima2\build-site.js`.
3. Verify root and `site-dist`.
4. Keep changes scoped to the current request.
5. Do not revert user changes unless explicitly requested.

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
5. Commit and push to GitHub when the repo/remote is available.
6. In the final message, state:
   - what changed;
   - what was verified;
   - whether push succeeded or what blocked it.
