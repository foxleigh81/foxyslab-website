# Credential boundary inspection, revision round 14

Inspected on 2026-10-19 at local HEAD
`7ecb576bf5ef710052b41d743862fc2807d318e3`, on the requested branch.
The worktree was initially clean. A fresh public GitHub REST response reports
the same head for draft PR #79, targeting `main`. This reconciles the checkout
with the observed PR head; it does not establish the reported historical
retention repair or authorize credential release.

## Fresh metadata observations

Requests used no authorization header. Endpoints are relative to
`https://api.github.com/repos/foxleigh81/foxyslab-website/`. Only selected
metadata was printed; no artifact archive, raw log, or secret value was read.

| Endpoint | Result |
| --- | --- |
| `pulls/79` | 200; head above; draft; base `main` |
| `pulls/79/reviews` | 200; empty list |
| `environments/videos-verification` | 404 |
| `actions/secrets` | 401 |
| `environments/videos-verification/secrets` | 401 |
| `actions/organization-secrets` | 401 |
| `contents/.github/workflows/videos-verification.yml?ref=main` | 404 |
| Same contents endpoint at the observed head | 200; decoded bytes match local workflow |
| `actions/artifacts/12216535219` | 200; `expired: false` |
| `commits/ca4719236f205ee33b35da575de5deff7c08ba00` | 422 |
| Comparison of that repair commit with the observed head | 404 |

The workflow's decoded SHA-256 is
`7659c3440ab0593c9219cd32de987327963f79887c88aea47d97d0a36b6a5344`.
The inaccessible endpoints do not prove that an environment, secret, workflow,
or repair is absent. They leave the protection configuration, equivalent
repository/organization credentials, trusted dispatch path, and repair ancestry
unestablished. Empty PR reviews do not establish environment approval status.
Artifact metadata does not classify its contents or establish containment.

## Source boundary and populated verification path

The manual workflow runs only from `main`, selects `videos-verification`, checks
the requested SHA against the live PR before checkout, disables persisted
checkout credentials, and checks checkout/live head again before verification.
It references the three dedicated `VIDEOS_VERIFY_*` secrets. Independent
approval of that exact SHA must be enforced by the environment before any
PR-controlled code or dependency installation runs. Head equality alone is
not approval. Required reviewers, prevention of self-review, bypass policy,
branch restrictions, and equivalent secret exposure remain owner checks.

The credentialed shell receives data credentials and a read-only GitHub token.
It unsets `GH_TOKEN` before Node/npm and removes data credentials from the
Chromium-path lookup. The verifier passes selected application credentials to
the production build and server, synthetic credentials to state-fixture tests,
and no data credentials to Playwright/Lighthouse or its git lookup. Child output
is suppressed. Browser/measurement cleanup removes raw reports, and the workflow
uploads only minimized `summary.json` files. Existing regressions exercise these
boundaries and synthetic sensitive-content retention. These controls do not
isolate malicious approved code or prove the historical artifact safe.

General CI has no explicit data-secret references, permits missing API keys for
its build, and uploads coverage and ordinary browser/Lighthouse outputs. A green
general CI run cannot establish populated credentialed measurements, and the
credentialed workflow's upload restriction does not remove historical artifacts.

`npm run verify:videos` exited 1 at credential preflight, naming only
`YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` as missing.
No build, browser, Lighthouse measurement, or new verifier report was produced.
Presence-only inspection also found no `GH_TOKEN` or `GITHUB_TOKEN`, and `gh`
is unavailable. No credentials were copied into this sandbox. Its permitted
network destinations also exclude the production data/image APIs, so supplying
values alone would not make this a production-equivalent runner.

## Required external evidence

An authorized operator must privately classify artifact `12216535219`, record
only the matched file/field and classification, confirm removal of unsafe
content, and coordinate rotation if a real credential was exposed. This run
does not establish removal, rotation, or the reported repair's ancestry.

An authorized owner must establish an available trusted dispatch revision,
independent exact-head approval, environment protection settings, and restrictions
on equivalent credentials. Then a runner with valid credentials and access to
the production APIs/image origins can execute the existing populated build and
browser path. Retain only minimized evidence tied to the resulting reviewed
head. Populated hydration/footer and interaction observations, first-thumbnail
priority, three mobile CLS/LCP pairs, independent reviews, and post-deployment
live API integration remain outstanding. No LCP improvement is claimed.

## Local validation

This revision records evidence only; no executable behavior changed and no new
behavior defect was demonstrated. There is no meaningful red/green/refactor
cycle for this documentation change, and no red run is claimed.

- `npm ci --cache /work/repo/.lighthouseci/npm-cache --no-audit --no-fund`: exit 0;
  dependency deprecation and install-script warnings; lockfile unchanged.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 344 tests passed, one skipped, including
  the existing workflow-boundary and minimized-retention regressions.
- `npm run verify:videos`: exit 1 at missing-credential preflight, as detailed above.
- `git diff --check`: exit 0.

The harness-created documentation commit will have a new SHA. These local
observations do not verify that future head or satisfy release verification.
