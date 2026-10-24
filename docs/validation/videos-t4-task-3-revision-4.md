# T4 task 3: revision 4 local verification

Recorded 2026-10-22 against source
`a59965a3d88e347733fe7b982981a5259f1cf9f0` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`, initially clean.
An anonymous GitHub REST `GET /repos/foxleigh81/foxyslab-website/pulls/79`
returned open, draft, and that same head. These observations identify the tested
source, not the subsequent harness commit or an independent approval.

## Capability inventory

- No approved saved-video snapshot, immutable digest, source-owner receipt or
  pagination/playlist coverage receipt was supplied. The 25-video unit fixture
  is synthetic and cannot establish production-data provenance.
- `lib/youtube.ts` fetches live YouTube data. `scripts/lib/verify-videos.mjs`
  passes credentials to build and runtime but exposes no saved-snapshot input.
  The approved source format and ingestion route remain unavailable.
- Presence-only environment inspection found `YOUTUBE_API_KEY`,
  `FOURTHWALL_STOREFRONT_TOKEN`, `FLAGS_SECRET`, `VIDEOS_BASE_URL` and
  `VIDEOS_REPORT_DIR` absent. No secret values were fetched or printed.
- The candidate verification workflow still requires `main`. No authorized
  external controller revision, invocation receipt, independent exact-head
  clearance, or effective private retention receipt was supplied. The existing
  summary-only upload, hidden-file inclusion and 14-day retention request are
  present at this head; they do not establish effective private access or
  failure/cancellation cleanup on the external runner.
- `git worktree list` identifies only `/work/repo`. No separate authorized
  Engineering-driver checkout, redacted lookup trace or operations interface
  was supplied. Run terminal status, plan-generation association and
  ready-for-dev provenance remain unverified. No driver diagnosis was attempted.

These are capability blockers, not unresolved product choices. The supplied
current-head defect list is empty. Local checks do not establish a populated
website defect requiring a production repair.

## Ticket criteria

| Criterion | Disposition | Evidence and limits |
| --- | --- | --- |
| Initial populated cards or stable reserved space; footer stable through hydration | Blocked | Existing synthetic initial-markup regression passes, including direct playlist URLs. No approved populated initial response or browser footer positions were captured. |
| Three mobile CLS values below 0.1 and all three LCP values | Blocked | No approved populated production target or measurements. No LCP improvement is claimed. |
| Emitted first-thumbnail priority hint | Blocked for production acceptance | Source passes priority to the first card and sets `fetchPriority="high"`; unit coverage passes. This is not inspection of the emitted approved production response. |
| Search, playlist filter, pagination and direct playlist URLs | Blocked for populated acceptance | Local unit and synthetic verifier coverage is available; approved saved-data production interactions remain unobserved. |
| Distinct empty/error states | Observed in synthetic tests only | Page regression covers both server states; production-data acceptance remains blocked. |
| Focused regression, lint, types, unit/E2E and valid-credential build | Partial | Local checks below; valid-credential populated build is blocked. |
| Post-deployment live API integration | Blocked | No authorized deployment observation or production API/gallery result. |

## Local checks

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed. npm emitted configuration, deprecation and
  install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test -- app/videos/__tests__/page.test.tsx`: exit 0; 10 tests passed.
- `npm test`: exit 0; 38 files passed, 348 tests passed and 1 skipped.
  Vite emitted its existing configuration-loader compatibility warning.
- `env -u YOUTUBE_API_KEY -u FOURTHWALL_STOREFRONT_TOKEN -u SENTRY_AUTH_TOKEN NEXT_PUBLIC_SENTRY_DSN= FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc NEXT_TELEMETRY_DISABLED=1 npm run test:e2e -- --reporter=line --workers=1 --max-failures=1`:
  exit 0; 71 passed, 5 skipped in 3.6 minutes. The flags value is the existing
  public synthetic CI fixture. The previous connection-refused failure did not
  recur with one worker. This does not diagnose its earlier cause. Controlled
  server-markup empty/error browser tests skip without `VIDEOS_STATE_FIXTURE_DIR`;
  the separate synthetic navigation-state tests passed. Production-tagged tests
  are excluded by the ordinary configuration. Server output included missing
  YouTube key notices, webpack cache warnings and Watchpack access warnings.
- `git diff --check`: exit 0.

No credentialed build or Lighthouse run was attempted because the approved
source, execution route and independent clearance are unavailable. A missing-key
build would not resolve those acceptance blockers. No production measurement
artifact or CI report link was generated.

This revision changes only this evidence record. There is no executable behavior
change with a meaningful new automated behavior test; no red run, production
repair, refactor or red-green-refactor cycle is claimed.

## Remaining work

The external coordinator must obtain the approved source/digest and a route
that supplies it to both build and runtime, plus an authorized controller and
effective private evidence retention. Independent exact-head review must precede
credential release. Ashley's and Macklin's independent assessments remain
outstanding; this record does not grant clearance. Studio can then collect the
populated build, browser and three mobile Lighthouse results with safe report
links tied to the then-current head. Post-deployment live API observation is
separate. Release readiness remains **no**.
