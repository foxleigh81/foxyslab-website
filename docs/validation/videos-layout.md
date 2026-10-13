# Videos initial layout: task 1 validation

The `/videos` page now resolves playlist and page parameters on the server and
renders the gallery in the initial response. Search remains local client state.
The old header-only Suspense fallback and `useSearchParams` gallery path are
removed. The route renders per request; the YouTube fetches retain their cache.
The bundled Poppins files avoid a build-time Google Fonts request. The first
card's existing `priority` prop is unchanged.

## Reconstructed pre-change baseline

The historical starting revision is `eca93e0`. With its page and gallery files
restored temporarily, the focused server-render test produced only the JSON-LD
scripts, the "All Videos" header and subtitle, and the YouTube CTA. It produced
zero `h2` card headings for default and direct-playlist URLs; even the empty
state was absent. The fallback did not reserve grid space. This is a fixture
render of the historical code, not a recovered production HTTP response.

No pre-change populated desktop/mobile browser recording exists in this checkout.
The original production HTML, footer coordinates, and pre-change Lighthouse
measurements cannot be recovered here: the required YouTube and Fourthwall
credentials are unset, and the sandbox cannot reach their data origins. The
historical live ticket reported mobile CLS 0.511 on three runs and LCP of 3.8,
4.3, and 11.8 seconds, but those are ticket measurements, not reproductions.
The genuine pre-implementation focused-test run and its raw output are
unavailable. The reconstructed run below is not evidence of that historical
red result. No pre-change populated browser or Lighthouse evidence exists in
this checkout.

## Observed layout regression cycle in revision 10

The regression was already committed in `app/videos/__tests__/page.test.tsx`.
It renders the real page and gallery with fixture YouTube data while the
navigation hook suspends, modeling Next's static-render bailout. To check that
it detects the original bug, the historical page and gallery files were
restored temporarily, tested, then the current implementation was restored.

- Red: `npm test -- app/videos/__tests__/page.test.tsx` exited 1: six failures,
  one pass. Default and direct-playlist cases received zero headings instead
  of 12; page-two cases received zero instead of one; the empty state was
  missing. This was a reconstructed red run, not the original pre-implementation
  run, whose raw log is unavailable.
- Green: the same command exited 0 after restoring the current implementation:
  seven tests passed.
- Refactor: moved the videos-only navigation diagnostic from the shared E2E
  helper into `e2e/helpers/videos-fixture.ts`, and removed unrelated E2E route
  edits and the task-unrelated CI workflow. `npm test -- app/videos/__tests__/page.test.tsx lib/__tests__/videos-navigation.test.ts lib/__tests__/videos-fixture.test.ts`
  exited 0: 16 tests passed.

The page test covers the first 12 cards, direct playlist URLs, page two,
unknown and duplicate parameters, and initial empty/error presentation. Gallery
unit tests cover search, playlist selection and pagination. A temporary
inspection of the fixture-rendered HTML showed the first YouTube thumbnail
`img` with `fetchpriority="high"` and a matching image preload with
`fetchpriority="high"`. The temporary logging was removed. A populated
production response still needs inspection.

## Revision 10 checks

- `npm ci`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0, 297 passed and one skipped across 35 files.
- `NODE_OPTIONS=--max-old-space-size=1536 FLAGS_SECRET="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("base64url"))')" npm run test:e2e -- --reporter=line --workers=1 --retries=0`: exit 0, 49 passed and one skipped. The ordinary E2E server had no YouTube data, so this covers route and error presentation, not populated gallery hydration.
- `npm run verify:videos`: exit 1 before build, listing only the missing variable names `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`.
- `NODE_OPTIONS=--max-old-space-size=1536 FLAGS_SECRET="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("base64url"))')" npm run build`: exit 1 after compilation and integrated lint/type checks; `/about` prerender requires `YOUTUBE_API_KEY`.
- The same build command with `ALLOW_MISSING_API_KEYS=true`: exit 0. This is a missing-data compilation check, not a production-equivalent build.
- Against that missing-data build, `VIDEOS_BASE_URL=http://127.0.0.1:4173 VIDEOS_REPORT_DIR=/work/repo/.lighthouseci/videos/diagnostic-round10 npm run test:e2e -- e2e/videos-gallery.spec.ts --config=playwright.videos-production.config.ts --reporter=line --workers=1 --retries=0` exited 1 in 4.4 seconds: four smoke tests passed; the populated check failed on desktop and mobile with `Gallery fixture/data unavailable: no rendered video cards`. This exercises the browser diagnostic, not the populated-layout assertion.

