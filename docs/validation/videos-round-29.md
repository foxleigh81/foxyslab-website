# Round 29: distinguish the failed browser preconditions

The checkout and GitHub run API identify head
`f8e996ef4e4036eb71db527580abcd4d0594c35f` for draft PR #79.
The supplied redacted log for [run 38647277078](https://github.com/foxleigh81/foxyslab-website/actions/runs/38647277078)
shows the production build finishing, followed by failure of this child:

```sh
node node_modules/@playwright/test/cli.js test e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts
```

The error was `Browser smoke failed: line 21: failed; populated gallery data
unavailable; check YouTube credentials and playlist membership`. Line 21 is the
test declaration, not the failed assertion. The shared diagnostic covered
navigation failure, absent cards, and missing populated playlist options; it
did not establish which occurred. Build success does not prove this
request-rendered route received populated data.

## Reproduced tooling defect

The report formatter discarded the distinguishing reason already present in
the browser report. A focused regression now feeds each existing error category
through the real verification orchestration and checks its resulting diagnostic,
server cleanup, and omission of a private test string. It also checks an unknown
future category. The fix maps known markers to fixed diagnostic text and retains
a safe fallback; it does not print raw report content or change the browser
assertions. Refactoring consolidated the mappings into a table.

- Red: `npm test -- lib/__tests__/verify-videos.test.ts`, exit 1: four new
  category assertions failed, nine existing checks passed.
- Green: the same command, exit 0: all 13 passed.
- After the mapping-table refactor and formatting: the same command, exit 0:
  all 13 passed again.

This is a confirmed verification diagnostic defect. It is not a confirmed fix
for the underlying credentialed browser failure, whose tooling-versus-application
classification remains unresolved. No gallery application change is justified
by the available evidence.

## Exact-head access and production path

Fresh requests to `/actions/jobs/116137151817/logs` and
`/actions/artifacts/11933515481/zip` returned HTTP 403 and 401 respectively.
The [retained artifact](https://github.com/foxleigh81/foxyslab-website/actions/runs/38647277078/artifacts/11933515481)
therefore could not be inspected here.

The deployments API filtered to this head returns deployment `7078742610`.
Its successful status supplies
`https://foxyslab-website-gdgn2981m-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returns HTTP 302 to Vercel SSO;
this is not a tested page.

The existing same-repository workflow preserves repository-secret injection,
prints the checked-out SHA, and runs the following production verification path:

```sh
export CHROME_PATH="$(node -p 'require("@playwright/test").chromium.executablePath()')"
npm run verify:videos
```

This builds with `NODE_ENV=production` and `ALLOW_MISSING_API_KEYS=false`, starts
an isolated production server, runs the populated browser child above, and then
collects three mobile Lighthouse reports. The workflow retains and links reports.
Locally, `npm run verify:videos` exits 1 at preflight because `YOUTUBE_API_KEY`,
`FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` are unavailable. No credential
values were fetched. No new credentialed CI run was initiated from this sandbox.

The next credentialed run must identify the precise failing precondition using
the improved diagnostic (or an authorized reader must inspect the retained
report). Its actual cause still needs resolution before populated browser and
CLS/LCP acceptance can be claimed. There are no new performance measurements.

## Local checks

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files, 305 passed, one skipped.
- `FLAGS_SECRET=<locally-generated-ephemeral-key> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. These are general development-server checks,
  without YouTube credentials, not populated production verification.
- Prettier checks on the three changed files and `git diff --check`: exit 0.
