# Round 36: exact-head evidence access remains blocked

Investigated on 2026-10-15. Both local `git rev-parse HEAD` and GitHub's
`GET /repos/foxleigh81/foxyslab-website/pulls/79` identify the requested reviewed
commit, `93f57992a7deaa19e92d4b6fbf9f626e2a053cd2`.

## Existing credentialed verification

[Run 38695140846, job 116289840724](https://github.com/foxleigh81/foxyslab-website/actions/runs/38695140846/job/116289840724)
reports success for that exact commit. Its combined production build, populated
browser check, and three mobile measurements step ran from 06:54:08 to 06:56:25
UTC. Report upload and linking also report success.

The existing same-repository workflow passes `YOUTUBE_API_KEY`,
`FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` from repository secrets to
`npm run verify:videos`, with `ALLOW_MISSING_API_KEYS=false`. The runner forwards
that environment to its production build and server. This is the configured
build-time credential path; no secret values were retrieved or copied locally.
The successful job metadata alone does not independently validate its data.

Fresh evidence requests returned:

- `GET /actions/jobs/116289840724/logs`: HTTP 403,
  `Must have admin rights to Repository.`
- `GET /actions/artifacts/11953169162/zip`: HTTP 401,
  `Requires authentication`. The API lists the artifact as unexpired and named
  `videos-verification-93f57992a7deaa19e92d4b6fbf9f626e2a053cd2`.
- `GET /check-runs/116289840724`: output title, summary, and text are null.
  Its annotations contain only Node action-runtime and runner-image notices.

These paths are relative to
`https://api.github.com/repos/foxleigh81/foxyslab-website`.
The retained [browser and Lighthouse artifact](https://github.com/foxleigh81/foxyslab-website/actions/runs/38695140846/artifacts/11953169162)
could not be read. No populated browser report, CLS/LCP values, or first-thumbnail
priority hint was observed. No performance result is inferred from job success.

## Original failed job

The earlier failure remains associated with checkout
`b9a25af265c225a73a351b6edc44012cdf6a4725`,
[run 38670701451, job 116212893212](https://github.com/foxleigh81/foxyslab-website/actions/runs/38670701451/job/116212893212).
Fresh requests for that job's logs returned HTTP 403 with the same admin-rights
message; [artifact 11944606207](https://github.com/foxleigh81/foxyslab-website/actions/runs/38670701451/artifacts/11944606207)
returned HTTP 401, `Requires authentication`.

The failed check's public annotation says only
`Process completed with exit code 1.` The known outer command is
`npm run verify:videos`; the failed child command, precise error, and
tooling-versus-application cause remain **undetermined**. Original logs and
browser reports are unavailable here. The evidence references are preserved;
neither later success nor local missing credentials diagnoses that failure.

## Exact-head Preview

The deployments API filtered by the reviewed SHA returned Preview deployment
`7086005477`. Its successful status at `2026-10-15T06:55:09Z` provides
`https://foxyslab-website-hng4ok64s-foxleighco.vercel.app` as `environment_url`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to
`https://vercel.com/sso-api`. This is a protected Preview, not a tested gallery.

The existing Actions run is the available credentialed verification path.
This sandbox has neither GitHub authentication nor the three build-time
credentials, so it cannot retrieve the retained evidence or initiate an
authenticated rerun. No new remote run was initiated. The next required input
is authorized access to the credential-redacted original failure diagnostic and
this head's browser/Lighthouse reports. Populated playlist selection,
forward/back pagination, and the emitted thumbnail priority hint still need
browser observations, as recorded in round 35.

## Local validation

Only this evidence record changes. There is no meaningful automated behavior
test for this documentation-only revision, so no red run, production-code fix,
or refactor is claimed. No reproduced application failure supports a code change.

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 305 tests passed, one skipped, including
  the existing verification runner tests.
- `npm run verify:videos`: exit 1 at credential preflight, naming missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
  Build, production browser checks, and Lighthouse did not start locally.
- `FLAGS_SECRET=<locally-generated-ephemeral-key> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 50 passed, one flaky (passed on retry), one skipped. The flaky iPhone
  WebKit Enquiries accessibility audit reported `page.evaluate: Target crashed`
  at `e2e/accessibility.spec.ts:41` during `AxeBuilder.analyze()`. The browser
  crash's underlying cause is undetermined; it does not diagnose the earlier
  remote production failure. These development-server tests exclude populated
  production verification. Expected missing-YouTube-key messages, webpack cache
  warnings, and `/work` watcher permission warnings appeared.
- `npx prettier --check docs/validation/videos-round-36.md` and
  `git diff --check`: exit 0.
