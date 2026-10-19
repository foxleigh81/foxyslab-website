# PR #79 review-path capability check

Checked 2026-10-19 for plan generation 1, run
`r20261019-24ff8443f141`. GitHub's pull-request API and local `HEAD` both
report draft PR #79 at `bd7079e747fb68e0d80f9a88807d7d7a98326fd7`; its
base is `eca93e0605ecf22f3eb8943a5fc84a37a65e11b1`. The recorded Ashley
operation returned HTTP 500, `Paid QA prompt is too large; split the change for
review`. This is an invocation failure, not a QA verdict.

## Inspected interface and payload evidence

The documented local interface, `codex review --help` (also `codex exec review
--help`), accepts one prompt and one repository diff selector: `--base`,
`--commit`, or `--uncommitted`. It documents no dry-run serialization, bounded
packet ID, evidence-reference field, shared PR-head key, or consolidation
operation. `codex exec --help` documents generic sessions; `codex mcp list`
reports no configured MCP servers. A generic Codex review would not test the
Ashley driver, so none was invoked.

No Ashley driver, serialized request, or request-size log is available in this
repository or its callable interface. **The exact payload assembled by that
driver, its serialized byte size, and whether it included cumulative patch
text or historical logs are therefore unobservable here.** The error message
alone does not establish its contents or size. This is the specific unsupported
inspection operation, not evidence that bounded submission succeeds.

For scale, `git diff --binary <base> <head> | wc -c` measures the _possible_
base-to-head patch at **364,999 bytes** across 76 files (5,677 insertions and
102 deletions). The `docs/validation/**` portion is **193,831 bytes**; the
`docs/validation/videos-round-*.md` history alone is **158,927 bytes**. The
single `bfe8d1e..bd7079e` commit patch is **3,623 bytes**. These are Git patch
sizes, not serialized Ashley payload sizes. Historical logs exist in the
cumulative patch, but their presence in the failed Ashley request is unknown.

The same-head Vercel Preview is deployment `7175465605`. Its `/videos` URL
returns HTTP 302 to Vercel SSO without a personal session, so it is not a
populated-page verification. CI status or artifact inspection cannot replace
an Ashley verdict.

## Required driver check before review resumes

The Ashley driver must expose a no-invocation serialization dry-run for the
exact plan generation, run, PR, and head above. It must report byte length and
the top-level fields of the **final request after all automatic context is
added**, with secrets and content redacted. It must explicitly report whether
the cumulative base-to-head patch and historical logs are attached. A dry-run
of hand-built packets alone would miss the suspected expansion.

The driver then needs to demonstrate four separate bounded packets, each tied
to `repo=foxleigh81/foxyslab-website`, `pr=79`, and the full head SHA, with
only its relevant diff and commit-matched evidence references. A consolidation
dry-run must accept their four IDs and the complete checklist below, preserve
the shared head binding, and show the final serialized size without appending
the cumulative patch or historical logs. It should reject a mismatched packet
head and a missing checklist criterion. If this operation is unsupported, the
repair belongs in the external review driver; no repo-local review integration
exists to change on this PR. Ashley must not be invoked until that check passes.

The packet scopes are (1) initial server layout and footer stability; (2)
search, playlist filtering, pagination, direct URLs, and empty/error states;
(3) credentialed verification and retained artifacts; and (4) regression and
required checks plus three mobile CLS/LCP pairs and the observed **absent**
first-thumbnail priority hint. Each outcome must identify whether it was
observed on live populated content or in a controlled fixture. Macklin's
security gate remains separate.

## Complete ticket checklist for consolidation

- [ ] The initial `/videos` response renders first-page cards or an equally
      stable reserved layout; hydration does not push the footer through the
      viewport.
- [ ] Three mobile Lighthouse runs on a production-equivalent build show CLS
      below 0.1; record each LCP and inspect the first thumbnail priority hint.
      Do not claim a fixed network-dependent LCP improvement without evidence.
- [ ] Search, playlist filter, pagination, direct playlist URLs, and empty/error
      states retain their current behavior.
- [ ] A focused initial-layout regression check, lint, type-check, unit/e2e
      tests, and a build with valid build-time data credentials are recorded.

The historical baseline is mobile CLS 0.511 in all three runs and LCP 3.8,
4.3, and 11.8 seconds, with the footer identified in the layout-shift audit.
This document records a blocked interface check, not a review submission or
Ashley approval.
