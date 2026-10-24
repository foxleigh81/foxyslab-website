# Task 3, round 18: verification boundary

Inspected on 2026-10-19. This record supersedes older head and execution-path
claims for this inspection only; it does not certify a later harness commit.
No application, workflow, or credential-handling code changes are warranted by
the supplied current-head failure evidence (an empty list).

## Head and containment prerequisites

The public `GET /repos/foxleigh81/foxyslab-website/pulls/79` returned HTTP 200,
an open draft, branch `eng/71-d38d08-fix-videos-layout-shift-and-slow-first-t`,
and head `22da08e738d6ff985a9e95a8c29fca890799117c`, matching local HEAD.
The initially clean checkout contains the round-17 retention repair:
`.github/workflows/ci.yml` runs coverage but no longer uploads `coverage/`.
This establishes the repair on the observed PR head, independently of the
unavailable historical run commit `9eaae76fdda6d9b78aa0da6f93946de8cb8372cc`.

Public metadata for artifacts `12218763710` and `12216535219` returned HTTP
200 and `expired: false` for each. Neither archive was downloaded. Their
matched file/field, classification, removal, and any required rotation remain
unknown; see `videos-historical-artifact-containment.md`. The retention repair
does not resolve this historical dependency. Marcus must coordinate the
authorized Actions operator's private classification and value-free disposition
record before requesting fresh credentialed criterion verification.

## Execution path and specific blockers

| Observation | Meaning and owner |
| --- | --- |
| Workflow metadata endpoint returns HTTP 200, ID `384502981`, state `active` | Registration alone does not establish an executable trusted workflow. |
| `GET /repos/foxleigh81/foxyslab-website/contents/.github/workflows/videos-verification.yml?ref=main` returns HTTP 404 | The workflow file on the required dispatch ref is not publicly retrievable. Marcus and the authorized Actions operator must establish and inspect the trusted default-branch path. Do not infer availability from workflow metadata. |
| `GET /repos/foxleigh81/foxyslab-website/environments/videos-verification` returns HTTP 404 | Protected-environment configuration is unconfirmed, not proven absent. The repository administrator must attest independent reviewers, prevention of self-approval/bypass, main-only branch restriction, and scoped environment secrets without unapproved repository/organization equivalents. |
| `gh` unavailable; `GH_TOKEN` and `GITHUB_TOKEN` absent (presence-only checks) | This sandbox cannot dispatch or administer the authorized path. Marcus coordinates the operator; no operator has been contacted or accepted this handoff here. |
| `npm run verify:videos` exits 1 listing missing `YOUTUBE_API_KEY`, `FOURTHWALL_STOREFRONT_TOKEN`, and `FLAGS_SECRET` | Credential preflight stops before build, server, browser, or report creation. The authorized runner needs valid environment-scoped data credentials and access to YouTube, Fourthwall, and image origins. Do not deliver credentials to this sandbox. |

These are technical/access dependencies, not a permission refusal from Alex.
No credentialed workflow was dispatched, no settings were changed, and no
populated build or browser execution is demonstrated in this round.

After containment and the trusted path are established, the operator should
resolve the then-current PR head and obtain independent approval of that exact
SHA before credential release. From the authorized operator environment:

```sh
gh workflow run videos-verification.yml \
  --repo foxleigh81/foxyslab-website --ref main \
  -f pr_number=79 -f expected_sha=<independently-approved-current-head-sha>
```

This is a future execution recipe, not an executed command. The existing
`Credentialed Videos Build and Measurements` job checks the live PR SHA before
checkout and again before `npm run verify:videos`, verifies checkout HEAD,
and unsets `GH_TOKEN` before PR-controlled Node/npm execution. The operator
must bind the independent approval, run URL, checked SHA, and resulting artifact
URL to the same head; a head change requires new approval and execution.

The verifier runs `npm run build`, serves `next start`, runs
`npm test -- app/videos/__tests__/page.test.tsx`, and invokes Playwright for
`e2e/videos-gallery.spec.ts` with `playwright.videos-production.config.ts`.
It then invokes Lighthouse three times with `--form-factor=mobile` and
`--throttling-method=simulate`. General CI separately runs `npm ci`,
`npm run lint`, `npm run type-check`, `npm run test:coverage`, and
`npm run test:e2e`. Its missing-key build/Lighthouse job is not populated
acceptance evidence. Review all three recorded CLS values against `< 0.1`;
the verifier records metrics but does not itself enforce that threshold.

## Data and private-output boundary

The saved synthetic source is `test/fixtures/youtube.ts`, expanded into 25
videos and one playlist in `app/videos/__tests__/page.test.tsx`. It exercises
server-rendered first-page, search, playlist, and pagination markup with the
production data shape. Only empty/error HTML is exported for the controlled
browser fixtures; those checks are explicitly labelled fixture results and
do not hydrate a live empty/error page.

The production browser and Lighthouse path does not inject that populated
fixture: `app/videos/page.tsx` requests up to 200 live videos, playlists, and
playlist membership through `lib/youtube.ts` and Next's fetch cache. The operator
must establish populated saved-video content with a matching playlist and more
than 12 videos for meaningful pagination verification. The synthetic regression
alone does not demonstrate populated production behavior. If a fixed saved-data
snapshot is required for repeatable measurements, its approved source and
provenance remain an explicit data dependency for Marcus; none is installed
by this round.

The intended environment holds `VIDEOS_VERIFY_YOUTUBE_API_KEY`,
`VIDEOS_VERIFY_FOURTHWALL_STOREFRONT_TOKEN`, and `VIDEOS_VERIFY_FLAGS_SECRET`.
Only the approved credentialed step receives them; the verifier passes live
values only to build/server child processes. Fixture tests receive synthetic
values, and browser/Lighthouse children receive no data credentials. Child
stdout/stderr are suppressed, and failure diagnostics use bounded fields.
These measures assume independently approved code; YAML alone cannot prevent
unreviewed code from leaking credentials.

Raw browser JSON, fixture HTML, Lighthouse HTML/JSON, and `.next` output stay
on the authorized runner, with no upload path for them in this workflow.
Screenshots/traces are disabled. The verifier removes raw report files in its
server-stage `finally` cleanup; runner teardown must dispose of remaining build
and cache data, including on cancellation. Only
`.lighthouseci/videos/run-*/summary.json` is uploaded for 14 days. It contains
the SHA, credential-presence labels, bounded browser outcomes, and numeric
CLS/LCP values. The job summary prints those measurements and the artifact
link. Treat this minimal summary as publishable: it is not a private archive.
Historical source-bearing coverage uploads require separate containment.

## Local validation and remaining work

This is documentation-only work, with no changed executable behavior for a
meaningful red-green-refactor test. No red run, production fix, or refactor is
claimed. The following local checks cannot verify
the harness's future head, protected settings, or historical artifact contents.

- `npm ci --no-audit --no-fund`: exit 0; dependency deprecation and
  install-script configuration warnings were emitted.
- `npm run lint`: exit 0.
- `npm run type-check`: exit 0.
- `npm test`: exit 0; 38 files passed, 345 tests passed, one skipped.
- `npm run verify:videos`: exit 1 at missing-credential preflight as documented
  above; no production build, browser run, or Lighthouse measurements occurred.

Remaining release work: historical containment; confirmed trusted dispatch and
independent exact-head approval; valid-credential production build; populated
initial layout/hydration/footer and interaction evidence; first-thumbnail
priority observation; three mobile CLS/LCP pairs; independent reviews; and the
live API check after deployment. No readiness or review verdict is implied.
