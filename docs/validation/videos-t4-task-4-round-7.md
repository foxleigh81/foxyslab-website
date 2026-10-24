# T4 task 4: mobile layout and thumbnail measurements

Recorded 2026-10-22 for source SHA
`fd53428ba6e504cd1df3f5ea50ec9d6f51240c5a` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. Local `HEAD` and
fresh anonymous `GET /repos/foxleigh81/foxyslab-website/pulls/79` both identify
this open draft PR SHA. The harness commit that follows this documentation
change will be a new subject and requires a fresh head check.

## Measurement disposition

**Blocked before populated build/browser execution.** The three required mobile
Lighthouse runs were not performed. No CLS or LCP readings, first-thumbnail
priority observation, or supporting run artifacts exist for this SHA. The
ticket's 2026-10-12 live baseline (CLS 0.511 on all three runs; LCP 3.8, 4.3,
and 11.8 seconds) is historical comparison data, not a measurement of this
head. No LCP improvement is claimed.

| Run | Tested SHA and dataset | CLS | Paired LCP | First-thumbnail hint/artifact |
| --- | --- | --- | --- | --- |
| 1 | Not run; no approved populated dataset | Unmeasured | Unmeasured | Not inspected; no artifact |
| 2 | Not run; no approved populated dataset | Unmeasured | Unmeasured | Not inspected; no artifact |
| 3 | Not run; no approved populated dataset | Unmeasured | Unmeasured | Not inspected; no artifact |

The empty current-head failure evidence supplies no reproduced defect. The
existing populated verifier builds from live API credentials and exercises
live data; it does not accept an immutable saved-data source. The candidate
`.github/workflows/videos-verification.yml` is present in this checkout, but
its environment declaration and SHA checks do not establish an effective
independent approval gate or authorize credential release. General CI uses a
missing-key build path, so its build/Lighthouse job cannot satisfy populated
acceptance.

## Research and access findings

Inspected for this round: `app/videos/page.tsx`, `components/VideoGallery/`,
`lib/youtube.ts`, `scripts/verify-videos.mjs`,
`scripts/lib/verify-videos.mjs`, `playwright.videos-production.config.ts`,
`.github/workflows/ci.yml`, `.github/workflows/videos-verification.yml`,
`docs/validation/videos-source-research-t3-task-1.md`,
`docs/validation/videos-t4-private-controls.md`, and the public PR #79 record.
The page obtains its cards from the live YouTube producer; the existing
production verifier has no saved-data argument. The browser and Lighthouse
configuration does not itself establish populated data provenance.

The exact private operations/source inventory resource and its access custodian
are not exposed by the inspected repository or public PR. No record inspected
identifies the dataset custodian or who may approve its use. Marcus is named as
the Engineering research coordinator, but is not evidenced as either. No
approved immutable dataset identity/digest, dataset-use approval, private
controller/revision and invocation, source access receipt, or private build and
browser route was supplied. The website sandbox has no interface to inspect the
private operations inventory or contact its owner. These are bounded access
gaps, not evidence that the resources or approvers do not exist. No credentialed
run or external message was attempted.

An authorized operations/source-inventory reader must identify the precise
resource locator and custodian. Marcus's research deliverable is to record the
source owner and approval reference, immutable dataset identity/digest and
coverage, and the private runner/controller revision and exact invocation that
uses the same dataset at build and runtime. The private route must bind these
inputs to a freshly revalidated PR SHA. Macklin's independent assessment of
the exact subject and effective release, access, retention, and cleanup controls
must precede any credentialed execution. None of those receipts is present here.

## Acceptance status

| Criterion | Status | Evidence or remaining result |
| --- | --- | --- |
| Three exact-head mobile runs, each CLS below 0.1 | Blocked | No populated-data route or run artifacts; each result is unmeasured above. |
| Paired LCP and first visible thumbnail priority inspection | Blocked | No Lighthouse reports or production DOM observation. Source-level priority hints are not an emitted browser observation. |
| Populated initial response and stable hydration/footer layout | Blocked for production | Existing synthetic regression is separate from approved saved-data browser evidence. |
| Search, playlist filter, pagination, direct URLs, empty/error states | Blocked for populated production acceptance | No new populated browser results in this round. |
| Populated regression, configured checks and valid-data build | Partial | Local configured checks are recorded below; no approved valid-data build or production-shaped browser run was available. |
| Post-deployment API integration | Not observed | Requires a separately authorized Production revision/time and separate API and gallery outcomes. |

This is a documentation-only disposition. There is no changed executable
behavior and no meaningful new behavior test or red-green-refactor cycle; no
red run or production repair is claimed. No CI, deployment, credential, or
workflow setting was changed.

## Local checks

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with npm configuration/deprecation/install-script
  warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 346 tests passed and 1 skipped. Vite
  emitted its configuration-loader compatibility warning.
- `git diff --check`: exit 0.

These local checks do not establish populated production behavior or readiness.
The exact-head measurements and all populated-data criteria remain outstanding.
Release readiness remains **no**.
