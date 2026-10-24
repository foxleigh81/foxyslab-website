# Task 1, revision round 8: dispatch boundary blocked

Recorded 2026-10-20 for ticket #71 and draft PR #79. Local checkout is
`599df486e8ac02bc2f12f34bfb0e5d3c98180fc2` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`, matching the
brief's previous checked head. Live PR head, ticket provenance, driver
permissions and terminal run status have not been independently revalidated.

## Findings and limits

The supplied incident account says plan generation 24 described the
post-deployment viewer check as non-dispatchable but a terminal website
revision attempted it anyway. This is a reported symptom, not a retrieved
driver execution record. The evidence hash and reference names in the brief
do not supply the serialized tasks or scheduler decision. The current
exact-head failure evidence is `[]`.

Local inspection found:

- `git ls-files '*driver*' '*scheduler*' '*dispatch*' '*operation*' '*hold*'`
  lists only `docs/validation/videos-driver-inspection-round-30.md`.
- Searching `app`, `lib`, `scripts`, `.github` and `package.json` for
  `scheduler`, `non-dispatchable`, `website.runner`, `Studio driver` and
  `generation 24` finds no matches. Website verification scripts and workflows
  are present, but no Studio task representation or scheduler implementation.
- The historical driver inspection document reports a missing inspection
  interface for a different subject. It does not establish this incident's
  cause or an available hold operation.
- This session exposes no Studio driver read, hold, cancellation or scheduler
  test operation.

The hypothesis is that the prose designation did not become an enforced
dispatch predicate. Whether task serialization dropped it, scheduler selection
ignored it, or another path bypassed it remains unknown. No supported hold
schema can be established from the available material. Adding a website-local
hold file or test would not demonstrate that the external scheduler consumes it.

## External capability repair required

Marcus/Chris need an authorized Studio driver owner to stop website-runner
dispatch for both records below through a supported control or move them to
separate operations/viewer tracking excluded from website-runner selection.
This document is a repair request, not an applied hold or an external assignment.
No new website verification run was launched here; this session cannot stop
the external scheduler. Both tasks remain blocked, not runnable website repairs.

| Task | Unmet prerequisite and retained work | Applied control |
| --- | --- | --- |
| Operations prerequisite (task 1 in the supplied incident) | Authorized exact-head verification route, independent review before credentials reach PR code, and effective reviewer, secret, data and artifact controls | None confirmed; external dispatch stop required |
| Post-deployment viewer (task 3 in the supplied incident) | An identified Production deployment/revision and authorized viewer; live API-backed loading and gallery interactions bound to that deployed revision | None confirmed; external dispatch stop required |

The specific missing capability is an authorized driver interface exposing
persisted task eligibility/dependencies, an enforceable hold or exclusion from
website-runner selection, and a scheduler decision/test record. If the driver
has no such mechanism, its owner must repair that boundary outside this PR
before either task is scheduled again. This is a capability gap in this
session; absence of the capability in Studio itself is not established.

Required driver evidence is the generation-24 serialized task records,
terminal run identity/status, task-3 selection and enqueue trace, evaluated
prerequisites, and runner mapping, reconciled with the live PR head. The owner
must record the confirmed cause and supported control applied to both tasks.
A scheduler regression must then exercise each task with its prerequisite
unmet, including retry/resume selection, and show zero website-runner launches
while retaining its pending criteria. Record the driver revision, task IDs,
predicate outcomes and queue results. No scheduler test was available or run
here, so acceptance criteria 1 and 2 remain blocked.

## Criteria remain open

The hold must retain populated initial cards/reserved layout and hydration/footer
stability; three mobile Lighthouse CLS measurements below 0.1 with paired LCP
measurements and first-thumbnail priority inspection; search, playlist filtering,
pagination, direct playlist URLs and empty/error behavior; populated regression,
lint, type-check, unit/E2E tests and a valid-credential production build. The
live API and gallery interaction check remains separately pending after
deployment. No criterion is marked complete by this record. Macklin's credential
block and independent current-head reviews remain unresolved. No credentials
were requested or released.

## Local validation

This is documentation-only: there is no executable behavior change or meaningful
automated red-green-refactor cycle. No red run, green fix or refactor is claimed.
Local website checks cannot prove a Studio scheduler hold. Production build,
browser and Lighthouse verification remain pending through the authorized route;
local results cannot verify the future harness commit.

Observed local results (all exit 0):

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: 987 packages installed.
- `npm run lint`.
- `npm run type-check`.
- `npm test`: 38 files passed; 345 tests passed, 1 skipped.
