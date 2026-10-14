# Round 24: credentialed verification diagnosis

Checked on 2026-10-14. The checkout and PR #79 head are both
`55371c383958f267467e5ea6ae3661bbe28aba14`.

## Earlier failed job

GitHub's jobs API places the failure in the `Build, check populated gallery,
and measure three mobile runs` step of [job 116012139925](https://github.com/foxleigh81/foxyslab-website/actions/runs/38610455771/job/116012139925),
on older head `1945660724d736605b0d241233f3ebbcc8cb301e`. Installation and
Chromium setup passed. The step's known parent command is `npm run
verify:videos`; it runs a credentialed build, a populated Playwright smoke
check, then three mobile Lighthouse commands in sequence.

The job and run log endpoints return HTTP 403 without repository Actions log
access. The unexpired retained artifact `11918490047` returns HTTP 401 at its
ZIP endpoint. The public check output has no summary. Therefore the failing
_child_ command and cause cannot be read from the available evidence. It is
not possible to classify this older failure as verification tooling or
application behavior. A local missing-credential preflight is not evidence
of that job's cause.

## Exact-head results available

[Run 38626028673](https://github.com/foxleigh81/foxyslab-website/actions/runs/38626028673)
is on the exact reviewed head. Its jobs API reports success for the combined
credentialed build, populated browser check, three mobile runs, report upload,
and report linking. Its unexpired artifact is `11923613640`; its ZIP endpoint
returns HTTP 401, and the job log endpoint returns HTTP 403. These statuses
establish that the commands completed, but do not disclose the browser
assertions, first-thumbnail priority hint, or the three CLS/LCP pairs.

The deployments API identifies successful Preview deployment `7075502825`
for this head at
`https://foxyslab-website-bxh8omxp8-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returns HTTP 302 to Vercel SSO,
so it is not an accessible populated page for browser or Lighthouse checks.
The ticket's original three CLS values were 0.511, with LCP at 3.8, 4.3,
and 11.8 seconds. No new CLS or LCP value is claimed.

## Next verification step

An operator with Actions access must inspect the credential-redacted full log
for job `116012139925` and its retained browser report. Record the actual
failing child command and error, then route an application/build failure to
the relevant code task or a runner/setup failure to verification tooling.
Separately, inspect exact-head artifact `11923613640` for the populated
desktop/mobile footer, direct playlist URL, and search assertions; inspect
the emitted first-thumbnail priority hint and all three mobile CLS/LCP pairs.
The current production smoke test does not exercise playlist selection or
pagination controls, so a further populated browser check must do so. Confirm
each CLS is below 0.1. Keep credential values out of published notes and
artifacts.

This is an evidence-only revision. No application or verification behavior
was changed, so there is no meaningful new automated behavior test or
red-green-refactor cycle. The existing initial-layout and control tests remain
in place; a passing parent job does not substitute for its detailed report.

## Local checks

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 302 passed, one skipped.
- `FLAGS_SECRET=<ephemeral> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. The local server lacked YouTube data, so
  this does not establish populated browser behavior.
- `ALLOW_MISSING_API_KEYS=true FLAGS_SECRET=<ephemeral> npm run build`: exit 0.
  This is a compilation check with missing-data bypass, not a credentialed
  production-equivalent build.
- `npm run verify:videos`: exit 1 at local credential preflight; the missing
  variables are `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and
  `FLAGS_SECRET`. No local populated browser or Lighthouse run started.
