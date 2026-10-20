# PR #79 exact-head evidence inventory

Updated 2026-10-20, revision round 28, T4 task 1. This replaces the earlier
inventory for `e3899a89681d201f2199c10a11d2f1eb919b4ea9`.

## Subject and acceptance boundary

The public GitHub PR API and local `git rev-parse HEAD` both identify
`535361428d97a111aafebf7b21f35558a5f0eb8a` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. PR #79 is open and
draft. This confirms the public head, not driver revalidation of permissions,
provenance, or accepted evidence. The supplied current failure list is `[]`;
that is not proof that checks passed. No driver-accepted result is available
in this sandbox.

For plan generation 12 / run `r20261020-62383644dbb7`, the supplied incident
reports a runner subject of `fa61feefd63631a9d9eb6a17fa532d2968d00afc`.
That subject differs from the PR head and cannot establish PR acceptance.
The serialized request, verification revision, lookup keys, rejected records,
and request size remain unavailable. Chris owns coordination with an authorized
review-driver maintainer outside this website sandbox. Resolution requires the
actual rejection trace and either a demonstrated/tested driver repair or a
specific technical dependency, followed by driver revalidation of the live
head. No driver lookup was repeated and no website code was changed.

## Public evidence inspected for the subject

The following metadata was fetched directly from GitHub during this round.
It is an inventory of observed results, not driver acceptance.

| Result                      | Identity and observed outcome                                                                                         | Acceptance limit                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Quality                     | [Job 118398727897](https://github.com/foxleigh81/foxyslab-website/actions/runs/39352202844/job/118398727897), success | General lint, type-check and unit-test metadata only.                                                                          |
| E2E                         | [Job 118398728070](https://github.com/foxleigh81/foxyslab-website/actions/runs/39352202844/job/118398728070), success | General workflow has no YouTube/Fourthwall credentials; not populated behavior proof.                                          |
| Build & Lighthouse          | [Job 118398728059](https://github.com/foxleigh81/foxyslab-website/actions/runs/39352202844/job/118398728059), success | General CI sets `ALLOW_MISSING_API_KEYS=true`. Log endpoint returned HTTP 403; no populated measurements inspected.            |
| Playwright artifact         | Artifact `12233109962`, `playwright-report`, not expired, run `39352202844`                                           | Metadata binds it to the subject; archive endpoint returned HTTP 401. Contents uninspected. No Lighthouse artifact was listed. |
| Preview                     | Deployment `7188981437`, status `20062814764`, success                                                                | Deployment is bound to the subject, but a deployment badge is not a populated-page observation.                                |
| Preview comment integration | Check `118399312796`, success                                                                                         | Comment integration only.                                                                                                      |

All three CI jobs and the comment check report the full subject SHA above.
The Actions runs endpoint filtered by that SHA listed only general CI run
`39352202844`; no credentialed verification run was listed.
Preview URL: <https://foxyslab-website-5k1cs0kaj-foxleighco.vercel.app>.
Preview was not fetched because the sandbox network permits only GitHub and
npm/PyPI registries. No content or performance inference is made from its URL.

## Concrete setup check

`npm run verify:videos` exited 1 before building:

```text
Missing required credentials: YOUTUBE_API_KEY, FOURTHWALL_STOREFRONT_TOKEN, FLAGS_SECRET
```

Only presence was checked; no credential values were printed or copied.
`GH_TOKEN` and `GITHUB_TOKEN` are also absent, and `gh` is not installed.
Credential validity cannot be tested here. Production APIs, thumbnail hosts,
and the Preview host are outside the permitted network.

Inspection of `scripts/lib/verify-videos.mjs`, `lib/youtube.ts`,
`playwright.videos-production.config.ts`, and the page/browser tests confirms:

- The runner requires credentials, disables the missing-key bypass, builds
  production output, serves it with `next start`, runs browser checks, and
  records three mobile CLS/LCP pairs plus browser outcomes in `summary.json`.
- The production data path fetches YouTube data through Next's fetch cache.
  No saved production-shaped dataset input is configured in this runner.
  Page tests use synthetic video fixtures; generated browser fixtures cover
  empty/error markup. Those fixtures do not populate the production build.
- The protected workflow already links a SHA-named summary artifact and prints
  measurements to its job summary. It checks the PR head before checkout and
  again before verification. Environment protection, independent approval of
  that exact head, valid secrets, and workflow availability on main were not
  verified by public metadata. The YAML alone does not prove those settings.
- Numeric CLS results still need assessment against the strict `< 0.1` criterion;
  a successful runner exit alone is insufficient.

Setup outcome: **blocked, not confirmed usable** for credentialed saved-data
acceptance. Marcus owns arranging an authorized verification environment with
API/image access and a populated data source. Resolution must identify the
saved dataset/provenance and how the PR build consumes it (or obtain an explicit
accepted equivalent), then demonstrate populated cards and interactions. The
verification-environment maintainer must confirm exact-head independent approval
and protected credentials before running PR code with secrets. Do not import
secrets into this sandbox or substitute permissive CI for this check.

## Missing acceptance results and owners

| Criterion                   | Missing result / observable resolution                                                                                                           | Owner                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| Initial layout              | Populated initial response, hydration and footer stability on the revalidated head                                                               | Marcus / authorized verification operator   |
| Mobile performance          | Three production-equivalent CLS values below 0.1, paired LCP values, first-thumbnail priority observation and linked report                      | Marcus / authorized verification operator   |
| Behavior                    | Populated search, playlist selection, forward/back pagination and direct playlist URL results; separately identified empty/error fixture results | Marcus / authorized verification operator   |
| Regression and checks       | Populated-layout regression and credentialed production build/browser evidence; general CI and local tests alone do not close this criterion     | Marcus / authorized verification operator   |
| Driver diagnostic           | Actual generation-12 rejection trace and resulting resolution; no website workaround                                                             | Chris / authorized review-driver maintainer |
| Independent reviews         | Ashley and Macklin's head-bound verdicts                                                                                                         | Respective reviewers, coordinated by Chris  |
| Post-deployment integration | Live API integration after deployment                                                                                                            | Deployment/API verification operator        |

The historical live CLS/LCP baseline and historical artifact containment remain
separate; no historical result is promoted to this head. See
`videos-historical-artifact-containment.md` for that unresolved record.

## Delivery and local validation

This documentation is the concrete PR inventory handoff. It was not posted as
a GitHub comment: authenticated GitHub tooling is unavailable, and this run is
restricted to workspace changes. Marcus/Studio must attach this record to draft
PR #79 and record the driver-accepted inventory after revalidation. The harness
will create a new head from this change; these observations apply only to the
subject above, not to that future head.

This is a documentation-only task. No executable behavior changed, so there is
no meaningful new automated behavior test, red/green cycle, or refactor. No red
run is claimed; the credential preflight failure is a setup result.

Local configured-check results are recorded below after execution.

- `npm ci --cache /work/repo/.npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed (cache subsequently moved inside `.git`).
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped.
- `npm run verify:videos`: exit 1 at the missing-credential preflight above;
  production build, browser and Lighthouse stages did not run.

No credentialed production build, populated browser run, or Lighthouse metric
is claimed. Release readiness remains **no** pending the setup, driver,
measurement, independent review, and integration gates above.
