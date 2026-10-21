# Issue #71 saved-video source research (2026-10-21)

This is a read-only source and access inventory for task 1. It does not
approve dataset use, release credentials, or verify populated website behavior.

## Records inspected

- Public GitHub issue #71 (`GET /repos/foxleigh81/foxyslab-website/issues/71`):
  the ticket requires production-shaped, populated saved video data; the issue
  currently has no comments naming a source or approver.
- Public draft PR #79 (`GET /repos/foxleigh81/foxyslab-website/pulls/79`):
  head `9275aeb0a3daa0c1b0b20964e99264c427de053b`; its description
  reports missing populated verification and does not identify a saved source.
- Public GitHub issue search for `"saved video"` in this repository: only
  issue #71 matched.
- `site.config.ts` and `lib/youtube.ts`: the configured channel handle is
  `foxyslab`; production reads live YouTube v3 uploads, videos, playlists, and
  playlist membership using `YOUTUBE_API_KEY`. This identifies the live upstream
  service, not an approved immutable saved-video dataset or its custodian.
- `.github/workflows/videos-verification.yml` at the PR checkout: a candidate
  manual workflow names the `videos-verification` environment and verification
  secrets. Public `GET /repos/foxleigh81/foxyslab-website/contents/.github/workflows/videos-verification.yml?ref=main`
  returned 404. The candidate is not evidenced as an installed trusted route;
  it also passes secrets to PR-controlled build/server code.
- `docs/validation/videos-operations-round-9.md` and
  `docs/validation/videos-operations-round-10.md`: prior local assessments
  explicitly lack source approval, an immutable dataset identity, an authorized
  operator, and independent controls clearance. These are handoff records, not
  approvals or evidence of effective external settings.

## Finding and required access

No inspected record identifies the saved-video source, its custodian, or the
person authorized to approve its use. Marcus is the named Engineering research
coordinator, not an evidenced data custodian or dataset-use approver. The exact
private saved-data resource cannot be named from the accessible public records.
Marcus needs read access to the Foxtail Engineering operations/source inventory
that records the saved-video asset and its owner, and the source owner must
provide an approval receipt covering the immutable snapshot, permitted use and
delivery route. The inventory's exact resource identifier and access-control
owner are not exposed here; they must be supplied by Studio operations rather
than guessed from the website repository.

The candidate GitHub Actions workflow is not an authorized private route.
An operations owner must identify the trusted controller revision, permitted
executor and data-delivery boundary, then obtain Macklin's independent control
assessment before any dataset or credential release. The website sandbox has
no access to Studio operations records, protected GitHub environment settings,
or the private saved dataset; its network is limited to GitHub and package
registries. No private access was attempted and no populated data or credentials
were released.

Posting this finding to issue #71 requires authenticated GitHub Issues write
access for `foxleigh81/foxyslab-website`; the current sandbox has no `gh`
executable, GitHub token environment variable, or configured credential helper.
`POST /repos/foxleigh81/foxyslab-website/issues/71/comments` returned HTTP 401
`Requires authentication`, so this local record has not been posted to the issue.
