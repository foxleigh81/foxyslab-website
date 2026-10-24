# Round 32: exact-head diagnosis blocked by report access

Checked PR #79 head `4c653ac5aaf5409172d6858a6add95268aef8500` on
2026-10-15. The local checkout and GitHub job API agree on this SHA.

## Credentialed job evidence

[Run 38660675562, job 116180898464](https://github.com/foxleigh81/foxyslab-website/actions/runs/38660675562/job/116180898464)
passed checkout, dependency installation, and Chromium installation. The
combined build/browser/Lighthouse step failed; report upload and linking passed.
The failure annotation says only `Process completed with exit code 1.`

Fresh API requests returned:

- Job logs: HTTP 403, `Must have admin rights to Repository.`
- [Report artifact 11938837238](https://github.com/foxleigh81/foxyslab-website/actions/runs/38660675562/artifacts/11938837238)
  download: HTTP 401, `Requires authentication`. The listing marks it unexpired.
- Failed-job rerun request: HTTP 401, `Requires authentication`; no rerun started.

The outer command is `npm run verify:videos`. The failing child and precise
cause cannot be established for this head from the available annotation.
Tooling-versus-application classification remains unresolved. Round 31's
missing-card diagnostic belongs to a different checkout and is not evidence of
this run's failure. No code or workflow change is justified by these results.

An authorized reader must inspect this run's child output and retained
`browser-smoke.json`, including the failure location and page evidence, and
provide credential-redacted findings. This distinguishes a browser setup failure
from missing gallery data or a pre-hydration rendering failure without weakening
the populated-content assertions. No credential values were retrieved or stored.

## Preview and local production verification

The deployments API filtered to this exact SHA returned deployment `7080705412`.
Its successful status supplies
`https://foxyslab-website-2vq4y1nhd-foxleighco.vercel.app`.
An unauthenticated HEAD request to `/videos` returned HTTP 302 to Vercel SSO;
this is not a tested page.

Local `npm run verify:videos` exited 1 at preflight, naming absent
`YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
No production build or populated browser check started locally. This does not
diagnose the credentialed job. No CLS, LCP, or thumbnail-priority measurements
are claimed. Credentialed verification remains blocked.

## Validation

This revision records evidence only. There is no code change and therefore no
meaningful new automated behavior test, red/green cycle, or refactor.

- `npm ci --no-audit --no-fund`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 35 files passed, 305 tests passed, one skipped.
- `FLAGS_SECRET=<locally-generated-ephemeral-key> npm run test:e2e -- --workers=1 --max-failures=1`:
  exit 0; 51 passed, one skipped. These development-server checks exclude
  populated production verification. Expected missing-YouTube-key logs and
  webpack cache/watch warnings appeared.
- `npm run verify:videos`: exit 1 at the credential preflight described above.
- `npx prettier --check docs/validation/videos-round-32.md` and
  `git diff --check`: exit 0.
