# T4 task 2: private verification controls

Revision round 2, inspected 2026-10-20. Credential release remains **blocked**.
This is an implementer evidence record for the lead, not Marcus's approved
inventory or Macklin's independent assessment. Neither owner receipt was
available in the supplied feedback or inspected controls records.

## Inspected subject

Local HEAD and a fresh anonymous GitHub `GET /repos/foxleigh81/foxyslab-website/pulls/79`
both identify `c85bcc3da07e73258c09fb7dc04fdcc4cf7a06f7`; the PR is open and
draft. The initial working tree was clean on the requested branch. This record
does not approve the subsequent harness commit.

The workflows, verifier and YouTube client have no diff between this head and
`2a7a7108bddd75db4ac19dd7628e9431322a2bd3`. The previous
[artifact reconciliation](videos-pr79-artifact-reconciliation.md) therefore
still describes their source behavior. Its artifact metadata is historical;
this revision did not inspect archives or establish their current disposition.

## Operations inventory awaiting Marcus's receipt

| Required control | Evidence and specific missing control |
| --- | --- |
| Approved populated saved-data source | The YouTube client fetches live API data with cache revalidation. Existing synthetic test fixtures do not establish an approved saved dataset. Missing: owner-approved source identifier, capture time, immutable digest, counts, playlist/pagination coverage and production build ingestion route. |
| Private exact-head build/browser route | Fresh `GET /contents/.github/workflows?ref=main` returned 200 and only `ci.yml`. The branch-local candidate requires dispatch on `main`, so that candidate is not an established premerge entry point. Missing: accessible private controller, immutable controller revision, permitted caller, exact reviewed PR SHA and evidence of private browser access. |
| Credential-release boundary | Candidate YAML selects `videos-verification` and checks the live head, but data secrets enter the step environment before its shell checks. Fresh `GET /environments/videos-verification` returned 404. Missing: effective independent approval before release, reviewer/self-review/bypass/ref restrictions, equivalent credential consumers and changed-head invalidation evidence. HTTP 404 does not prove that protections are absent. |
| Artifact classification and retention | Candidate uploads only measurement summaries with requested 14-day retention; ordinary CI still uploads raw Playwright directories. The ordinary Lighthouse configuration also names temporary public storage. Fresh `GET /actions/permissions/artifact-and-log-retention` returned 401. Missing: approved classification, effective readership/expiry for artifacts, logs and job summaries, scratch/build-cache destruction including failure/cancellation, and historical artifact disposition receipts. HTTP 401 establishes only this reader's access limit. |

No credential values or raw reports were requested. Source configuration and
successful general CI cannot substitute for effective-control evidence.

## Independent assessment and release gate

Macklin's assessment is **not obtained**. The specific failed prerequisite is
the absence of a recorded independent decision binding the approved data,
effective credential/artifact controls, immutable controller and exact PR head.
This is a missing-evidence block, not an attributed rejection by Macklin.

The lead must obtain Marcus's inventory receipt with references for each row,
then Macklin's independent receipt identifying either a permitted route or a
specific failed control. Both receipts must name their immutable subjects;
changes to those subjects require reassessment before credential release.
No supported operations-owner contact or approval interface is exposed in this
session. No external message or accepted handoff is claimed.

| Task acceptance criterion | Result |
| --- | --- |
| Marcus's recorded inventory identifies all required controls | Blocked: owner-approved inventory not obtained; gaps enumerated above. |
| Macklin independently permits a route or identifies its failed control | Blocked: independent receipt not obtained. This implementer's assessment cannot replace it. |
| No credentialed PR run starts while blocked | Observed for this revision: no workflow dispatch, credentialed build or browser/Lighthouse run initiated. This does not assert repository-wide enforcement or the absence of other actors' runs. |

## Validation boundary

Documentation only: no executable behavior changed, so no meaningful automated
red/green/refactor test applies and no red run or refactor is claimed.

Fresh configured local checks:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with npm configuration/deprecation/install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, 1 skipped;
  Vite emitted a configuration compatibility warning.

Populated build/browser/Lighthouse results and post-deployment API verification
against a named Production revision remain outstanding. No new production
measurement report links exist. Release readiness remains **no**.
