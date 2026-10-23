# T4 task 3, revision 6: verification evidence

Observed on 2026-10-23 at source head
`9ad7fee1292c1afd013b89a295375bd3a14624a6`, on the assigned branch
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`. The initial working
tree was clean. This revision adds only this record; it does not verify the
subsequent harness commit.

## Identity and delivery

Anonymous GitHub REST reads returned PR #79 as open/draft with the same branch
and head. The current-head actions query returned CI run
[40002859580](https://github.com/foxleigh81/foxyslab-website/actions/runs/40002859580)
as `in_progress`, with no conclusion. Its artifacts endpoint returned zero
artifacts at inspection time. This is a snapshot of an unfinished run, not a
conclusion about its eventual artifact delivery.

The ordinary CI upload still targets `.lighthouseci/` without
`include-hidden-files: true`. No workflow was changed. No completed operation
disposition for `r20261023-4d0600c0217c` or caller restoration receipt was supplied;
public PR identity does not establish those control-plane facts. No control-plane
interface is available in this sandbox.

## Acceptance disposition

| Criterion | Outcome and data conditions |
| --- | --- |
| Initial cards or stable reserved space | Observed only in the existing synthetic server-rendering regression with 25 videos. Initial HTTP response with approved populated saved data remains blocked. |
| Footer stability through hydration | Blocked for the production build and populated data; no footer displacement measurement obtained. |
| Three mobile CLS values below 0.1 and paired LCP | Blocked; no production measurements or report links obtained. No LCP improvement claimed. |
| Emitted first-thumbnail priority hint | Synthetic card tests pass; production emission remains blocked and is not inferred from source. |
| Search, playlist selection, forward/back pagination, direct playlist URLs | Local synthetic coverage passes in the focused unit tests; production-populated browser outcomes remain blocked. |
| Empty/error states | Existing focused server-rendering and component tests pass with mocked data. This is not live API evidence. |
| Focused regression, lint, type-check and unit suite | Observed passing locally at the source head; commands below. |
| E2E | Local development-server result recorded below; production-tagged checks are excluded by the default configuration. |
| Valid-credential build | Blocked; not run. |
| Live API integration after deployment | Blocked pending an authorized deployed revision and reachable integration environment. |

Presence-only inspection found `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`,
`FLAGS_SECRET`, `VIDEOS_BASE_URL` and `VIDEOS_REPORT_DIR` absent. No approved
saved dataset/digest, independent exact-head credential approval, or
production-equivalent build identity was supplied. Network access is limited
to GitHub and package registries. No credentials were requested, copied or
released; no populated build or Lighthouse run was attempted.

## Local checks

- `npm ci --cache /work/repo/.git/npm-cache --no-audit --no-fund`: exit 0;
  987 packages installed, with npm configuration, deprecation and install-script warnings.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 348 tests passed, 1 skipped.
- `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx components/VideoCard/__tests__/VideoCard.test.tsx`:
  exit 0; 3 files and 49 tests passed.
- `FLAGS_SECRET=BwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwc npm run test:e2e -- --max-failures=1 --workers=1 --reporter=line`:
  exit 0; 71 passed, 5 skipped. The flags key is public synthetic test data.
  Desktop Chromium and mobile WebKit ran against the development server,
  with synthetic populated interaction/streaming fixtures and no YouTube key.
  Four controlled empty/error markup tests skip without their generated fixture
  directory, and the desktop-only navigation test skips on mobile.
  Production-tagged tests were excluded, not passed.
- `git diff --check`: exit 0.

Vitest emitted its configuration-loader compatibility warning. The development
server reported webpack cache and `/work` watcher permission warnings, and
the expected missing YouTube API key diagnostic. No executable
behavior changed and no new website defect was demonstrated. This documentation
task has no meaningful new automated behavior test; no red run, production
repair, refactor or green rerun is claimed.

Release readiness remains no. Delivery reconciliation, completed current-head
CI/artifact inspection, approved populated data and credentials, production
build/browser/three-run Lighthouse evidence, and deployed live API verification
remain outstanding. Passing local checks does not satisfy those criteria.
