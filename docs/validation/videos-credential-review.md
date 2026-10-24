# Credential verification follow-up (2026-10-19)

The checkout and GitHub PR #79 both report head
`7d9cc88dc5bc5d0933a774fd26ec4974b116d4da`; the PR is draft. This report
describes an uncommitted change on top of that head. The harness must attach
the resulting commit SHA and checks to Macklin's independent review. No review
was requested or verdict inferred here.

## Demonstrated repair

The credentialed workflow step exported `GH_TOKEN` for its head lookup, then
also passed it to PR-controlled Node and npm processes. It now unsets that
token after the lookup succeeds and before either process starts. This does
not isolate approved build code from its required data credentials.

The regression executes the actual YAML shell step in Bash with synthetic
command boundaries. GitHub lookup requires the synthetic token; Node and npm
must not receive it. The refactored cases also require checkout/head mismatches
to stop before either PR-controlled process executes.

- Red: `npm test -- lib/__tests__/videos-workflow-security.test.ts` exited 1;
  Node received `synthetic-github-token` instead of an unset token.
- Green: the same command exited 0 after the one-line workflow repair.
- Refactor: parameterized the shell harness for matching, changed-checkout,
  and changed-live-head cases; formatted it and added the required test
  `NODE_ENV` type field. `npm test -- lib/__tests__/videos-workflow-security.test.ts lib/__tests__/verify-videos.test.ts`
  passed all 33 tests, including child-environment and minimized-report checks.
- Configured checks: `npm ci`, `npm run lint`, and `npm run type-check`
  exited 0; `npm test` passed 343 tests with one skip. The first type-check
  caught the missing test-environment type field; the corrected rerun passed.
  Installation reported 39 dependency vulnerabilities; dependencies were not
  changed in this repair.

## Live inspection and remaining release blockers

Read-only GitHub REST requests confirmed that the workflow at the observed PR
head matches the local pre-repair file. Its three action SHAs resolve in their
upstream repositories:

- checkout: `11d5960a326750d5838078e36cf38b85af677262`
- setup-node: `49933ea5288caeca8642d1e84afbd3f7d6820020`
- upload-artifact: `ea165f8d65b6e75b540449e92b4886f43607fa02`

Resolution establishes provenance, not an independent security review of
those actions. Their review remains part of Macklin's gate.

`GET /repos/foxleigh81/foxyslab-website/environments/videos-verification`
returned 404. `GET /repos/foxleigh81/foxyslab-website/actions/secrets` returned
401 (authentication required). No secret values were fetched. These responses
cannot establish required independent reviewers, prevention of self-review,
administrator bypass restrictions, deployment branch rules, or absence of
equivalent repository/organization secrets. Renaming secret references and
selecting an environment in YAML do not establish those protections.

The workflow content request with `ref=main` also returned 404, while the
exact PR head returned the file. The declared workflow only runs on `main`;
an approved default-branch dispatch path is therefore not demonstrated.
An authorized operator must establish that path and supply inspectable
environment and secret-name inventories before credentialed execution.

The shell checks bind execution to the supplied SHA, but cannot prove that
an independent reviewer approved that SHA. The operator must record approval
of the exact changed head before credential release. No GitHub settings were
changed from this sandbox.

`npm run verify:videos` exited 1 before building because all three required
data credentials are absent. A valid-credential build, populated browser
checks, three mobile CLS/LCP measurements, and changed-head review evidence
remain outstanding. Historical instructions to use repository Actions data
secrets are not an approved release path; the environment gate and absence
of equivalent unapproved secrets must first be independently established.
