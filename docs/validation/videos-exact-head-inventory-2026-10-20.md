# PR #79 exact-head evidence inventory

Checked on 2026-10-20. The local checkout, public GitHub PR #79 API, and all
three CI job records identify live head
`e3899a89681d201f2199c10a11d2f1eb919b4ea9` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The PR is open and
draft. The supplied exact-head failure list is empty (`[]`). This is an
inventory of accessible evidence, not a populated-data verification.

## Exact-head results inspected

| Result                             | Identity and head                                                                                                                                                                                     | Outcome                                                | Criterion coverage and limits                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI `Build & Lighthouse`            | Run `39345311151`, job `118376365640`, head `e3899a89681d201f2199c10a11d2f1eb919b4ea9`; completed `2026-10-20T00:07:01Z`                                                                              | Success in public check/job metadata                   | Covers configured `npm ci`, build, and Lighthouse checks as a general CI result. `.github/workflows/ci.yml` sets `ALLOW_MISSING_API_KEYS=true`; it is not proof of credentialed populated data, populated gallery layout, or the ticket's three production-equivalent measurements. Job logs were unavailable (HTTP 403), so no numeric result is inferred. |
| CI `E2E Tests`                     | Run `39345311151`, job `118376366097`, same head; completed `2026-10-20T00:08:02Z`                                                                                                                    | Success in public check/job metadata                   | Covers ordinary E2E only. `.github/workflows/ci.yml` supplies a synthetic flags secret and no YouTube or Fourthwall credentials. It does not prove populated saved-video behavior. Logs were unavailable (HTTP 403); no test count or result details are claimed.                                                                                           |
| CI `Lint, Type Check & Unit Tests` | Run `39345311151`, job `118376365912`, same head; completed `2026-10-20T00:04:12Z`                                                                                                                    | Success in public check/job metadata                   | General lint, type-check, and unit-test check. No focused-test output or populated-data proof was accessible from its job log (HTTP 403).                                                                                                                                                                                                                   |
| Playwright report artifact         | Artifact `12230542588`, `playwright-report`, run `39345311151`, workflow metadata binds it to same branch and head; created `2026-10-20T00:07:59Z`, not expired                                       | Metadata available; archive endpoint returned HTTP 401 | Contents and test outcomes were not inspected. Do not count as browser acceptance evidence until an authorized operator reads and reports the relevant results.                                                                                                                                                                                             |
| Vercel Preview                     | Deployment `7187993645`, ref/head `e3899a89681d201f2199c10a11d2f1eb919b4ea9`; status `20060351362`, success at `2026-10-20T00:04:55Z`; URL `https://foxyslab-website-nluaoy33d-foxleighco.vercel.app` | Deployment completed                                   | `/videos` could not be reached from this sandbox: the proxy tunnel returned HTTP 403. Deployment success alone does not show rendered populated data, hydration stability, or working interactions.                                                                                                                                                         |
| Vercel Preview Comments            | Check `118376912947`, same head, completed success at `2026-10-20T00:04:55Z`                                                                                                                          | Success                                                | Comment integration only; it does not cover ticket behavior.                                                                                                                                                                                                                                                                                                |

GitHub's aggregate commit status is success. That status summarizes the above
checks and is not separate acceptance evidence. No exact-head credentialed
verification run or measurement artifact was listed in the accessible
run-artifact metadata.

## Acceptance criteria

| Criterion                                                                                                                            | Exact-head evidence                                                                                                                                                                                                                                             | Status and missing result owner                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial response renders the first card page or stable reserved space; hydration does not move the footer through the viewport       | No accessible populated browser result. The E2E artifact archive was not readable, and Preview could not be opened. General CI is not populated-data evidence.                                                                                                  | Missing populated initial-render and hydration/footer observation. Marcus: arrange authorized credentialed verification.                                                                                                                                                          |
| Three production-equivalent mobile Lighthouse CLS results below 0.1, paired LCP values, and first-thumbnail priority hint inspection | No numeric CLS/LCP result or hint inspection is accessible for this head. CI allows missing API keys. Ticket baseline is CLS 0.511 on all three 2026-10-12 runs and LCP 3.8, 4.3, and 11.8 seconds; these are historical live-site values, not PR measurements. | Missing all three head-bound CLS/LCP pairs and priority-hint observation. Marcus: arrange authorized credentialed verification. No fixed LCP improvement is claimed.                                                                                                              |
| Search, playlist filtering, pagination, direct playlist URLs, and empty/error states retain behavior                                 | General E2E check passed, but its workflow has no data credentials; its logs and report archive were unavailable. No populated page interactions were inspected.                                                                                                | Missing populated behavior results for search, filtering, pagination, direct URL, and empty/error states. Marcus: arrange authorized credentialed verification.                                                                                                                   |
| Focused populated-layout regression, lint, type-check, unit/E2E tests, and build using valid data credentials                        | Exact-head general CI reports success for quality, E2E, and build/Lighthouse jobs. Workflow configuration confirms the build allows missing API keys, and E2E has no data credentials. Focused test output and logs were inaccessible.                          | General CI criteria are recorded as passing; credentialed build and focused populated-layout regression are missing. Marcus: arrange authorized credentialed verification. An authorized Actions operator must inspect artifact `12230542588` for any useful ordinary E2E detail. |
| Live API integration after deployment                                                                                                | Preview deployment exists, but `/videos` was unreachable through the sandbox proxy and no live API result was available.                                                                                                                                        | Missing; owner is the deployment/API verification operator after deployment.                                                                                                                                                                                                      |
| Independent Ashley and Macklin verdicts                                                                                              | No exact-head verdicts were supplied.                                                                                                                                                                                                                           | Missing; Chris routes the driver/request-serialization investigation to the authorized driver maintainer; Ashley and Macklin verdicts remain owned by their respective reviewers through supported paths.                                                                         |

The workflow offers a separate `videos-verification` environment with
`ALLOW_MISSING_API_KEYS=false` and exact-PR-head checks before and after
checkout (`.github/workflows/videos-verification.yml`). No run of that workflow
for this head is present in accessible evidence. An authorized maintainer must
use that protected path to produce missing populated results; this inventory
does not dispatch it or imply approval to release credentials.

The review-driver prerequisite is separate from website evidence. This
sandbox has no driver lookup or serialized Ashley request for plan generation
11 / run `r20261020-cc8c40e29a64`; request contents and size, lookup keys, and
rejected CI/Preview records are unknown here. Chris owns routing that inspection
to an authorized driver maintainer. No driver defect or website change to
retrigger review is inferred from this inventory.

## Historical artifact disposition

The ticket's 2026-10-12 CLS/LCP figures remain the recorded live baseline only;
no pre-implementation measurement is requested retroactively. Historical
artifact containment is tracked separately in
`docs/validation/videos-historical-artifact-containment.md`; the artifacts
listed there belong to older heads and their archive inspection/removal
disposition remains unresolved. Current-head artifact `12230542588` is
separately identified above: metadata is available, but contents remain
uninspected due to HTTP 401. No historical artifact is reused as current-head
acceptance evidence.

## Local validation

This is an evidence-record change; it changes no executable behavior, so there
is no meaningful automated behavior test or red/green/refactor cycle. No red
run is claimed. The public metadata and access outcomes above were observed
directly during this inventory. No CI log, artifact archive, populated Preview
page, or measurement report was inspected where access was denied.
