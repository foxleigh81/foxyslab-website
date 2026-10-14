# Round 15 verification evidence

Checked on 2026-10-14 against draft PR #79 head
`c98a264dbb930e654922410c7d0db7d2f2b1cf8a`. The GitHub PR API and local
checkout both reported that SHA.

## Exact-head deployment and failure evidence

- GitHub deployments API returned Preview deployment `7068845100` for that SHA.
- Its latest status was success, timestamp `2026-10-14T14:55:05Z`, with
  environment URL `https://foxyslab-website-o3cbhkmaf-foxleighco.vercel.app`.
- An HTTP HEAD request to that URL's `/videos` returned 302 to
  `https://vercel.com/sso-api`. No populated page or performance was verified.
- Downloading job `115922805146` logs and run `38584517458` logs returned 403
  (repository admin access required). Artifact `11907030891` download returned
  401. The supplied failure tail omits the actual navigation error messages.
- The reported 18 CI failures remain undiagnosed. Do not attribute them to
  missing credentials, media requests, or navigation readiness without the
  complete log or a matching reproduction. The existing CI E2E job supplies
  `FLAGS_SECRET`; this sandbox does not.

## Configuration change

`.github/workflows/videos-verification.yml` adds the requested alternative to
the protected Preview: a same-repository PR job that checks out the exact PR
head and uses repository secrets only in the verification step. It runs the
existing credential-checking production build, populated browser checks, and
three mobile Lighthouse measurements. It retains reports and publishes their
artifact link and available CLS/LCP measurements in the job summary. Fork PRs
do not run this credentialed job. No credential values are included.

This job has not run: the sandbox must not commit or push its working tree,
and the new workflow is not on GitHub yet. Its results cannot verify the
previous head retroactively. This change does not fix or replace the failing
general E2E job. Once the harness publishes it, inspect both jobs and retain
the actual reports before declaring T4 complete. Each measured CLS must be
below 0.1; inspect the thumbnail priority hint in the browser evidence too.

## Commands and observed results

- `npm ci`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 297 tests passed, one skipped.
- `npm run test:e2e -- --workers=1 --max-failures=1`: exit 1; web server
  readiness timed out after 60 seconds with `flags: Missing FLAGS_SECRET`
  from the root layout. Browser tests did not run.
- `npm run build`: exit 1; compilation succeeded, prerendering failed with
  `flags: Missing FLAGS_SECRET`. This was not a credentialed production build.
- `npm run verify:videos`: exit 1 at credential preflight; missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
- `npx playwright install chromium webkit`: produced no completion output;
  terminated after waiting approximately two minutes. Browser installation
  was not established.
- Parsed the new workflow with the installed `js-yaml` package: success.
- `npx prettier --check .github/workflows/videos-verification.yml`: exit 0.

Only workflow configuration and this evidence record changed. There is no
application behavior change for a red-green-refactor test. No historical red
run or green browser result is claimed. The workflow's meaningful integration
check requires GitHub Actions with repository secrets and remains outstanding.
