# T3 task 1, revision 3: local verification boundary

Recorded 2026-10-23 UTC on local branch
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` at
`123ebd745d32e9f5487299a5c69e44161a8cc7d5`. This is the checked-out
source identity, not confirmation of a later PR head or deployed artifact.

The approved populated saved-video dataset, immutable digest and pagination
inventory, private production-equivalent target, valid-credential route,
artifact controls, and independent credential clearance were not supplied to
this sandbox. Presence-only checks found `YOUTUBE_API_KEY`,
`FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` absent. The verifier stopped
at preflight, before build, browser, or Lighthouse stages. No secrets or live
API data were accessed.

## Regression assessment

`app/videos/__tests__/page.test.tsx` renders 25 synthetic videos and asserts
12 first-page cards on the default and direct-playlist URLs, one card on the
playlist's second page, and distinct empty/fetch-error markup. It checks
server-rendered markup only: it does not render the root footer, measure CSS
geometry, hydrate, or consume an approved saved dataset.

The `@production` test in `e2e/videos-gallery.spec.ts` holds scripts while it
checks visible cards and records the footer Y coordinate, then releases scripts
and asserts movement below 2 pixels on default and playlist URLs. The regular
Playwright config excludes this test. It was not run against populated data in
this revision, so footer stability through hydration remains unobserved.

## Fresh local checks

| Command | Outcome |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0; 987 packages installed. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test` | Exit 0; 38 files passed, 348 tests passed, 1 skipped. |
| `npm test -- app/videos/__tests__/page.test.tsx` | Exit 0; 10 synthetic page tests passed. |
| `npm run verify:videos` | Exit 1: the three required credentials are absent; no stages ran. |
| `FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc ALLOW_MISSING_API_KEYS=true npm run test:e2e -- --workers=1 --reporter=line` | Exit 0; 71 passed, 5 skipped. The server reported no YouTube API key; production-tagged cases were excluded. |
| `FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc ALLOW_MISSING_API_KEYS=true npm run build` | Exit 0; Next compiled and generated 39 static pages. This missing-key build is not populated acceptance. |

## Acceptance status

| Criterion | Result |
| --- | --- |
| Initial populated cards or reserved layout and stable footer through hydration | Blocked on approved data and private target. Synthetic server markup passed; no populated browser geometry was observed. |
| Three mobile CLS readings below 0.1, paired LCP readings, emitted first-thumbnail priority hint | Blocked. No populated Lighthouse run, emitted hint observation, or report link exists for this head. No LCP improvement is claimed. |
| Populated search, playlist filter, forward/back pagination, direct playlist URLs | Blocked for approved data. Local synthetic unit and ordinary E2E coverage is narrower. |
| Distinct empty/error states | Passed in synthetic unit and controlled E2E fixtures; not observed on an approved populated target. |
| Focused populated saved-data regression and valid-credential build | Blocked. The current focused regression uses generated synthetic data, and preflight prevents credentialed build execution. |
| Post-deployment live API | Blocked pending an authorized Production revision and approved access route. |

No executable behavior changed, so there was no meaningful new behavior test
to run red, no production repair, and no green-after-refactor rerun to report.
The missing-credential preflight is not a website behavior failure. Acceptance
still requires an approved exact-head data/target/credential/artifact receipt,
the populated browser and Lighthouse results, and a later authorized live API
check. No PR comment or artifact identity is claimed from this local run.
