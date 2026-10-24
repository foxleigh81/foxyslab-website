# T3 task 3, round 48: retained Lighthouse summary inspection

Inspected 2026-10-24 on the assigned branch at local HEAD
`5e62b808320601eaaf2d1048c0c6249ffa1e5811`. This is the current local
checkout; it does not reconcile the Studio operation or establish the live PR
head for a later run.

**Classification: Engineering research.** The required receipt is an observed
retained summary and the independently authorized inspector's input/output
contract, or a precise limitation. No product decision is needed.

## Inspection result

No retained summary contents or external inspector schema were observed. The
separately authorized artifact-owning workflow/inspector is not callable from
this workspace: no invocation interface, inspector endpoint, or authorized
workflow receipt was supplied. Local repository inspection cannot substitute
for that authorized route. The prior artifact ZIP HTTP 401 is not evidence of
repository-permission refusal and is not evidence of any measurement.

The locally configured populated workflow identifies a candidate artifact
path `.lighthouseci/videos/run-*/summary.json`, but this establishes only the
configured path, not existence, access, or contents of a retained artifact.
The local producer in `scripts/lib/verify-videos.mjs` writes a bounded summary
with the run URL and numeric Lighthouse readings. Its contract is separate from
the requested external inspector contract.

The locally available ordinary CI extractor, `scripts/ci-lighthouse-summary.mjs`,
accepts a directory argument (default `.lighthouseci`), reads files named
`lhr-<digits>.json`, and writes `ci/summary.json` containing a `runs` array;
each entry contains numeric `cls` and `lcpMs` values from Lighthouse's
`cumulative-layout-shift` and `largest-contentful-paint` audits. It rejects an
empty report set, invalid JSON, runtime errors, or non-numeric measurements.
This source-level schema observation is not an inspection of the retained
workflow's summary artifact or the authorized inspector's schema.

No historical measurement is attributed to the current PR build. The live PR
head, selected generation-98 run/operation, retained object identity, source
head, build identity, and data digest have not been reconciled in this
workspace. Historical readings in older records retain their own documented
subjects and must not be reused as current-build measurements.

## Remaining receipt

Chris/Marcus must provide the owning-workflow route or its authorized inspector
receipt. That receipt must identify the retained object and inspector version,
record the observed summary fields/schema without exposing raw or private data,
and bind any measurements to their source head, build and approved data digest.
Until then this item remains an explicit inspection limitation and populated
verification remains nondispatchable. No credentialed work or website change
was made.

This is documentation-only research; no executable behavior changed, so there
is no meaningful automated red/green/refactor test. No red run or production
refactor is claimed. No performance measurement or release-readiness conclusion
is claimed.
