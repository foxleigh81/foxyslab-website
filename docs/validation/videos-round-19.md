# Round 19: browser failure diagnostics

On 2026-10-14, both the checkout and GitHub PR #79 API identified head
`76fd133bd698a3874fd4deb69fa882bb9d31c3a3`.

The supplied log for job `116002435011`, run `38607617388`, shows credential
preflight and the production build completing before the browser smoke command
exits 1. All three credential variables are masked as present. Missing
`YOUTUBE_API_KEY` is therefore not the demonstrated cause of this failure.
The existing workflow forwards the repository secrets to the verifier, which
forwards them to the build, server and browser process.

The exact browser assertion remains unavailable: the job logs API returns
HTTP 403 and artifact `11916651546`'s ZIP endpoint returns HTTP 401.
The artifact is linked at
<https://github.com/foxleigh81/foxyslab-website/actions/runs/38607617388/artifacts/11916651546>.
No credential values were requested or copied into this sandbox.

The deployments API identifies Preview deployment `7072610565` for this head.
Its successful status supplies
`https://foxyslab-website-5xza2vj00-foxleighco.vercel.app` as environment_url.
An unauthenticated HEAD request to `/videos` returns HTTP 302 to Vercel SSO;
it is not a tested populated page.

## Change and regression evidence

The verifier previously discarded all browser failure details, even though
Playwright writes a JSON report. It now reads that report after browser failure
and reports numeric test declaration lines, allowlisted result statuses, and a
fixed diagnostic for the gallery's existing data-unavailable error. Other
failures point to the retained report; absent, malformed and setup-only reports
produce explicit diagnostics. Raw error messages, titles, filenames and
attachments are never copied to the diagnostic. The command still fails and
stops its production server before any Lighthouse run.

- Red: `npm test -- lib/__tests__/verify-videos.test.ts` exited 1, with
  six passing tests and one failure: the expected safe location/data diagnostic
  was absent from the generic browser failure message.
- Green: the same command exited 0 with seven passing tests after the fix.
- Refactor: extracted result formatting into `browserResultDiagnostic` and
  formatted both files; the same command exited 0 with seven passing tests.
- Added report-unavailable coverage and corrected TypeScript narrowing in the
  regression test; the same focused command exited 0 with ten passing tests.

## Remaining populated verification

Local configured checks:

- `npm ci`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0 after correcting the test's union narrowing.
- `npm test`: exit 0; 35 files, 302 passed and one skipped.
- `npm run test:e2e -- --workers=1 --max-failures=1`: exit 1; server readiness
  timed out after 60000 ms with `flags: Missing FLAGS_SECRET`. No browser
  assertions ran.

`npm run verify:videos` exits 1 at credential preflight, naming
`YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` as missing
locally. No empty-data build substitutes for the credentialed check.
The existing same-repository Actions job must run the changed verifier with
its repository secrets. A reviewer with artifact access can inspect the
original browser assertion now; the changed script provides safe diagnostic
context on the next failure. This revision does not establish that the
underlying populated browser failure is fixed and records no CLS/LCP results.
