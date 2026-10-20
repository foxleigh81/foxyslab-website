# T4 task 1, round 1: populated verification disposition

Historical record, superseded by [the revision round 4 controls inventory](videos-t4-controls-round-4.md).
The scheduler investigation mentioned below is separate Engineering work, not
a website premerge prerequisite. No scheduler outcome is established here.

Recorded 2026-10-20. Local source HEAD is
`3b06fd1b7a9c20707e1262c8ada588a5fb27eb96` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. An unauthenticated
GitHub REST `GET /repos/foxleigh81/foxyslab-website/pulls/79` during this run
returned HTTP 200, open draft, and the same head. This observation identifies
the tested source, not the later harness commit or an approved execution head.

## Scope and blockers

The implementation and existing regression were reused. No current-head
application failure was supplied or reproduced by the unit checks. The page
resolves URL state on the server, renders the gallery, and gives the first
card image priority. No production code, CI, deployment or credential handling
was changed.

The available session supplies no inspectable external scheduler route or
initial-dispatch/retry exclusion regression receipt, approved saved dataset
manifest, authorized private verification controller, effective artifact
access/retention assessment, private Playwright artifact classification, or
Macklin clearance receipt. The branch-local verification workflow and historical
documents do not establish those external prerequisites. Studio permissions,
plan generation 26 and run `r20261020-0bc4c723ca7b` terminal state have not been
independently revalidated here. No scheduler state change is claimed.

No credentials were requested or copied and no workflow was dispatched.
The valid-credential build and production browser/Lighthouse execution were
not attempted. The existing `verify:videos` route builds production code and
measures browser behavior and Lighthouse, but its existence does not establish
authorization, saved-data provenance or effective private retention controls.

## Criterion-level evidence

| Criterion | Disposition | Evidence and remaining work |
| --- | --- | --- |
| Initial populated cards or reserved layout; hydration/footer stability | Blocked for approved populated production data | Observed: existing page regression passes with 25 synthetic videos and server-rendered first-page/direct-playlist cards. Browser footer movement on approved saved data remains unobserved. |
| Three mobile CLS results below 0.1, each LCP, first-thumbnail priority | Blocked | Card priority unit assertions pass. No populated production DOM priority observation or CLS/LCP measurements were collected; no LCP improvement is claimed. |
| Search, playlist filter, forward/back pagination, direct URLs, empty/error states | Observed in unit fixtures; populated acceptance blocked | Existing page/gallery/card tests pass. Synthetic fixtures are not an approved saved dataset. Production-tagged browser checks are excluded from the ordinary E2E configuration. |
| Focused regression, lint, type-check, unit/E2E tests and populated production build | Partial | Local results below; valid-credential populated build remains blocked by the external prerequisites. |
| Live API integration after deployment | Blocked | No named deployed Production revision or authorized post-deployment observation is available in this run. |

## Local checks

- `npm ci --no-audit --no-fund`: exit 0; 987 packages installed, with npm
  configuration, dependency deprecation and install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped.
- `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx`:
  exit 0; 3 files and 49 tests passed.
- `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc ALLOW_MISSING_API_KEYS=true npm run test:e2e -- --max-failures=1 --workers=1 --reporter=line`:
  exit 0; 71 passed, 5 skipped, in 3.2 minutes. The flags value is a synthetic
  test constant. The skipped cases are the four controlled empty/error markup
  cases without generated fixtures and the iPhone desktop-navigation case.
  Production-tagged tests are excluded entirely. Expected missing-YouTube-key
  messages and webpack cache/watcher warnings occurred. These are development
  server and synthetic verifier results, not populated production observations.
- `git diff --check`: exit 0.

This is an evidence-only documentation change with no executable behavior to
drive through a meaningful new red/green/refactor cycle. No failing regression,
production repair or refactor is claimed. Passing local checks cannot close the
external prerequisites or populated acceptance criteria. No production report
or measurement links were generated.

Release readiness remains **no**. The external scheduler and private-route
investigations, independent controls clearance, approved dataset provenance,
fresh exact-head production verification and post-deployment live integration
remain outstanding.