No populated desktop/mobile footer stability result or three mobile
Lighthouse reports (CLS and LCP) were obtainable in this sandbox. Run the
procedure in [videos-production-checks.md](videos-production-checks.md) with
valid credentials and data-origin access to complete those acceptance checks.

## Revision 11: continue the supplied draft

This round started with a clean working tree on
`eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t` at
`94072565934a00deb1fd8c1689f9409b51401a20` (revision 10). Its history includes
the preceding nine implementation revisions; the checkout was not restarted
from `eca93e0`. No branch changes, commits, or pushes were made.

The review names discarded run `r20261013-49e4de29a61d`, which is absent from
the available Git history. The configured remote, `file:///work/trusted.git`,
is unavailable (`git ls-remote` exits 128), so the supplied checkout's head
cannot independently be compared with the pushed head in this sandbox.

Inspection confirmed that the current draft already retains the server-rendered
gallery, initial-layout regression, local fonts, and populated-browser diagnostic
checks. The review identifies no additional behavioral change to reapply.
This revision only records provenance and fresh verification; it does not
replace the draft implementation. There is no new red/green/refactor cycle for
this documentation-only update, and no new red run is claimed. The historical
cycle and outstanding production acceptance checks remain documented above.

Fresh checks on this checkout:

- `npm ci`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0, 297 passed and one skipped across 35 files.
- `npm test -- app/videos/__tests__/page.test.tsx components/VideoGallery/__tests__/VideoGallery.test.tsx lib/__tests__/videos-navigation.test.ts lib/__tests__/videos-fixture.test.ts`:
  exit 0, 39 tests passed across four files.
- `npm run verify:videos`: exit 1 at credential preflight, naming missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` without
  printing values. A credentialed build, populated browser checks, and three
  mobile Lighthouse measurements remain blocked; no new CLS/LCP result is
  claimed.
- `NODE_OPTIONS=--max-old-space-size=1536 FLAGS_SECRET="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("base64url"))')" npm run test:e2e -- --reporter=line --workers=1 --retries=0`:
  exit 0, 49 passed and one skipped. This checks routes and missing-data
  presentation, not populated gallery stability. The generated flag secret is
  ephemeral and does not supply the missing data credentials.
- `NODE_OPTIONS=--max-old-space-size=1536 FLAGS_SECRET="$(node -e 'process.stdout.write(require("node:crypto").randomBytes(32).toString("base64url"))')" npm run build`:
  exit 1 after successful compilation and integrated lint/type checks. The
  `/about` prerender reports that `YOUTUBE_API_KEY` is required in production.
  The prebuild-generated sitemap date changes were removed from the diff.
- `git diff --check`: exit 0.

## Revision 13: review follow-up

This revision makes no page or test behavior changes. The populated desktop and
mobile hydration check, three mobile Lighthouse runs, and emitted priority-hint
inspection still require the production-equivalent credentials and data access
described in [videos-production-checks.md](videos-production-checks.md). There
is no historical pre-implementation red run available; the reconstructed red
described above remains explicitly separate and is not presented as that run.
This is an evidence limitation, not a request for an exception.

The production verification command was retried on this checkout:

- `npm run verify:videos`: exit 1 at credential preflight, naming missing
  `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET`. It did
  not build or start a server, so it produced no populated browser result,
  priority-hint observation, CLS, or LCP report.

This was a documentation-only correction, so no behavior change or new TDD
cycle was appropriate. The existing red/green/refactor evidence is historical
and described above; no new red run is claimed.

Fresh checks for this revision:

- `npm ci`: exit 0.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0, 297 passed and one skipped across 35 files.
- `npm test -- app/videos/__tests__/page.test.tsx`: exit 0, seven passed.
- `NODE_OPTIONS=--max-old-space-size=1536 FLAGS_SECRET="<ephemeral>" npm run test:e2e -- --reporter=line --workers=1 --retries=0`: exit 0, 49 passed and one skipped. This ran against missing-data development server behavior, not populated hydration.
- `NODE_OPTIONS=--max-old-space-size=1536 FLAGS_SECRET="<ephemeral>" npm run build`: exit 1 after compilation and integrated lint/type checks because production prerendering requires `YOUTUBE_API_KEY`.
- `git diff --check`: exit 0.
