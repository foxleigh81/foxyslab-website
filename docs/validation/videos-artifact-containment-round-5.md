# PR #79 artifact containment, revision round 5

Observed 2026-10-21. Public GitHub REST reads confirm open draft PR #79 at
`575f92cb1253b715fb8343309abde464ab173b92`, matching the clean starting checkout.
This record supersedes the earlier artifact reconciliation for this head;
it does not verify the later harness commit.

## Observed retention and cause

`GET /repos/foxleigh81/foxyslab-website/contents/.github/workflows/ci.yml?ref=575f92cb1253b715fb8343309abde464ab173b92`
returned source byte-for-byte equal to the starting local workflow. Its E2E job
uploads `playwright-report/` and `test-results/` with `always()` and 14-day
retention. The populated workflow separately selects only numeric summaries.

The head-filtered runs endpoint returned successful CI run
[39516832288](https://github.com/foxleigh81/foxyslab-website/actions/runs/39516832288).
Its artifacts endpoint returned exactly one artifact:

| Field | Observed value |
| --- | --- |
| ID / name | `12308356111` / `playwright-report` |
| Source head | `575f92cb1253b715fb8343309abde464ab173b92` |
| Size | 255238 bytes |
| Created | `2026-10-20T23:47:18Z` |
| Expires | `2026-11-03T23:47:17Z` |
| Expired | `false` |
| Digest | `sha256:7c7f5f4ff09680e8c537680b8f0dda4f261e361be2bdddb025ad48988929095a` |

The archive endpoint returned HTTP 401 without authentication. No archive
contents were obtained, and metadata does not establish whether sensitive data
is present. No deletion or historical containment is claimed.

`git log -- .github/workflows/ci.yml` and the relevant diffs show that
`22da08e738d6ff985a9e95a8c29fca890799117c` removed only the coverage upload.
The preceding change `79cb880a44c382044bb97876d7043b36be8af71e` changed credential
references, not report uploads. Thus the available history supports a scope gap:
coverage removal and summary-only populated uploads did not remove ordinary
Playwright uploads. It does not establish that an earlier Playwright removal
was reverted or that an unavailable reported repair reached this branch.

## Containment change and remaining owner work

This revision removes the ordinary CI Playwright upload, retaining the E2E
command and its job result. The regression checks both E2E and coverage jobs
continue running without artifact uploads. Existing populated summary controls
and workflow security checks remain in place. This prevents that future upload
once the revised workflow runs; it cannot remove already retained artifacts.

Marcus's authorized Actions operator still needs to privately classify artifact
`12308356111`, resolve the historical inventory, and remove unsafe retained
content if found. No messaging/operations interface is available in this session;
this is a local handoff, not evidence of coordination or accepted ownership.
The ordinary Lighthouse artifact/public-storage route remains as previously
recorded and is not covered by this Playwright containment change. Independent
exact-head controls review remains necessary before any credentialed run.

## Premerge boundary

Inspection of both workflows, package scripts and `scripts/lib/verify-videos.mjs`
finds no post-deployment live API dispatch or dependency on its result. The
verifier starts a loopback production server; its build data access is distinct
from a deployed Production observation. No live API gate was added here.

Only historical documentation matches tracked driver/scheduler/dispatch paths;
the Studio task graph is not implemented in this repository. Its external
initial/retry dispatch exclusion cannot be changed or verified here. Chris's
routing work must keep the live API observation outside premerge dispatch and
PR-head gating. That separate observation requires a named Production revision
after deployment; its pending result is not a premerge blocker.

## Local validation

- Install: `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`.
  Exit 0, 987 packages installed; npm configuration, deprecation and install-script
  warnings were emitted.
- Red: `npm test -- lib/__tests__/videos-artifact-retention.test.ts` exited 1:
  the new assertion received the existing raw Playwright upload instead of an
  empty list (one failed, three passed). An earlier invocation exited 127 because
  dependencies were not yet installed; that is not the behavioral red run.
- Green: `npm test -- lib/__tests__/videos-artifact-retention.test.ts lib/__tests__/videos-workflow-security.test.ts`
  exited 0, eight tests passed after removing the upload.
- Refactor: combined duplicate coverage/E2E assertions into a parameterized test;
  reran the same green command, exit 0, eight tests passed.
- Configured checks: `npm run lint` and `npm run type-check` exited 0;
  `npm test` exited 0 with 38 files passed, 346 tests passed and one skipped.
  Vitest emitted its existing configuration-loader warning.

Populated production build/browser measurements and three mobile CLS/LCP pairs
were not run in this containment revision. Saved-data provenance, the approved
private execution route, historical containment and independent controls review
remain unresolved. General CI success does not establish populated acceptance.
No later PR head or release readiness is verified.
