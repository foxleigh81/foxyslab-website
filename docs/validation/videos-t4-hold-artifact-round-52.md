# T4 task 1: hold and artifact investigation, revision 52

Inspected 2026-10-24. This is a repository receipt for draft PR #79, for the
lead to publish through the authorized PR route. No PR comment was posted:
this sandbox has no supplied authenticated GitHub write or Studio interface.
No website verification or second Studio operation was dispatched here.
An enforced external hold is **not established** by this document.

## Dispatch and head reconciliation

The initially clean assigned branch and anonymous GitHub
`GET /repos/foxleigh81/foxyslab-website/pulls/79` (HTTP 200) agree on
`fb82ee5cbe2ca65f2becc019a262e70ae11a65f4`. The PR is open and draft.
The local commit subject identifies revision 50, run
`r20261024-f7b0c80655b6`; it does not identify the requested generation-100
run `r20261024-fd19b1abe480`. `git log --all --oneline
--grep=r20261024-fd19b1abe480` returned no matches. Searches of the tracked
receipts, scripts and workflow files found no effective generation-100
dispatch or operation record. The supplied brief names that generation and
run, but supplies neither its commit nor an operation ID/state.

Chris's owning-workflow receipt is still required to bind effective dispatch
generation, run, operation ID/status and produced commit to the live head.
The matching local/live SHA does not establish that binding or a terminal
operation state. The existing generation-98 receipt is historical evidence,
not a reconciliation of generation 100. Revalidate the head after the harness
commit; the observations here do not verify that later revision.

## Ownership and hold limitation

| Component | Repository and maintainer evidence |
| --- | --- |
| Effective Studio driver | Actual repository and maintainer unknown. No ownership record or callable operation interface supplied or found in the inspected checkout. |
| Effective external artifact inspector | Actual repository and maintainer unknown. No ownership record, versioned inspector contract or callable inspector interface supplied or found. |
| Artifact producer | GitHub metadata identifies `foxleigh81/foxyslab-website`, `.github/workflows/ci.yml`. This identifies the producer repository, not either external component's owner. No maintainer assignment was established. |

Tracked ownership/driver/inspector/operation filename inspection found only
historical investigation documents. Anonymous root and `.github/CODEOWNERS`
requests returned HTTP 404; this does not prove external ownership records do
not exist. PR issue comments returned only the Vercel deployment comment,
not an ownership or operation receipt. The main workflow listing returned only
`ci.yml`. The branch-local populated verification workflow is main-only and
has no external scheduler hold operation; its presence cannot enforce a hold
on Studio. Draft status also does not establish such a hold.

No supported non-merge hold operation can be named from these observations.
This is an access/evidence limitation, not proof that no supported operation
exists. Chris/Marcus must obtain the effective workflow ownership records and
have the identified maintainer return an operation reference and persisted
held state for this ticket, including the disposition of any unresolved
operation. Keep verification undispatched until that receipt is validated.
No preliminary merge is proposed.

If the owner establishes that no supported hold exists or reproduces a gate
defect, the proposed repair route is a separately authorized intake in the
actual owning repository, after its identity and maintainer are established.
Limit that intake to the missing hold/admission enforcement: first demonstrate
a failing gate test for dispatch with an unresolved operation or missing hold,
then implement the smallest repair and demonstrate rejection plus authorized
resume behavior. Record authorization, owner, test results and applied control
revision. This is a pending route, not an accepted intake or reproduced defect;
no external code task was dispatched through the website ticket.

## Artifact receipt and contract boundary

Fresh anonymous artifact metadata request returned HTTP 200:

| Field | Observed value |
| --- | --- |
| Artifact ID / name | `12560961284` / `lighthouse-results` |
| Size / expired | 278 bytes / false |
| Created / expires | `2026-10-24T12:56:53Z` / `2026-11-07T12:56:52Z` |
| Archive digest | `sha256:f60490afda018ebc574c4ba04d3ad4abc936e779c2e4454e158a4215f1c9a18f` |
| Actions run / head | `40095787054` / `fb82ee5cbe2ca65f2becc019a262e70ae11a65f4` |

The [run metadata](https://github.com/foxleigh81/foxyslab-website/actions/runs/40095787054)
returned HTTP 200: `CI`, `.github/workflows/ci.yml`, event `pull_request`,
status `completed`, conclusion `success`. This Actions run is not a reconciled
Studio operation. Its success is not populated-data acceptance evidence.

At this local source head the CI producer calls
`scripts/ci-lighthouse-summary.mjs`, which reads `lhr-<digits>.json`, rejects
empty input, invalid JSON, runtime errors or nonfinite metrics, and writes
`.lighthouseci/ci/summary.json` with `{ "runs": [{ "cls": number,
"lcpMs": number }] }`. CI uploads that path as `lighthouse-results`.
This is distinct from `scripts/lib/verify-videos.mjs` and its populated
`videos-verification-*` artifact. Do not apply that different producer's
verification envelope to this artifact.

`GET /repos/foxleigh81/foxyslab-website/actions/artifacts/12560961284/zip`
returned HTTP 401 without credentials. No archive contents or actual summary
fields were observed. Metadata size and digest do not prove file presence or
numeric results; the archive digest is not an approved dataset digest.
The response is an anonymous inspection limitation, not a demonstrated
repository-permission refusal. The external inspector contract is unavailable.
Producer absence and inspector omission therefore remain **undetermined**.

The owning workflow must inspect this retained object, report its file manifest
and actual bounded summary fields, and compare those with the exact producer
revision and versioned inspector input/output contract. Missing file/fields in
the archive would establish producer-side absence; fields present in the archive
but missing from the inspector output would establish extraction omission.
Neither conclusion is supported yet. Preserve artifact/run/head attribution;
do not infer a populated dataset, build identity or `/videos` coverage from
these numeric field names. No raw private data or credential values were fetched.

## Validation and disposition

Documentation only: no executable behavior changed, so no meaningful automated
red/green/refactor behavior test applies. No red run or refactor is claimed.
Fresh configured local checks all exited 0:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: 987
  packages installed; configuration, deprecation and install-script warnings.
- `npm run lint`.
- `npm run type-check`.
- `npm test`: 39 files passed, 353 tests passed and 1 skipped; Vite emitted
  its configuration-loader compatibility warning.
- `git diff --check`.

These validate the local checkout only. No production build, browser or
Lighthouse verification was dispatched; no new measurement report exists.

Task acceptance remains incomplete: actual external owners, reconciled operation,
validated enforced hold and owning-workflow artifact inspection are outstanding.
No external defect or authorized repair intake is established. Approved saved
data/digest, private boundary and independent exact-head admission remain open,
as do populated build/browser results, three mobile CLS/LCP pairs, thumbnail
priority, interaction checks and the authorized post-deployment live API check.
Release readiness remains no.
