# T4 revision 14: verifier failure cleanup

The verifier now removes raw files from its run report directory when the
build or production-server startup fails. Previously both stages ran before
the cleanup `try/finally`, so their failures bypassed report cleanup. The
existing sanitized summary remains available. Cleanup still runs if stopping
an acquired server fails; no stop is attempted when startup never returned one.

## Observed local checks

- Install: `npm ci --no-audit --no-fund` exited 0 (dependency deprecation and
  npm configuration warnings).
- Red: `npm test -- lib/__tests__/verify-videos.test.ts -t 'removes raw output when'`
  exited 1. Both build and startup cases retained `raw-output.json` alongside
  `summary.json`, violating the expected summary-only directory.
- Green: the same focused command exited 0, with both cases passing after
  moving build/startup into the cleanup boundary.
- Refactor: extracted the repeated report-directory lookup in the new test.
  `npm test -- lib/__tests__/verify-videos.test.ts` then exited 0: 32 tests passed.
- `npm run lint` and `npm run type-check` exited 0.
- `npm test` exited 0: 38 files passed, 348 tests passed, 1 skipped.
- `git diff --check` passed.

All payload markers and credentials in these tests are synthetic. Build,
server and browser subprocesses are replaced at the verifier's existing test
seams; these results are not a private production dry run.

## Remaining work

Saved-data ingestion and exact-head/source/controller/CI/Preview binding remain
unimplemented. The supplied handoff provides no approved immutable source,
source format/access contract, private controller invocation, routing receipt,
or independent boundary approval. This change establishes only the tested
report-directory cleanup behavior, not private retention of `.next`, runner
storage, or cleanup after cancellation/runner loss.

The independently owned controller must establish those controls and Macklin's
review before releasing private data or credentials to PR code. An approved
source must then be wired into build and runtime and exercised by the private
dry run, including counts, pagination and mismatch rejection. Production build,
browser measurements, three mobile Lighthouse CLS/LCP pairs and authorized
post-deployment API observations remain unverified here. No workflow, credential
release control, deployment, branch or commit was changed by this revision.

Release readiness: no.
