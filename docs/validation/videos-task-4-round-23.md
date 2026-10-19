# Task 4, revision round 23: review evidence binding diagnosis

Observed on 2026-10-19 at approximately 23:25 UTC. This is a diagnostic
record, not a review verdict or a request to rerun release verification.
No website, CI, deployment, or driver code changes are justified by the
available evidence. Earlier inventories describe historical heads.

## Compared identities and evidence

All API paths below are relative to
`https://api.github.com/repos/foxleigh81/foxyslab-website/` and were read
without supplying credentials. No external state was changed.

| Identity / evidence | Observed value and provenance |
| --- | --- |
| Live PR #79 head | `GET pulls/79`, HTTP 200: `0204433a465d83c39e2c461ee2d08b91f30eb156`; open, draft, branch `eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`; updated at `2026-10-19T22:32:15Z` |
| Local checkout | `git rev-parse HEAD`: `0204433a465d83c39e2c461ee2d08b91f30eb156`; worktree initially clean; origin is `file:///work/trusted.git` |
| Reported subject head | Brief supplies `0204433a465d83c39e2c461ee2d08b91f30eb156`, matching the live PR and checkout |
| Actual lead-review subject commit | Unavailable: the serialized driver subject is not supplied or exposed locally. The reported subject above is not proof of the driver's selected subject |
| Verification revision | Unavailable: no revision ID or serialized verification record is supplied; current exact-head failure evidence is `[]` |
| Reported succeeded runner head | Brief supplies `75704e230c864018dc59f60206cacb12f539ed92`; local `git cat-file -t` exits 128, object unavailable. No runner result payload is available to validate its role |
| Lint, Type Check & Unit Tests | Check `118340664469`, completed/success, `head_sha` = `0204433a465d83c39e2c461ee2d08b91f30eb156` |
| E2E Tests | Check `118340664417`, completed/success, same exact `head_sha` |
| Build & Lighthouse | Check `118340664091`, completed/success, same exact `head_sha` |
| Vercel Preview Comments | Check `118344357895`, completed/success, same exact `head_sha`; this check is distinct from deployment status |
| Vercel status | Combined status response `sha` = `0204433a465d83c39e2c461ee2d08b91f30eb156`; status `56739279752`, context `Vercel`, success, created `2026-10-19T22:32:15Z` |

The three CI checks link to jobs in
[Actions run 39334561624](https://github.com/foxleigh81/foxyslab-website/actions/runs/39334561624).
The Vercel status target is
`https://vercel.com/foxleighco/foxyslab-website/7dwkwsp3KcCAzoRnMNdgAPYuEmjD`.
That target was not accessed under the sandbox network restrictions; status
success does not demonstrate populated page contents or measurements.

## Paired lookup reproduction

| Read-only request | Observed result |
| --- | --- |
| `GET commits/0204433a465d83c39e2c461ee2d08b91f30eb156/check-runs` | HTTP 200, `total_count: 4`, all four checks listed above |
| `GET commits/0204433a465d83c39e2c461ee2d08b91f30eb156/status` | HTTP 200, combined `state: success`, Vercel status listed above |
| `GET commits/75704e230c864018dc59f60206cacb12f539ed92/check-runs` | HTTP 422: `No commit found for SHA: 75704e230c864018dc59f60206cacb12f539ed92` |
| `GET commits/75704e230c864018dc59f60206cacb12f539ed92/status` | HTTP 200, response `sha` matches runner head, `state: pending`, `statuses: []` |
| `GET pulls/79/reviews` | HTTP 200, `[]`; GitHub reviews do not supply the external lead-review record |

The runner-head lookup reproduces absent GitHub check/status evidence, while
the PR-head lookup returns it. This supports investigating accidental runner
head selection. It does **not** establish that the driver issued either
request, used that head, or rejected those responses. In particular, the
empty runner status response does not establish that the commit exists, and
does not describe a pending deployment at the actual PR head. Another
possible selection issue is treating the `Vercel` commit status as a check
run; the observed API separation alone does not prove such a driver defect.

## Unresolved technical dependency

The exact rejected lookup/binding remains unavailable. Repository searches
found verification workflows and review documentation, but no external driver
implementation, serialized subject, verification revision, or rejection trace.
No callable review-driver interface is exposed in this session. Evidence
reference labels and the incident's evidence hash are not retrievable driver
records here.

For Chris/Marcus and the driver maintainer, the concrete missing diagnostic
inputs for incident `job-71-d38d08d4-acb77810-4752-4971-9bf3-2750d3717dd3`
are the selected lead-review subject ID and commit; verification revision and
its subject association; runner result with the meaning of its head field;
the evidence query keys (repository, PR, SHA, revision, evidence type); and
the rejected response or predicate, including permission/provenance filters.
Compare those values to the successful PR-head requests above. If runner SHA
substitution is confirmed, repair the binding in the driver and demonstrate
its corrected lookup there. If another predicate rejects the records, record
that predicate and its inputs before deciding on a repair. This is a handoff
record; no maintainer contact or driver repair is claimed.

No fresh verification request was made. The live head matches the supplied
subject at observation time; a later harness commit requires another head
comparison. Successful metadata lookup is not an Ashley or Macklin verdict.
Populated initial-layout/hydration evidence, three mobile CLS/LCP pairs,
thumbnail priority, interaction results, valid-credential build evidence,
historical artifact disposition, actual serialized Ashley-request inspection,
independent verdicts, and post-deployment live API integration are not
established by this diagnosis. Release readiness remains incomplete.

## Local validation

This changes documentation only. There is no changed executable behavior for
a meaningful red-green-refactor test; no red run, green fix, or refactor is
claimed. The following configured checks completed on this checkout; they do
not repair or verify the external driver or certify a later harness commit.

| Command | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | Exit 0; 987 packages installed; lockfile unchanged |
| `npm run lint` | Exit 0 |
| `npm run type-check` | Exit 0 |
| `npm test` | Exit 0; 38 files passed, 345 tests passed, 1 skipped |

Production build, browser, and Lighthouse checks were not repeated for this
documentation-only driver diagnosis. The GitHub metadata reads above are
diagnostic observations, not new production verification runs.
