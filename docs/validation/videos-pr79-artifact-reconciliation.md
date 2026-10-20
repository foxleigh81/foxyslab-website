# PR #79 artifact reconciliation, 2026-10-20

## Subject and evidence boundary

Fresh unauthenticated GitHub REST reads at approximately 23:15-23:17 UTC
confirm open draft PR #79 has head
`2a7a7108bddd75db4ac19dd7628e9431322a2bd3` and base
`eca93e0605ecf22f3eb8943a5fc84a37a65e11b1`. Local HEAD matches, on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`; the initial working
tree was clean. This record concerns that source revision, not the later
harness commit. Historical validation documents are not fresh observations.

The reported retention repair at
`958e232270fb34479c36068aaf8b55688a026381` is **unverifiable**:

- `git cat-file -t 958e232270fb34479c36068aaf8b55688a026381` exits 128
  (object unavailable). The checkout is not shallow. The chained ancestry
  check did not execute; no successful ancestry check is claimed.
- GitHub `GET /repos/foxleigh81/foxyslab-website/compare/958e232270fb34479c36068aaf8b55688a026381...2a7a7108bddd75db4ac19dd7628e9431322a2bd3`
  returns 404. This cannot establish the repair's contents or ancestry.
- The current workflow has a summary-only populated-verification upload,
  but ordinary CI still uploads raw Playwright directories. Similar behavior
  does not prove that a particular repair commit reached this head.

`GET /contents/{path}?ref=2a7a7108bddd75db4ac19dd7628e9431322a2bd3`
returned both workflow files byte-for-byte equal to the local versions:

| File | SHA-256 |
| --- | --- |
| `.github/workflows/ci.yml` | `aa9bee9abf0aa848f6df001d2ebe3a516a4dcd87ef9fed777da0e444893ca4eb` |
| `.github/workflows/videos-verification.yml` | `7659c3440ab0593c9219cd32de987327963f79887c88aea47d97d0a36b6a5344` |

## Upload and retention inventory

| Route at this head | Output / destination | Retention and limits |
| --- | --- | --- |
| CI E2E, `always()` upload | `playwright-report/` and `test-results/` to Actions artifact `playwright-report` | Requested 14 days. HTML reporter, first-retry traces, failure screenshots; raw contents can be retained. |
| CI build/Lighthouse, `always()` upload | `.lighthouseci/` to Actions artifact `lighthouse-results` | Requested 14 days; no explicit `include-hidden-files`. Actual upload of this hidden directory is not established by configuration. |
| Ordinary `lighthouserc.js` upload | `temporary-public-storage` | Separate public publishing path; GitHub's 14-day setting does not govern it. No current-head public report URL or expiry was established. |
| Populated verification, `always()` upload | `.lighthouseci/videos/run-*/summary.json` to `videos-verification-${expected_sha}`; hidden files included | Requested 14 days. Summary content and artifact URL also go into the job summary, whose retention/access is not established here. |
| Populated verifier local outputs | Browser JSON/artifacts, state fixtures, raw mobile HTML/JSON reports under the run directory | `discardRawReports` removes everything except summary in the server-run `finally` path. Abrupt termination is not proof of cleanup; historical uploads are unaffected. Production browser config disables traces/screenshots. |
| CI browser cache | `~/.cache/ms-playwright` via `actions/cache@v4` | Browser binaries, separate from report artifacts; no explicit retention configured. |

The populated workflow requires dispatch on `main`. Fresh
`GET /contents/.github/workflows?ref=main` lists only `ci.yml`. Its branch-local
definition therefore does not establish an available main dispatch route.
An environment name and exact-head checks in YAML do not prove independent
approval or effective secret-release controls.

`GET /actions/permissions/artifact-and-log-retention` returns 401. Repository
policy, log/job-summary access and retention remain unverified. No workflow,
settings, credential handling or upload behavior was changed in this audit.

## Already-retained artifacts

[Metadata snapshot](videos-artifact-inventory-2026-10-20.json) records all 197
unique artifacts returned across both repository-wide API pages (reported total
197): 92 `playwright-report`, 65 `coverage`, and 40 `videos-verification-*`.
All report `expired: false`. Each row preserves artifact ID, creation/expiry,
size, run ID, repository IDs and source head. Pagination is not an atomic
snapshot. Names and sizes do not establish archive contents or confidentiality.
No archive or raw log was downloaded or inspected.

The head-filtered runs endpoint returns one completed successful CI run:
[39507719057](https://github.com/foxleigh81/foxyslab-website/actions/runs/39507719057).
Its retained `playwright-report` artifact is `12303573840`, 267898 bytes,
created `2026-10-20T22:27:15Z`, expiring `2026-11-03T22:27:15Z`.
This is direct evidence of a retained report at the inspected head; CI success
does not establish populated video performance or safe archive contents.

The two artifacts previously flagged for private classification still appear:

| Artifact | Metadata name / run | Expiry | Containment result |
| --- | --- | --- | --- |
| `12218763710` | `coverage` / `39320260208` | `2026-11-02T20:34:13Z` | Not expired; classification and removal unconfirmed. |
| `12216535219` | `coverage` / `39310545381` | `2026-11-02T19:23:56Z` | Not expired; classification and removal unconfirmed. |

These are historical coverage artifacts, not current-head Playwright artifacts.
The fresh inventory does not confirm the historical sensitive-pattern claim or
prove real credential exposure. A future upload restriction cannot delete them.

## Owner and concrete blocker

Marcus is the designated operations owner for coordinating containment on draft
PR #79. An authorized Actions operator must privately classify retained archives,
identify any unsafe file/field without copying values, remove unsafe artifacts
and confirm their disposition. If real credentials are found, the credential
owner must confirm revocation/rotation. This sandbox has no authenticated
operations or messaging interface; `gh` is unavailable. No deletion, external
message or accepted owner handoff is claimed. The report is a local handoff for
the lead, not evidence of coordination completed outside this session.

Marcus must also establish effective report/log access and expiry, address the
ordinary public Lighthouse route and raw CI uploads as appropriate to their
classification, and provide the missing repair commit evidence. Macklin's
independent assessment of the exact-head credential boundary remains external
work. No upload-only revision was repeated and no credentials were released.

Task criterion 1 is recorded with an explicit unverifiable disposition.
Criterion 2 has a complete public artifact-metadata inventory and a named owner
with a concrete private-classification/containment blocker. Effective private
controls and containment have not been established.

## Local checks and remaining verification

This change contains documentation and public metadata only. There is no changed
executable behavior for a meaningful red/green/refactor test; no red run,
production fix or refactor is claimed.

Fresh local checks:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0,
  987 packages installed; npm configuration/deprecation/install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped.

Populated production build/browser/Lighthouse checks were not run for this audit. Approved saved-data
provenance, independent controls clearance, three mobile CLS/LCP measurements,
populated interactions and post-deployment API verification against a named
Production revision remain outstanding. This record verifies no later PR head.
