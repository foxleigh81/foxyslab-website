# T4 task 3: revision 3 local verification

Recorded 2026-10-21 at source SHA
`0dfa4b0b21a136370fa26a992efdede18121cb97`, on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`.
The checkout was initially clean. This identifies the locally tested source;
the live PR head was not queried and the later harness commit is not verified.

## Prerequisites and scope

The supplied brief and inspected [private-controls record](videos-t4-private-controls.md)
provide no approved immutable dataset, authorized saved-data invocation, or
independent exact-head assessment. The [source research record](videos-source-research-t3-task-1.md)
does not identify the private resource locator or its custodian. Those identities
remain unknown; Marcus is the research coordinator, not a verified source owner.
This sandbox has no supplied interface to the external operations inventory.
Repeating website inspection cannot establish its owner or permissions.

Local inspection confirms `lib/youtube.ts` reads live YouTube v3 data and the
existing verifier has no saved-source input. The focused page test mocks 25
videos from `test/fixtures/youtube`; this synthetic fixture has no approved
dataset identity or capture digest. No supplied current-head failure evidence
establishes a website defect for a test-first repair.

## Acceptance disposition

| Criterion | Status | Evidence or missing result |
| --- | --- | --- |
| Populated initial layout and hydration/footer stability | Blocked | Existing synthetic layout regression passes; approved saved-data browser observation is unavailable. |
| Three mobile CLS readings below 0.1, paired LCP, first-thumbnail priority | Blocked | No approved production browser route or measurements. No LCP improvement claimed. |
| Search, playlist filtering, pagination, direct playlist URLs, empty/error states | Blocked for populated acceptance | Unit suite passes; populated production interaction results are unavailable. |
| Focused regression, lint, types, unit/E2E and valid-data build | Partial | Local results below; approved dataset and valid-data build remain unavailable. |
| Ashley and Macklin review gates | Blocked | No independent clearance receipts supplied. Both blocks remain in force; this record grants no approval. |
| Post-deployment live API/gallery integration | Blocked | Requires a separate Production revision, observation time, API request and gallery outcome. |

## Local checks

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed; npm configuration, deprecation and install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test -- app/videos/__tests__/page.test.tsx`: exit 0, 10 tests passed.
- `npm test`: exit 0, 38 files passed, 346 tests passed and 1 skipped.
  Vite emitted its configuration-loader compatibility warning.
- `npm run test:e2e -- --reporter=line --workers=2 --max-failures=1`:
  exit 1 before tests; the development server reported missing `FLAGS_SECRET`
  and Playwright timed out waiting for readiness after 60 seconds.
- `FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run test:e2e -- --reporter=line --workers=2 --max-failures=1`:
  exit 1; 46 passed, 2 skipped, 2 failed and 26 did not run. This uses the
  existing public synthetic CI flag value, not a private credential. Server
  startup succeeded, but later iPhone navigation failed with connection refused
  at `http://localhost:3000/`; the cause of server unavailability is not
  established. The suite stopped at the configured failure limit. This is an
  incomplete E2E result, not a reproduced populated-gallery defect. Earlier
  output also reported Watchpack/cache warnings and no YouTube API key.
- `git diff --check`: exit 0.

No valid-data production build or Lighthouse run was attempted: the source and
execution prerequisites are missing. No missing-key build is counted as evidence.

Documentation only: no executable behavior changed, so there is no meaningful
new automated behavior test or red-green-refactor cycle. No red run, production
repair or refactor is claimed. No CI, deployment or secret-handling changes made.

## Remaining work

External operations research must identify the actual source resource and
custodian. Marcus must obtain source approval, immutable dataset coverage and
the executable private route. Macklin must independently assess the exact head,
source and controller before credentials are released, with Ashley's block also
resolved independently. The authorized runner can then produce sanitized build,
browser and Lighthouse evidence and report links bound to the then-current SHA.
The ordinary E2E suite also needs a complete rerun with a stable local server;
its connection-refused failure requires diagnosis if reproduced on that runner.
No populated reports were generated or published in this sandbox.

Release readiness remains **no**.
