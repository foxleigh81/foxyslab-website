# /videos populated PR verification: revision round 5

Inspected 2026-10-23 16:29 UTC. Local branch
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` was clean at
`1c3157029178a0cdeb05935142c7dec8b18f832c` before this record. This is a
local checkout identity, not a freshly validated live PR-head or build identity.

## Admission

**Blocked; no website verification run admitted.** The supplied task contains
no caller-validated owning-system selection trace, approved immutable populated
saved-video source and pagination receipt, credentialed production-shaped route,
private artifact-control receipt, or independent credential-release decision.
The repository cannot establish the external dispatch predicate or approval.
No credentialed build, populated browser run, Lighthouse run, workflow dispatch,
or production deployment was performed. The empty supplied current-head failure
list identifies no website defect to repair. Existing synthetic tests do not
substitute for approved saved data.

| Criterion | Status at this checkout | Evidence or blocker |
| --- | --- | --- |
| Initial response first-page cards or reserved space; hydrated footer position | Blocked for exact-head populated build | The focused synthetic SSR test passed. No approved populated response or hydration measurement exists. |
| Search, playlist filtering, forward/back pagination, direct playlist URLs | Blocked for populated build | No admitted browser target or approved source with more than one page of eligible videos. |
| Empty and error states | Observed in synthetic SSR tests; blocked on populated route | The focused test covers both states; no exact-head production-route observation exists. |
| Populated-layout regression, lint, type-check, unit, E2E and build with saved data | Blocked as a group | Local uncredentialed results are listed below. No approved saved-data input or valid-credential route was available. |
| Three separate mobile CLS values below 0.1, paired LCP values, retained reports and emitted first-thumbnail priority hint | Blocked | Zero admitted Lighthouse runs; no CLS/LCP values, report links, or emitted-hint observation. No LCP improvement is claimed. |
| Live API integration | Pending authorized Production deployment | No identified deployed revision or post-deployment observation. |

## Local checks

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0; 987 packages installed.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 348 tests passed, 1 skipped.
- `npm test -- app/videos/__tests__/page.test.tsx`: exit 0; 10 synthetic SSR tests passed.
- `npm run test:e2e`: stopped with exit 130 after the dev server reported missing `FLAGS_SECRET`; no browser result claimed.
- `FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run test:e2e`: exit 0; 71 passed, 5 skipped. This synthetic local flag value supplies no YouTube data, and the regular E2E configuration excludes the populated `@production` check.

This is a verification record only. No production code changed, so a new
red-green-refactor behavior test has no meaningful target. No red run or
refactor is claimed. Admission and every affected check must be rebound to the
actual PR head, approved data digest, controller and build after the external
prerequisites are validated; a future harness commit invalidates this checkout
identity for exact-head acceptance.
