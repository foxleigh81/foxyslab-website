# Round 26: populated browser failure on the reviewed head

Checked on 2026-10-14. The checkout and GitHub PR #79 API both identify
`55714e64751f5690c2c61320580bc2ef9c1268e6` as the reviewed head.
This note supersedes round 25's unknown-child diagnosis for the newly supplied
job; it does not establish the cause of the older job discussed there.

## Observed failure

[Job 116089205352](https://github.com/foxleigh81/foxyslab-website/actions/runs/38633041118/job/116089205352)
verified this exact checkout. The reviewer-supplied redacted log records
`npm run verify:videos`, `Build...`, then `Browser smoke...`, followed by two
`line 21: failed; populated gallery data unavailable; check YouTube credentials
and playlist membership` diagnostics. The parent exits 1.

The failing child command, resolved from `scripts/lib/verify-videos.mjs`, is:

```sh
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
```

It runs against the locally served production build with the same credential
environment. Line 21 identifies the test declaration for default/direct-playlist
grid stability, not the assertion that failed. The two results are consistent
with the configured desktop/mobile projects, but the log does not label them.
The runner reached this command only after the build succeeded and `/videos`
returned a successful readiness response. Neither fact proves populated data.
Lighthouse follows the browser check and therefore did not run.

The immediate cause is a failed production browser test carrying the
`Gallery fixture/data unavailable` diagnostic. That diagnostic covers:

- A navigation exception, including its five-second timeout.
- Zero cards at playlist discovery or no populated matching playlist option.
- No visible first card within five seconds on the default/direct-playlist URL.

The summary deliberately merges these cases. It does **not** prove an invalid
YouTube key, an empty gallery, or missing playlist membership specifically.
Classification is currently **populated browser/data prerequisite failure;
tooling versus application root cause unresolved**. No evidence supports
changing the runner, skipping the assertion, or changing the gallery yet.

## Evidence access and available results

The job-log REST request returned HTTP 403, `Must have admin rights to
Repository.` The retained [artifact 11926323166](https://github.com/foxleigh81/foxyslab-website/actions/runs/38633041118/artifacts/11926323166)
ZIP endpoint returned HTTP 401, `Requires authentication`. Thus only the supplied
redacted tail was inspected; neither the full log nor `browser-smoke.json` was
accessible. No credential values were retrieved.

The deployments API for this SHA returned Preview deployment `7076589713`.
Its latest status is `success`, created `2026-10-14T20:34:52Z`, with
`environment_url`:
`https://foxyslab-website-4zuep35su-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO.
It is not a tested page and supplies no populated-browser evidence.

Currently obtainable evidence is the completed credentialed build stage and
the failed populated-browser stage in the supplied CI log. Successful footer
stability, search, direct-playlist behavior, playlist selection, pagination,
and the emitted first-thumbnail priority hint are not established by that log.
No new CLS/LCP measurements are available. The recorded ticket baseline remains
CLS 0.511 for all three runs and LCP 3.8, 4.3, and 11.8 seconds.

## Next verification step and handoff

Read the retained `browser-smoke.json` result errors and failure attachments in
an authorized Actions context, keeping credential-bearing URLs out of reports.
Identify the precise helper/assertion and navigation cause, rendered error/empty
state, card count, and populated playlist options for each failed project.
The artifacts already exist; another unchanged run is not the first diagnostic
step. Check the corresponding server/API failure safely if the page shows an
error; `/videos` is request-rendered, so a successful build alone cannot rule
out a runtime data failure.

If navigation/setup failed, reproduce that tooling failure before changing the
runner. If data loading, playlist intersection, or initial rendering failed,
pass the specific assertion and sanitized page/API evidence to the application
code task; reproduce it with a focused failing test before implementing a fix.
Credential validity or source-data problems belong with the repository/data
owner. Do not substitute fixture data for production measurements.

After the cause is resolved, use the existing same-repository credentialed
Actions verification on the resulting PR head. Publish the actual browser
results, first-thumbnail priority hint, and all three mobile CLS/LCP pairs with
report links; require each CLS below 0.1. Also exercise playlist selection and
pagination, which the current production smoke does not click. General CI and
deployment badges cannot close these checks.

This revision changes diagnosis documentation only. No application, runner,
CI, or credential handling changes are justified by the accessible evidence.
There is no meaningful new automated behavior test, red/green run, or refactor
for this documentation-only change.

## Local checks

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 302 tests passed, one skipped.
- `FLAGS_SECRET=<ephemeral> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. The development server reported no YouTube
  API key, so this is not populated-browser evidence. The temporary flag key
  was generated locally, not copied from repository secrets.
- `npx prettier --check docs/validation/videos-round-26.md`: exit 0.
- `npm run verify:videos`: exit 1 at local preflight because `YOUTUBE_API_KEY`,
  `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` are absent. This is distinct
  from the observed CI browser failure; no local populated verification ran.
