# PR #79 populated-verification admission, revision 5

Inspected 2026-10-23. Disposition: **BLOCKED; not admitted**. This is the
current admission record for the supplied task, superseding the subject binding
in `videos-t4-controls-round-4.md`; historical observations remain historical.
No approved source or independent clearance is inferred from passing CI.

## Exact subject and fresh observations

Local HEAD and a fresh unauthenticated GitHub `GET /pulls/79` both identify
`c0ac87935f6d0b730b48fe6e56fbe7e49e52d534`; the API returned 200, open and draft.
The checked-out branch is
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`, initially clean.
These observations do not verify the later harness commit.

Fresh unauthenticated metadata reads also returned:

| Endpoint | Result and limit |
| --- | --- |
| `GET /contents/.github/workflows?ref=main` | 200; only `ci.yml`. The candidate populated workflow is not available on its required dispatch ref. |
| `GET /environments/videos-verification` | 404; effective independent approval controls unavailable to this reader. |
| `GET /actions/permissions/artifact-and-log-retention` | 401; effective access/retention policy unavailable to this reader. |

Only selected public metadata was read. No raw reports, private data or secret
values were fetched. A 401/404 does not prove safeguards are absent.

## Admission conditions

Every row is blocked. The receipt requirements describe proposed controls,
not controls established by this record. Marcus is the designated external
verification owner in the supplied plan; no accepted handoff is claimed here.

| Condition | Evidence and missing receipt |
| --- | --- |
| Approved saved-video source and digest | Source identifier, owner approval, capture time, immutable SHA-256 digest and access receipt are **unavailable**. `lib/youtube.ts` consumes live YouTube data; `test/fixtures/youtube.ts` is synthetic. Neither establishes an approved immutable saved-data source. The owner must supply a manifest and approved ingestion route without putting private data in this repository. |
| Population and pagination | Actual eligible video/playlist counts are **unknown**. `components/VideoGallery/index.tsx` uses 12 cards per page. Require more than 12 eligible videos, populated playlist membership and suitable search/filter cases, all bound to the same source digest. Synthetic test counts are not source admission evidence. |
| Production-equivalent build/browser target | Candidate at the exact head above: `npm run verify:videos`, which executes `npm run build` with `NODE_ENV=production` and `ALLOW_MISSING_API_KEYS=false`, serves that build with `next start` on loopback and tests `/videos` using `playwright.videos-production.config.ts`, followed by three mobile Lighthouse runs. No executed build ID, build digest, browser origin or approved saved-source binding exists for this task. Require a receipt linking head, source digest, controller revision, build identity, browser URL and run/report IDs. A Preview badge is insufficient. |
| Executable external route | `.github/workflows/videos-verification.yml` exists on this branch but requires `main`, where it was not listed. No alternative approved private controller or caller is identified. Establish the route outside this website runner. YouTube, Fourthwall and image origins are outside the sandbox network allowance. |
| Credential isolation and release | The candidate passes application credentials to build/server and excludes them from browser/Lighthouse child environments. It unsets `GH_TOKEN` before verification, but step credentials already enter the environment before shell head checks. Require an independent gate before release to PR code, bound to the exact head, source and controller, with head-change invalidation; attest reviewer/self-review/bypass settings and least-privilege credential scope. Installation and PR-controlled code on the same runner belong in that assessment. No credentialed run is admitted. |
| Private artifact access and retention | Require an approved private store, named authorized readers, access enforcement, explicit expiry and deletion owner for source data, raw reports, build/cache files, logs and job summaries. The candidate requests 14-day retention for `summary.json`; effective privacy/expiry is unverified. Summaries also need classification before publishing links or contents. Ordinary CI raw Playwright uploads and the ordinary Lighthouse public-upload route cannot establish private containment. |
| Cleanup and containment | The verifier stops its server and discards raw run-directory files in `finally`. That is not a receipt for abrupt termination or removal of `.next`, caches, logs or historical uploads. Require cleanup on success, failure and cancellation, destruction of runner scratch data, expiry/deletion confirmation and private disposition of previously retained artifacts. Historical reconciliation records are not fresh cleanup receipts. |
| Macklin's independent disposition | **NOT RECORDED / BLOCKED**. No independent approval receipt for this head, source and route was supplied or established. Require reviewer identity, timestamp, immutable subjects, scope and decision before credential release. This implementer does not substitute its own assessment for that decision. |

No credentialed build, workflow dispatch, production browser run or Lighthouse
measurement was performed. No external message was sent. This record is a local
handoff for the lead to route through the authorized external process, not
evidence that Marcus or Macklin has received or accepted it.

## Next task boundary

The caller retains revalidation of ready-for-dev provenance, generation 65 and
terminal state of `r20261023-2c8c05d70d46`; those control-plane receipts are not
available here. The supplied empty current-head failure list provides no
reproduced website defect requiring a speculative code change.

After admission, measurement must bind every result to the same head, build and
source digest: initial cards/reserved space and hydration/footer stability;
three mobile CLS values each below 0.1, paired LCP and emitted first-thumbnail
priority; search, playlist filtering, pagination, direct playlist URLs and
distinct empty/error states; populated regression, lint, type-check, unit/E2E
checks and production build. Those production observations remain blocked,
and no network-dependent LCP improvement is claimed. Retain report links only
through the approved private route.

Live API integration remains **pending after deployment**, triggered by an
authorized deployment with an identified Production revision and visible
`/videos` outcome. It is not a pre-release website-runner dispatch. No deployment,
merge or independent review verdict is claimed.

## Local validation

Documentation only: no executable behavior changed, so a new automated
red/green/refactor behavior test is not meaningful. No red run or refactor is
claimed. Fresh local checks:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with npm configuration/deprecation/install-script
  warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 348 tests passed, 1 skipped. Vite emitted
  its config-loader compatibility warning.
- `git diff --check`: exit 0.

These checks do not establish populated production acceptance or verify the
future PR head. Production build, populated E2E and Lighthouse remain blocked
by admission conditions; no production measurement report links were produced.
