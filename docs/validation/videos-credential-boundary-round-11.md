# Credential boundary inspection, revision round 11

Inspected on 2026-10-19 at local HEAD
`23e8ed844436dc13461aa4024c2433e62f975f05`. A fresh GitHub REST response
identifies the same head for draft PR #79, targeting `main`. This is a
documentation-only inspection: no newly demonstrated bypass warrants a code
change. The credential boundary remains unverified because the necessary live
configuration is inaccessible. This report does not authorize credential release.

## Exact-head and live configuration evidence

Read-only requests used `https://api.github.com/` with no authorization header.
Repository endpoints below are relative to
`repos/foxleigh81/foxyslab-website/`. Only selected metadata was printed; no
secret-value endpoint was requested.

| Endpoint | Observed result |
| --- | --- |
| `pulls/79` | 200; draft; head as recorded above; base `main` |
| `pulls/79/reviews` | 200; empty list |
| `environments/videos-verification` | 404 |
| `actions/secrets` | 401 |
| `environments/videos-verification/secrets` | 401 |
| `actions/organization-secrets` | 401 |
| `contents/.github/workflows/videos-verification.yml?ref=main` | 404 |
| Same workflow contents endpoint with `ref=23e8ed844436dc13461aa4024c2433e62f975f05` | 200; decoded bytes match local workflow |

The exact-head workflow blob is
`8d5a542099e43b581af383b9c0f0236b6a57158b`; decoded SHA-256 is
`7659c3440ab0593c9219cd32de987327963f79887c88aea47d97d0a36b6a5344`.
The 404 responses do not prove absence of a protected environment or workflow.
Required reviewers, prevention of self-review, administrator bypass policy,
deployment branch restrictions, and an available trusted dispatch revision
cannot be established from these responses. Empty PR reviews do not establish
whether environment approval exists.

## Workflow and equivalent credential paths

`.github/workflows/videos-verification.yml` permits manual dispatch on `main`
only and selects `videos-verification`. Before checkout it compares the live
PR head to `expected_sha`; before verification it checks both the checkout and
live PR head again. Equality checks do not establish independent approval of
the supplied SHA. The environment gate must enforce that approval before the
job starts, including installation of PR dependencies on the same runner.

The credentialed step maps these three secret references:

| GitHub secret name | Process variable |
| --- | --- |
| `VIDEOS_VERIFY_YOUTUBE_API_KEY` | `YOUTUBE_API_KEY` |
| `VIDEOS_VERIFY_FOURTHWALL_STOREFRONT_TOKEN` | `FOURTHWALL_STOREFRONT_TOKEN` |
| `VIDEOS_VERIFY_FLAGS_SECRET` | `FLAGS_SECRET` |

The workflow references do not identify the actual storage scope. Environment,
repository, and organization inventories were inaccessible, leaving same-name,
legacy-name, and equivalent-value credentials unresolved. Name inventories
alone would not establish value equivalence; an authorized owner must attest
to that without exporting values. General CI has no explicit data-secret
references and uses a synthetic flags value, with missing API keys allowed
for its build. Its success cannot establish credentialed verification.

Additional local producers are `docker-compose.yml`, which sources the three
legacy environment names for build secrets and `.env` for runtime, and
`Dockerfile`, which reads the corresponding BuildKit secret mounts into the
build process. These files show alternate consumption paths, not evidence
that a live deployment supplies credentials or has independent approval.
No `.env` or secret contents were inspected. External deployment integrations
and equivalent repository/organization secrets remain an owner inspection task.

## Action pins and child processes

Fresh upstream `repos/actions/<action>/git/commits/<sha>` requests returned
HTTP 200 and the exact requested SHA for all three credentialed action pins:

- checkout: `11d5960a326750d5838078e36cf38b85af677262`
- setup-node: `49933ea5288caeca8642d1e84afbd3f7d6820020`
- upload-artifact: `ea165f8d65b6e75b540449e92b4886f43607fa02`

This establishes resolution, not independent action-code approval. Checkout
disables persisted credentials. General CI uses mutable `@v4` action tags;
those jobs contain no explicit data-secret references.

The credentialed shell and its head-checking `git` and `gh` children inherit
the data credentials; `gh` also receives the read-only GitHub token. The shell
unsets `GH_TOKEN` before Node/npm. The Chromium-path subshell unsets all three
data credentials before requiring PR-installed Playwright. The npm verification
launcher and Node verifier still receive data credentials. In
`scripts/lib/verify-videos.mjs`, build and Next server children receive selected
application credentials; fixture children receive synthetic credentials;
Playwright, Lighthouse, and the verifier's git lookup exclude data credentials.
Build/server output is suppressed and artifact upload is limited to minimized
`summary.json` files. These controls reduce accidental exposure, but cannot
contain malicious approved code, dependency persistence, or arbitrary artifact
writes from PR code. Independent exact-head approval remains essential.

## Validation and handoff

No production code, workflow, or test changed, so there is no meaningful new
automated behavior test, red run, or refactor cycle to report. Existing tests
exercise synthetic process boundaries; they cannot validate GitHub environment
protection configuration.

Local checks executed directly in this round:

- `npm ci --cache /work/repo/.lighthouseci/npm-cache`: exit 0; npm reported
  39 dependency vulnerabilities (2 low, 10 moderate, 25 high, 2 critical).
  Dependencies were not changed.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 test files passed, 344 tests passed, 1 skipped,
  including the workflow-security and verification-process regression suites.
- `git diff --check`: exit 0.

No production build, browser, or Lighthouse run was repeated for this
documentation-only inspection. The configured local checks do not substitute
for the pending approved, credentialed verification.

The harness will create the resulting documentation commit; its future SHA
cannot be recorded before that happens. Bind the harness-created SHA to fresh
configuration evidence and Macklin's independent re-review. No workflow was
dispatched, settings changed, credentials fetched, or performance measurements
claimed. An authorized owner must establish the live approval configuration,
equivalent-secret restrictions, and trusted dispatch path before credentialed
build/browser verification and three mobile CLS/LCP runs on that exact head.
Ashley and Macklin's independent blocks and the remaining ticket verification
are not resolved by this inspection.
