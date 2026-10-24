# T3 task 1, revision round 20: terminal run and artifact reconciliation

Checked 2026-10-24 UTC on branch
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`, local HEAD
`06d780293701a4970a218423c3a340bd262ea2cb`. This is a record of public
run metadata and local access limits; it is not a private artifact readout or
verification of the /videos acceptance criteria.

## Run disposition

The supplied terminal run `r20261024-b2c43519a294` corresponds to Actions run
`40045540748`. Public run metadata reports `completed` / `success`, event
`pull_request`, PR #79, and the same head SHA as this checkout. Job
`120726381366` (`Build & Lighthouse`) also reports `completed` / `success`.
Its steps `Run npm run build`, `Run npm run test:lighthouse`,
`Extract numeric Lighthouse measurements`, `Retain numeric Lighthouse
measurements`, and `Link Lighthouse measurements` all report success. This
records the terminal disposition; no duplicate website verification run was
started in this task.

## Artifact readout receipt

Public artifact metadata identifies artifact `12541790399`,
`lighthouse-results`, size 280 bytes, created `2026-10-24T00:37:48Z`,
unexpired with expiry `2026-11-07T00:37:47Z`. Metadata does not expose archive
contents or `/videos` fields. An unauthenticated archive request returned HTTP
401. `gh` is unavailable and neither `GH_TOKEN` nor `GITHUB_TOKEN` is present
in this checkout. No authorized inspection owner readout or Chris disposition
receipt was available here, and no credentials or raw artifact data were
obtained.

The workflow source for this job's extractor,
`scripts/ci-lighthouse-summary.mjs`, reads files named `lhr-<digits>.json`,
extracts numeric `cumulative-layout-shift` and `largest-contentful-paint`
audit values, and writes `{ runs: [{ cls, lcpMs }, ...] }` to
`.lighthouseci/ci/summary.json`. The public step conclusion confirms the
extractor command succeeded, but neither its emitted JSON nor any `/videos`
fields are visible in public metadata. Therefore the artifact's actual
numeric values and `/videos` fields, and the reported empty extraction result,
cannot be compared from this environment. It remains unknown whether numeric
measurements are absent from the artifact or were missed during extraction;
no specific extractor defect is reproduced, so no extractor change is made.

## Disposition and remaining evidence

| Acceptance item | Result |
| --- | --- |
| Run-disposition receipt | Public metadata establishes terminal success for the named run and job; duplicate dispatch avoided. Separate Chris coordination receipt is unavailable. |
| Authorized artifact-readout receipt | Blocked: artifact identity and metadata are recorded, but private JSON field inspection was not available. `/videos` values and extraction result remain unknown. |
| Extractor repair, if defective | No change: no defect can be established without the artifact fields. |
| New website verification run | None started. |

No behavior changed, so a TDD red/green/refactor test would have no meaningful
target; no red run is claimed. The authorized Actions operator must provide a
credential-safe readout limited to the run/job/artifact identifiers, fields
present, and whether extraction omitted numeric fields. That readout is needed
to complete the requested comparison. Ticket-level populated /videos
verification remains separate and unestablished by this record.
