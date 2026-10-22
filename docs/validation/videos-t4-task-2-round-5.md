# T4 task 2: revision round 5 acceptance evidence

## Current task-2 control disposition, 2026-10-22

This section supersedes the historical acceptance collection below, including
its statement that dispatch proof is not a prerequisite. The local
starting HEAD is `bcbd9f9591148001ed6ac8ce4e39a18434061c4c`, matching the
brief's previous checked head, with an initially clean tree on the assigned
branch. The live PR head was not queried; the later harness commit is untested.
This task establishes controls before private verification, not acceptance
measurements in the absence of those controls.

**Blocked before credentialed execution.** The supplied evidence and existing
[task-1 handoff](videos-t4-task-1-round-1.md) do not contain the required owner
or independent assessment receipts. No discovered executable saved-data route
receipt was supplied. Historical candidate-route descriptions are not approval.
The current-head failure evidence is empty and does not justify a website repair.

The required dispatch boundary is also unproven. No generation-48 successor
graph, persisted selector trace or exclusion-test receipt was supplied. The
tracked driver/selector/graph search finds historical driver documentation,
not an executable Studio scheduler or persisted state. This session has no
driver inspection or mutation interface. The reported resolution of run
`r20261022-66453e2ff9be` cannot be confirmed here. This record neither changes
eligibility nor proves that the external driver fails closed.

| Required control | Current disposition and precise missing evidence |
| --- | --- |
| Dispatch prerequisite | Blocked before private setup. The external driver owner must provide the persisted generation-48 successor graph and selector test/trace showing populated verification excluded without validated setup receipts and the Production observation excluded without an authorized deployed revision. If the driver cannot express these prerequisites, its owner must exclude website tasks while repairing the selector separately. No exclusion is claimed applied here. |
| Dataset, custodian and approver | Unidentified. Marcus must supply the source-owner identity and dataset-use approval receipt, including authorized purpose, principals and expiry. Marcus is the coordination owner, not an inferred data custodian. |
| Immutable identity and coverage | Missing approved source ID/version, capture time, exact-byte digest and schema. Record eligible video counts, playlist membership counts, more than 12 eligible videos for pagination, a playlist subset, direct playlist URL and search coverage. Identify thumbnail delivery and separate empty/error scenarios. Synthetic fixtures do not supply this receipt. |
| Private route and access | Missing immutable controller revision, executable saved-source ingestion for both build and runtime, authorized caller and private runner/browser access receipt. The prior handoff describes a live-data verifier without saved-source input. The sandbox network excludes Preview, application API and image origins. External operations inventory and its custodian were not supplied; no specific undisclosed resource or permission is invented here. |
| Exact-head binding and independent approval | Only the local source SHA above is observed. Before release, bind run ID, dataset digest, controller revision and then-live PR SHA to source-owner approval and Macklin's independent assessment. Neither receipt is supplied. Approval must precede data/credential exposure to PR code; changed subjects require reassessment. |
| Retention and cleanup | Missing approved private storage locations, permitted readers, expiry, cleanup owner and success/failure/cancellation handling, including runner termination and build caches. Require cleanup receipts and independently validated sanitized publication. Historical retention settings do not prove effective controls for this run. |

The first stopping condition is the missing dispatch-boundary proof. Dataset-use
authorization and Macklin's assessment of the identified source, route, head and
artifact controls are also missing.
No credentialed run, external contact or new operations-discovery attempt was
made. Marcus's external source/route research remains the continuation; this
local record cannot substitute for it. Ashley's and Macklin's independent blocks
remain unresolved. Driver inspection and repair belong outside this website
checkout; no preliminary merge is proposed.

Source inspection confirms that `lib/youtube.ts` reads live YouTube v3 and
`scripts/lib/verify-videos.mjs` accepts no approved saved-source input. The
candidate workflow requests 14-day summary retention, but does not establish
effective private readers, cleanup or independent exact-head approval. Its
shell head recheck occurs after step credentials enter the environment. No
credentials were inspected or copied, and credential validity is unverified.
The local source SHA is not a tested private build SHA. No private build/browser
route or sanitized report link can truthfully be recorded as established.

Task criterion 1 remains blocked: an approved dataset, custodian, approver,
private route and effective retention/cleanup cannot yet be identified.
Criterion 2's no-run condition is respected, but the approvals remain missing.
After those receipts exist, Studio must verify the new exact head and publish
sanitized build/browser/Lighthouse report links and measurements. Populated
layout, browser behavior, three CLS/LCP pairs and thumbnail priority remain
unobserved here. Post-deployment API/gallery observations must separately name
the Production revision and time. No release verification or review pass is claimed.

This is documentation only, so no meaningful automated behavior change exists
for red-green-refactor. No red run, production change or refactor is claimed.
Fresh local checks (all exit 0):

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: 987 packages
  installed; npm configuration, deprecation and install-script warnings.
- `npm run lint`.
- `npm run type-check`.
- `npm test`: 38 files passed, 346 tests passed and 1 skipped; existing Vite
  configuration-loader compatibility warning.
- `git diff --check`.

These checks cannot establish populated acceptance or independent approval.
Populated production build, browser and Lighthouse checks remain blocked by
the missing receipts. Release readiness remains **no**.

## Historical acceptance record, 2026-10-21

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
