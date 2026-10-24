# Task 2, round 17: PR #79 head and retention repair

On 2026-10-19, the public GitHub PR API reported draft PR #79 open at
`cc39177d224894782104201641b108ad2cc8f656` on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The local checkout
matches that SHA and has `6dd0e4899792831e26702ae8b54164d78e5d910d`
as an ancestor. Thus the earlier `6dd0e48` observation is stale.

The completed run `r20261019-4e00ef8b3bf4` reported commit
`9eaae76fdda6d9b78aa0da6f93946de8cb8372cc`. That object is absent from
the local repository, and GitHub's public commit endpoint reports "No commit
found for SHA". Its exact diff cannot be reviewed or claimed as merged.
The live branch's `.github/workflows/ci.yml` still runs `npm run test:coverage`
and then uploads all of `coverage/` as a 14-day artifact. That is concrete
evidence that the source-bearing coverage retention repair is absent from the
live branch, regardless of the inaccessible run commit.

This working-tree change removes the coverage upload from general CI. Coverage
still runs; its full source-bearing output is no longer retained by that job.
The populated videos workflow's numeric-summary-only artifact path is
unchanged. A focused test now guards the general CI retention behavior.
The harness must commit this working tree on PR #79 before the repair is on the
live branch. No verification is claimed for that future exact head.

This change prevents future general-CI coverage uploads. It does not classify,
delete, or remediate historical artifacts `12218763710` and `12216535219`.
Both remain an authorized Actions operator dependency described in
`videos-historical-artifact-containment.md`. Populated browser and Lighthouse
verification must wait for containment and a reconciled post-commit head.

## Local test sequence

- Initial `npm test -- lib/__tests__/videos-artifact-retention.test.ts` could
  not run because dependencies were absent (`vitest: not found`); it is not a
  red result. `npm ci --no-audit --no-fund` then passed.
- Red: the same focused test exited 1. Its new assertion found one
  `actions/upload-artifact@v4` step with `path: coverage/` in the quality job.
- Green: after removing that step, the same focused test passed all three tests.
- Refactor: formatted the test with Prettier. The focused rerun passed all
  three tests again.
- Configured local checks: `npm run lint` and `npm run type-check` each exited
  0. `npm test` exited 0 with 38 files passed, 345 tests passed, and one
  skipped. `git diff --check` exited 0.

These checks exercise the working tree, not the harness's later PR commit.
No credentialed build, browser run, or Lighthouse measurement was attempted
while containment and the post-commit head remain unresolved.
