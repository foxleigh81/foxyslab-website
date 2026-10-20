# Task 2, revision round 9: verification route blocked

Recorded 2026-10-20 for ticket #71 and draft PR #79. The inspected local
commit is `ec5a8c05140cfeba0000c02d71d98e8f7b5eae86` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`, matching the previous
checked head supplied in the brief. This documentation change will produce a
new harness commit; neither that future SHA nor the live PR head is verified
here. The supplied current-head failure evidence is empty (`[]`). Historical
reports and successful general CI do not establish current populated results.

## Available surface and decision

This session exposes local shell/file tools, but no authorized Studio operations
interface, protected-environment administration interface, independent clearance
receipt, or driver hold operation. No external settings were inspected or
changed, no workflow was dispatched, and no credential was requested, retrieved,
or released. Macklin's credential block remains in force.

The specific unsupported capability **in this session** is authenticated,
independently reviewable establishment of the effective verification boundary:
trusted execution revision, exact-head approval, secret scope and release gate,
approved populated data, and reviewer/artifact access. This does not establish
that Studio or GitHub lacks those capabilities. The operations prerequisite
remains blocked; a website document cannot apply an external scheduler hold.
The separate driver repair and observable scheduler tests remain as recorded in
[the round-8 boundary record](videos-dispatch-boundary-round-8.md).

## Inspected candidate route and missing controls

These are local source observations, not effective remote configuration evidence.

| Boundary | Existing candidate | Required observable unblock evidence |
| --- | --- | --- |
| Execution identity | `.github/workflows/videos-verification.yml` permits dispatch on `main`, checks the supplied SHA against PR metadata before checkout and again before verification, and disables persisted checkout credentials. | An authorized operator identifies the available trusted workflow revision, revalidates the live PR head and records independent approval of that exact head. A changed head requires new clearance; SHA equality alone is not approval. |
| Credential release | The job names environment `videos-verification` and three `VIDEOS_VERIFY_*` secrets. It unsets `GH_TOKEN` before PR Node/npm execution. | Inspectable required-reviewer, self-review prevention, bypass and branch restrictions; inventory of equivalent repository/organization secrets and other credential routes; explicit independent security clearance lifting the block for this SHA. Secret values must not appear in the record. |
| Effective isolation | Build/server processes receive YouTube, Fourthwall and flags credentials. Browser/Lighthouse children receive a reduced environment. Installation and credentialed execution share a runner. | Independent review covers PR source, dependencies, install hooks, workflow/actions and persistent runner effects before secrets enter the job. Child environment filtering does not isolate secrets from PR build/server code or establish safe artifact contents. |
| Populated data | `app/videos/page.tsx` requests up to 200 videos, playlists and membership via `lib/youtube.ts`. `verify:videos` builds with missing-key bypass disabled, starts the production server and runs populated browser checks plus three mobile Lighthouse runs. | Operations supplies an approved saved-data source/snapshot identity, provenance, representative counts, playlist membership and thumbnail availability, plus a valid scoped credential through the approved gate. Include enough videos for pagination and matching playlists/search results. Record whether data is live or replayed and how representative network/image behavior is preserved. No approved saved snapshot or delivery route is established here. |
| Network | This sandbox is limited to GitHub and npm/PyPI registries. | An authorized verification runner with approved API and thumbnail access, or an approved production-equivalent replay route. This sandbox cannot perform live YouTube/Fourthwall verification. |
| Reviewer access | The workflow links SHA-named numeric summaries in the job output. | Named independent reviewers can inspect the exact-head approval/configuration receipts, build/browser results and three measurements using authorized access; access must be demonstrated, not inferred from a link or badge. |
| Artifacts | The workflow uploads only `run-*/summary.json`, with 14-day retention, and prints summaries in the job output; raw reports are not uploaded by this workflow. | Review effective artifact/log audiences, retention/deletion controls and actual content before publication. PR code can write summary files. Confirm no credentials, private data or sensitive URLs in artifacts or logs, and resolve historical containment separately. A filename allowlist is not a security clearance. |

The unblock condition is an authorized operations record containing those
receipts, the final PR SHA, dataset identity and independent clearance, together
with a demonstrated driver exclusion while prerequisites remain unmet. No
operator assignment, approval or applied hold is claimed by this document.

## Retained verification work

After clearance, bind each result and accessible report link to the verified
commit: initial populated cards/reserved space and hydration/footer stability;
three mobile CLS values below 0.1 with paired LCP and first-thumbnail priority;
search, playlist filtering, pagination and direct playlist URLs; empty/error
states with fixture results distinguished from populated observations; focused
regression, lint, type-check, unit/E2E and valid-credential production build.
Record each criterion as observed, failed or blocked. Do not infer LCP gains.
The authorized post-deployment viewer must separately record the deployed
revision and live API-backed loading/gallery interactions. None of these
populated or deployed observations is supplied by this local assessment.

## Local validation

Documentation only; no executable behavior changed. There is no meaningful
automated behavior test for granting external authority or proving remote
settings. No red run, production fix, refactor or green refactor rerun is claimed.
Local configured checks all exited 0; they do not clear the credential block
or verify the future harness commit:

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: installed 987 packages.
- `npm run lint`.
- `npm run type-check`.
- `npm test`: 38 files passed; 345 tests passed, 1 skipped.

Production build, populated browser and Lighthouse execution were not attempted:
the authorized credential/data/network route is unresolved. No application,
workflow, dependency or driver code was changed.
