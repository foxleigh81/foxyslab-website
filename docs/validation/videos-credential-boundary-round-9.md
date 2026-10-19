# Credential boundary inspection, revision round 9

Inspected 2026-10-19. Local HEAD and live draft PR #79 both identify
`fdaa6969452d17cb5fb889cdc1c5f94552fc0330`. The live workflow contents API
returned blob `c990d1f29cd7fb103e14c7a901b7e8b749923f62`, matching the
pre-change local workflow. Its decoded SHA-256 is
`e0654bfca1357b9dc40a27ab6689b411a1207753f15b55a711f00558750ccdaa`.
This report covers an uncommitted repair on that head; the harness-created
commit requires fresh approval and verification. Historical heads and green
checks do not establish approval of this change.

## Live boundary evidence

Read-only requests to `https://api.github.com/repos/foxleigh81/foxyslab-website/`
returned:

| Endpoint | Result | What it establishes |
| --- | --- | --- |
| `pulls/79` | 200, draft, head above | Current subject |
| `pulls/79/reviews` | 200, empty array | No PR review evidence returned |
| `environments/videos-verification` | 404 | Environment protections cannot be inspected |
| `actions/secrets` | 401 | Repository secret-name inventory unavailable |
| `environments/videos-verification/secrets` | 401 | Environment secret-name inventory unavailable |
| `actions/organization-secrets` | 401 | Accessible organization secret-name inventory unavailable |
| `contents/.github/workflows/videos-verification.yml?ref=main` | 404 | Trusted default-branch dispatch path not demonstrated |
| Same contents endpoint at the exact head above | 200 | Workflow revision identified |

The YAML permits manual dispatch only on `main`, selects environment
`videos-verification`, and checks both checkout and live PR head against the
requested SHA. These checks establish equality, not independent approval.
Required reviewers, prevention of self-review, administrator bypass controls,
branch protection and approval of the precise dispatched SHA remain unverified.
An empty PR-review list does not prove absence of environment approval either.
No credentialed job was dispatched, no credentials were retrieved, and no
repository settings were modified.

## Secret paths and action inventory

The two local workflows contain exactly three explicit secret references:
`VIDEOS_VERIFY_YOUTUBE_API_KEY`, `VIDEOS_VERIFY_FOURTHWALL_STOREFRONT_TOKEN`,
and `VIDEOS_VERIFY_FLAGS_SECRET`, all on the credentialed verification step.
They become `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN` and `FLAGS_SECRET`.
The general CI workflow uses a public synthetic flags value and permits missing
API keys; it cannot prove populated production behavior.

Neither environment selection nor secret renaming excludes repository or
organization secrets with these names, legacy names, or equivalent values.
The inaccessible inventories leave those bypasses unresolved. The same applies
to additional external runners or deployment integrations: the local workflow
inventory cannot establish their credential policy. No secret values were read.

All credentialed-workflow action pins resolved through their upstream GitHub
Git commit endpoints (HTTP 200, exact SHA):

- `actions/checkout@11d5960a326750d5838078e36cf38b85af677262`
- `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020`
- `actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02`

This establishes resolution, not action-code approval. General CI still uses
mutable `@v4` references for checkout, setup-node, cache and upload-artifact;
it has no explicit data-secret references. Checkout in the credentialed workflow
disables credential persistence. Installation and browser setup precede the
credentialed step but run PR dependencies on the same runner, so persistence
from those processes is another reason independent exact-head approval is
required before starting this job.

## Child-process exposure and repair

The credentialed shell, its `git` and `gh` lookups, npm launcher, verification
Node process, build lifecycle scripts and production Next server inherit data
credentials. `gh` additionally receives the read-only GitHub token; the shell
unsets it before PR-controlled Node/npm. The verification module selects data
credentials for build/server children, supplies synthetic values to state
fixtures, and excludes data credentials from Playwright and Lighthouse children.
Build/server output is suppressed and only minimized summaries are uploaded.
These controls reduce accidental exposure; they do not contain malicious
approved code or prove dependency safety.

The Chromium-path lookup was an unnecessary credential-bearing Node child:
requiring PR-installed Playwright exposed all three data credentials. The
repair unsets them only inside that command-substitution subshell. The npm
verification launcher retains the credentials it needs and the resolved path.
This addresses a demonstrated child-exposure gap in the requested security
inspection; Macklin's independent verdict and the external approval/bypass
evidence remain outstanding.

## Local validation

- Red: `npm test -- lib/__tests__/videos-workflow-security.test.ts` exited 1:
  the matching-head case observed three synthetic credentials in Node instead
  of `unset`; the other three cases passed.
- Green: the same command exited 0 after the workflow change, 4 tests passed.
- Refactor: expanded shell fixtures for readability and added fail-fast checks
  that npm retains all three synthetic credentials and the Chromium path.
  The first refactor run exposed a test template-string escaping error; after
  correcting it, `npm test -- lib/__tests__/videos-workflow-security.test.ts
  lib/__tests__/verify-videos.test.ts` exited 0, 33 tests passed. This executes
  the YAML shell with synthetic command boundaries, including rejection of
  changed checkout/live heads; it does not execute a GitHub environment gate.
- `npm ci --cache /work/repo/.lighthouseci/npm-cache`, `npm run lint` and
  `npm run type-check` exited 0. npm reported 39 dependency vulnerabilities;
  this scoped repair does not change dependencies.
- `npm test` exited 0: 38 files passed, 343 tests passed and 1 skipped.
  `git diff --check` also passed.

Release remains blocked on inspectable independent exact-head approval,
equivalent-secret inventories and protections, and an approved dispatch path.
Then the resulting head needs a credentialed build, populated browser checks
and three mobile CLS/LCP measurements. No production performance or later-head
verification is claimed by this local repair.
