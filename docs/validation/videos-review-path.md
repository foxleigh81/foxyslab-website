# PR #79 bounded review path check

Checked 2026-10-19. GitHub's pull-request API reports draft PR #79 open at
`bfe8d1e63c01d2b17711a99e86be785250dfb9f2`; local `HEAD` is the same
commit. The PR base is `eca93e0605ecf22f3eb8943a5fc84a37a65e11b1`.
The cumulative base-to-head diff has 75 files and 5,621 insertions, including
historical validation logs. The recorded Ashley invocation failed with
`Paid QA prompt is too large; split the change for review` (operation-error
500). That failure is not a QA verdict.

## Interface check and blocker

`codex review --help` accepts one custom prompt and a repository diff selector
(`--base`, `--commit`, or `--uncommitted`). It exposes no packet identifier,
evidence-reference field, shared PR-head key, or consolidated-review input.
`codex exec --help` and `codex resume --help` describe generic agent sessions,
not an Ashley review that can retain independent packet identities. `codex mcp
list` reports no configured MCP servers. No Ashley review or consolidation tool
is available in this sandbox's callable interface. A generic Codex review is
not evidence that the failed Ashley review path supports bounded packets.

The required interface would accept four separately named inputs, each with
`repo`, `pr=79`, `head=bfe8d1e63c01d2b17711a99e86be785250dfb9f2`, one
bounded relevant diff, and commit-matched evidence references. It would then
accept those four packet IDs plus the complete checklist below for one Ashley
verdict, without expanding them into the cumulative patch or historical logs.
No such interface is documented or callable here, so neither packet identity
retention nor checklist delivery without truncation can be demonstrated. This
is a technical blocker for Engineering replanning. No packet or review was
submitted or invoked, and no QA result was inferred.

The four intended non-overlapping scopes are: (1) initial server layout and
footer stability; (2) search, playlist filtering, pagination, direct URLs,
and controlled empty/error states; (3) credential-safe verification and
retained artifacts; (4) focused regression, lint, type-check, unit/e2e,
credentialed build, three mobile CLS/LCP pairs, and the observed absent
thumbnail priority hint. Each scope needs its own diff and current-head
evidence references, rather than a cumulative base-to-head patch.

## Complete ticket acceptance checklist for the eventual consolidated review

- [ ] The initial `/videos` response renders the first page of video cards or
      an equally stable reserved layout; hydration does not push the footer through
      the viewport.
- [ ] Three mobile Lighthouse runs on the production-equivalent build show CLS
      below 0.1. Record LCP and inspect the first thumbnail priority hint; do not
      claim a fixed network-dependent LCP improvement without measurement.
- [ ] Search, playlist filter, pagination, direct playlist URLs, and empty/error
      states retain their current behaviour.
- [ ] Add a focused regression check for the initial rendered layout and run
      lint, type-check, unit/e2e tests, and build with valid build-time data
      credentials.

The recorded baseline is mobile CLS 0.511 in all three runs, LCP 3.8, 4.3,
and 11.8 seconds, and a footer shift associated with the delayed gallery.
Macklin's independent security gate remains separate from Ashley's verdict.
