# Task 3, revision round 22: reconciled-head checks

Checked on 2026-10-19. The checkout and public GitHub PR #79 API both report
`4ba994e27ec1407db47cf581e289c511ef0e72c4` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The PR is open,
draft, and targets `main`. The worktree was clean before verification. These
results apply to that head, not the subsequent harness commit.

## Local checks

| Command | Result |
| --- | --- |
| `npm ci` | Exit 0; 987 packages installed. Audit reports 39 vulnerabilities (2 low, 10 moderate, 25 high, 2 critical); dependencies unchanged. |
| `npm run lint` | Exit 0. |
| `npm run type-check` | Exit 0. |
| `npm test -- app/videos/__tests__/page.test.tsx` | Exit 0; 10 tests passed. |
| `npm test` | Exit 0; 38 files passed, 345 tests passed, 1 skipped. |
| `FLAGS_SECRET=<synthetic> ALLOW_MISSING_API_KEYS=true npm run test:e2e` | Exit 0; 71 passed, 5 skipped. Regular desktop Chrome/mobile WebKit suite; production-tagged checks excluded. |
| `FLAGS_SECRET=<synthetic> ALLOW_MISSING_API_KEYS=true npm run build` | Exit 0; compile-only production build, with `/videos` dynamic. Not a valid-credential populated build. |
| `npm run verify:videos` | Exit 1 at preflight: missing `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`. No production browser or Lighthouse measurement ran. |

The E2E and compile-only build used a public synthetic flag value. Their
missing-key allowance does not satisfy populated production criteria. Build
generation changed sitemap dates; those generated changes were restored so
only this evidence record remains in the worktree.

## Acceptance evidence and limits

- Initial response: the focused regression passes using 25 synthetic saved
  videos, asserting first-page and direct-playlist card markup before hydration.
  Production-populated initial HTML and hydration/footer stability remain unmeasured.
- Performance: no PR-build mobile CLS/LCP pairs or emitted first-thumbnail
  priority observation were obtained. The historical live-site CLS 0.511 and
  LCP 3.8, 4.3, and 11.8 seconds are not measurements of this PR build.
- Search: synthetic unit coverage passes; production browser result pending.
- Playlist filtering: synthetic unit coverage passes; production browser result pending.
- Pagination: synthetic unit and server-markup coverage passes; production browser result pending.
- Direct playlist URLs: synthetic initial-markup coverage passes; production browser result pending.
- Empty state: synthetic initial-markup and gallery coverage passes; production verification pending.
- Error state: synthetic initial-markup/retry-link coverage passes; production verification pending.
- Valid-credential build: blocked at verifier preflight, separately from lint,
  type-check, focused regression, and unit results above.

## Remaining external work

No authenticated artifact-management or review-driver interface is exposed in
this session. Historical artifacts `12218763710` and `12216535219` were not
downloaded, classified, removed, or otherwise dispositioned. The actual
serialized Ashley request was not inspected or submitted. Repository documents
cannot establish either operation's completion.

The authorized Actions operator and review-driver maintainer still need to
record those results. Fresh production-populated verification requires an
independently approved exact head, a supported credential-safe runner, valid
credentials, and service access unavailable under this sandbox's network
restriction. Reconcile the head again after the harness commit. Record all
three mobile CLS/LCP pairs, thumbnail priority, footer stability, and individual
interaction outcomes. Independent reviews and deployed-revision live API
integration remain outstanding.

Only this evidence record changes. No concrete website defect was identified
by the completed checks, and no production code was changed. This is a
verification/documentation task with no meaningful new automated behavior
test; no red run, green fix, or refactor cycle is claimed.
