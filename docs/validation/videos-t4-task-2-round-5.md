# T4 task 2: revision round 5 acceptance evidence

Inspected on 2026-10-21 at approximately 22:33 UTC. Source SHA:
`c4fb3085a48b2105d014b385c7ab7331b9f733bf`, on the assigned
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` branch with an
initially clean working tree. An unauthenticated GitHub REST request to
`GET /repos/foxleigh81/foxyslab-website/pulls/79` returned HTTP 200 and
reported an open draft with that same head. This identifies the observed live
PR source; it does not attest to the future harness commit or approve data use.

## Prerequisites

The latest [task-1 handoff](videos-t4-task-1-round-1.md) records the missing
source-owner approval, immutable saved dataset, executable private ingestion
and browser route, and Macklin independent assessment. No replacement receipts
were supplied in this revision. Inspection of `lib/youtube.ts` and
`scripts/lib/verify-videos.mjs` confirms the existing verifier uses live API
credentials and has no saved-source input. Synthetic fixtures do not close
this gap. Populated acceptance collection therefore remains blocked.

No driver research or tested driver gate is a prerequisite for this task.
Historical documents that require one do not describe this task's current
continuation. No current-head website failure evidence was supplied, and no
website defect was reproduced here to justify a repair.

## Results at the inspected source SHA

| Criterion | Classification | Evidence and remaining observation |
| --- | --- | --- |
| Initial populated response and stable layout through hydration | Blocked | Existing synthetic page/gallery/card regression passes locally; approved saved-data HTML, hydration and footer observations are unavailable. |
| Three mobile Lighthouse runs, each CLS below 0.1, paired LCP and first-thumbnail priority | Blocked | No approved populated build/browser route. No new CLS, LCP or emitted priority observations, and no performance improvement claim. Historical measurements remain the baseline. |
| Search, playlist filtering, forward/back pagination, direct playlist URLs and distinct empty/error states | Blocked for populated browser acceptance | Synthetic unit checks pass; production-shaped saved-data browser behavior remains unobserved. |
| Focused populated-layout regression and individual quality/build checks | Observed local checks; populated portion blocked | Install, lint, type-check, unit suite and focused synthetic regressions pass as recorded below. E2E, populated regression, valid-data production build and Lighthouse were not run because the approved source, route and assessment are missing. |
| Live API integration after deployment | Blocked | No identified Production revision and corresponding observation time, request and outcome supplied or collected. This remains separate post-deployment work. |

No criterion is classified as a reproduced website failure. Blocked observations
are not passes, and passing local checks do not establish populated acceptance.
No populated reports or measurement links were generated, and no review is
declared passed.

## Fresh local checks

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with configuration, deprecation and install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 346 tests passed, 1 skipped.
- `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx`:
  exit 0; 3 files and 49 tests passed. These use synthetic data.
- `git diff --check`: exit 0 after adding this record.

Vitest emitted its existing configuration-loader compatibility warning.
This revision changes documentation only. There is no changed executable
behavior for a meaningful automated red-green-refactor test; no red run,
production change or refactor is claimed.

## Required continuation

Marcus must provide the approved immutable source with owner, access and
playlist/pagination coverage receipts, plus the executable private build/browser
route. Macklin's independent assessment must cover the exact PR head, source,
controller, credential release, retention and cleanup before credentialed use.
Once those prerequisites are available, re-resolve the then-live PR SHA and
collect sanitized SHA-bound build, browser and three-run Lighthouse evidence
with approved report links. A reproduced defect then calls for a focused
test-first repair and affected checks at the changed head.

No credentials or private data were copied, workflows dispatched, external
messages sent, or CI/deployment changes made. Merge and deployment remain
unauthorized. Release readiness remains **no**.
