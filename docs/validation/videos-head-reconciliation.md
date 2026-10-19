# PR #79 live-head evidence inventory

Reconciled on 2026-10-19 against the checked-out branch
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. Local `HEAD` is
`7d6303ff50aba52047141087bd52a475e377138c`, matching the live head supplied
for draft PR #79. The worktree was clean before this inventory update. No new
workflow was dispatched and no passing verification was repeated.

## Run and artifact binding

| Evidence | Subject / commit | Environment and credentials | Result | Reuse decision |
| --- | --- | --- | --- | --- |
| Run `r20261019-ce819ff2e489` | Reported head `e9ffc5db9dae6c81777c4c41a5bc20897404135c`; differs from live `7d6303f` | Run metadata supplied in the review packet; environment and credential use are not established by the available record | Reported completion, but no detailed result or artifact contents are available here | Stale for the live head; do not use as acceptance evidence |
| Run `r20261019-44fd68af9bd3` | This is the current branch's round-7 commit `7d6303ff50aba52047141087bd52a475e377138c` | Local Engineering sandbox; Node 24.21.0 / npm 11.19.0. No live YouTube or Fourthwall credentials; a synthetic `FLAGS_SECRET` was used only by ordinary E2E | `npm ci`, lint, type-check, and unit tests passed on the pre-commit source tree (`752d8f3`); ordinary E2E passed 71 and skipped 5. `npm run verify:videos` stopped at credential preflight | The documentation-only commit adds no application behavior, but local commands were run before the final commit and are not exact-commit execution evidence. Reuse as implementation-level local checks only, not exact-head CI or populated verification |
| CI jobs `118229510029`, `118229509827`, `118229509454` | Reported in the run evidence for live PR head `7d6303f` | GitHub Actions. Lighthouse/build job allows missing API keys; E2E log reports no YouTube key. No valid build-time data credentials are demonstrated | General CI is green | Reuse for the general CI checks it actually ran. It does not establish the credentialed build or populated gallery behavior |
| Artifact `artifact-118229510029` | Associated with CI job `118229510029` and live-head CI evidence | GitHub Actions artifact; credentialed data availability is not established | Artifact reference exists in the supplied evidence, but its contents and measurements are not present in this checkout | Cannot reuse to assert browser observations or numeric measurements until an authorized reviewer inspects the artifact and confirms its head binding |
| Existing draft PR #79 | `7d6303ff50aba52047141087bd52a475e377138c` | Live GitHub PR metadata as supplied for this reconciliation | Draft remains open; no exact-head failure evidence was supplied (`[]`) | Current subject for future evidence; no approval or verdict implied |

The old reconciliation record described `79cb880` and CI run `39290824396`.
Those identifiers do not match the current live head or the run evidence in
this revision. Its artifact IDs and conclusions are historical and are not
carried forward as current-head evidence.

## Acceptance criteria inventory

| Criterion | Current evidence bound to `7d6303f` | Environment / credentials | Status and reuse decision |
| --- | --- | --- | --- |
| Initial response includes first-page cards or stable reserved space; hydration does not move the footer through the viewport | The repository contains a focused server-render regression test and implementation. Local focused tests were reported passing before the final documentation-only commit; current-head CI is general CI only | Fixture-based local test; no populated production-equivalent browser observation | Regression coverage is present, but exact-head test output and populated hydration/footer observation are absent. Do not claim production stability |
| Three production-equivalent mobile Lighthouse CLS values below 0.1; record LCP and inspect first-thumbnail priority hint | No per-run CLS/LCP values or populated-page thumbnail-hint observation are available from the supplied artifacts | Credentialed production-equivalent build/browser environment not established | Missing. The Lighthouse job's missing-key bypass cannot satisfy this criterion; no measurements may be reused |
| Search, playlist filter, pagination, direct playlist URLs, and empty/error states retain behavior | Focused tests and ordinary E2E have been reported passing on the round-7 source tree; CI general checks also pass on the live PR head | Fixture/missing-data local environment; CI E2E specifically reports no YouTube key | Reuse as fixture/general-CI behavior evidence only. Populated data behavior remains unverified |
| Focused layout regression, lint, type-check, unit/E2E, and build with valid build-time data credentials | Focused test, lint, type-check, unit, and ordinary E2E results exist from the pre-commit source tree; exact-head general CI is green. `verify:videos` locally failed before build because required credentials were absent | Local tests used no live data credentials; ordinary E2E used synthetic flags only. CI build allows missing API keys | Partial. General CI can be reused for checks it ran, but credentialed production-equivalent build and populated-browser checks are missing |
| Independent review verdicts after prerequisites | No exact-head Ashley QA or Macklin security verdict is supplied | Not applicable | Missing. Green CI is not an independent review verdict |

## Readiness

General CI success and the production acceptance evidence are separate. The
following remain outstanding on the live head: a valid credentialed build;
populated browser evidence for initial layout, hydration/footer stability,
search, playlist filtering, forward/back pagination, direct playlist URLs,
and labelled empty/error states; observation of the emitted first-thumbnail
priority hint; three production-equivalent mobile CLS/LCP pairs with every CLS
below 0.1; and independent Ashley and Macklin verdicts after their respective
prerequisites have new evidence. The historical ticket baseline (CLS 0.511 on
each run; LCP 3.8, 4.3, and 11.8 seconds) is not a measurement of this head.
No fixed LCP improvement is claimed.

This round changes verification documentation only. The available evidence
does not demonstrate a new behavior defect, so no behavior test has a
meaningful red-green-refactor cycle. No new red run is claimed.
