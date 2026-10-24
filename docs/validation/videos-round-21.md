# Round 21: current-head job succeeds; detailed evidence remains inaccessible

Checked on 2026-10-14. Both `git rev-parse HEAD` and GitHub's PR #79 API
identify `fdf49c09847178eff1dfb38f3193c1cd5077afce`.

## New current-head evidence

[Populated Videos Verification run 38616134510](https://github.com/foxleigh81/foxyslab-website/actions/runs/38616134510)
completed successfully. The jobs API reports success for installation, Chromium
setup, the combined credentialed build/browser/measurement step, report upload,
and evidence linking in
[job 116031570341](https://github.com/foxleigh81/foxyslab-website/actions/runs/38616134510/job/116031570341).
The combined step ran from 18:34:07 to 18:36:15 UTC. This is an existing run on
the requested head, not a new run started by this sandbox.

The API lists unexpired
[artifact 11919777132](https://github.com/foxleigh81/foxyslab-website/actions/runs/38616134510/artifacts/11919777132),
named `videos-verification-fdf49c09847178eff1dfb38f3193c1cd5077afce`.
Its ZIP endpoint returns HTTP 401, `Requires authentication`. The run logs
endpoint returns HTTP 403, `Must have admin rights to Repository`. Check-run
output has no summary or text; the public run page requires sign-in for logs.
Consequently, no browser report or Lighthouse report was downloaded, inspected
for credentials, or republished here. The successful status is not a substitute
for the requested populated-browser observations and three CLS/LCP values.

[CI run 38616134781](https://github.com/foxleigh81/foxyslab-website/actions/runs/38616134781)
also reports success on this head. Its lint/type-check/unit, E2E, and
build/Lighthouse check runs report success; detailed logs were not inspected.

## Previous failure remains undiagnosed

Retried the full logs for failed run `38610455771` and job `116012139925`:
both return HTTP 403, `Must have admin rights to Repository`. Its retained
artifact `11918490047` ZIP returns HTTP 401, `Requires authentication`.
The known parent command is `npm run verify:videos`. The failing child command
and cause remain unavailable, so classification as tooling or application
failure is still unresolved. Neither local missing credentials nor the later
successful CI run establishes the earlier failure's cause. No speculative
production or verification-tooling fix was made.

## Preview access

The deployments API returns Preview deployment `7073963473` for the exact head.
Its successful status, dated 2026-10-14 18:35:04 UTC, supplies environment URL
`https://foxyslab-website-ms8oi3pmj-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returns HTTP 302 to Vercel SSO.
No page, login-page performance, or populated content is claimed as tested.

## Local checks

- `npm ci`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files, 302 passed, one skipped.
- `npm test -- lib/__tests__/verify-videos.test.ts components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx`:
  exit 0; 48 tests passed, including initial-render and thumbnail regressions.
- `npm run test:e2e -- --workers=1 --max-failures=1`: exit 1; readiness
  timed out after 60000 ms with `flags: Missing FLAGS_SECRET`. No browser
  assertions ran. Watchpack also reported `/work` access errors.
- `npm run verify:videos`: exit 1 at credential preflight, listing missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
  No local credentialed build, populated browser check, or Lighthouse run started.

## Remaining handoff

An operator with Actions access must inspect the linked current-head artifact
and the earlier failed job's credential-redacted full logs or browser failure
report. Keep repository secrets in Actions. Review retained reports for
credential-bearing data before publishing their contents. Record the actual
failed child command and cause, the credentialed build result, desktop/mobile
hydration and control results, emitted first-thumbnail priority hint, and all
three mobile CLS/LCP pairs; verify each CLS is below 0.1. No measured LCP
improvement is asserted.

The existing production browser test covers default and direct playlist URLs,
footer positions before/after hydration, empty search and clearing, and
accessibility. It does not exercise playlist selection or pagination controls,
or record the emitted thumbnail priority hint. A green job alone cannot close
those review items. The detailed measurements and prior failure diagnosis
remain blocked by report/log access.

This revision changes only this evidence document. There is no production code
change or reproduced implementation defect, so no meaningful new automated
behaviour test, red-green cycle, or refactor applies. The passing focused checks
above are existing regression checks, not a newly observed red-green cycle.
