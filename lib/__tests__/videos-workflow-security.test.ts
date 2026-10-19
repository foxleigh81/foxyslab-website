import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { expect, it } from "vitest";

it.each(["matching", "checkout-moved", "pr-moved"])(
  "limits credentials and requires the exact head: %s",
  (scenario) => {
    const workflow = parse(
      readFileSync(".github/workflows/videos-verification.yml", "utf8")
    );
    const step = workflow.jobs.videos.steps.find(
      (item: { name?: string }) =>
        item.name === "Recheck exact head and run credentialed verification"
    );
    const directory = mkdtempSync(
      path.join(process.cwd(), ".workflow-security-")
    );
    const sha = "a".repeat(40);
    try {
      for (const [name, script] of Object.entries({
        git: 'printf "%s\\n" "$CHECKOUT_SHA"',
        gh: 'test "$GH_TOKEN" = synthetic-github-token || exit 9\nprintf "%s\\n" "$LIVE_SHA"',
        node: `
          printf 'node-token=%s\\nnode-data=%s,%s,%s\\n' \\
            "\${GH_TOKEN-unset}" "\${YOUTUBE_API_KEY-unset}" \\
            "\${FOURTHWALL_STOREFRONT_TOKEN-unset}" "\${FLAGS_SECRET-unset}" >&2
          printf /synthetic/chromium`,
        npm: `
          test "$YOUTUBE_API_KEY" = synthetic-youtube-key
          test "$FOURTHWALL_STOREFRONT_TOKEN" = synthetic-storefront-token
          test "$FLAGS_SECRET" = synthetic-flags-secret
          test "$CHROME_PATH" = /synthetic/chromium
          printf 'npm-token=%s\\n' "\${GH_TOKEN-unset}"`,
      })) {
        writeFileSync(path.join(directory, name), `#!/bin/bash -e\n${script}\n`, {
          mode: 0o700,
        });
      }
      const result = spawnSync(
        "/bin/bash",
        ["-e", "-o", "pipefail", "-c", step.run],
        {
          encoding: "utf8",
          env: {
            NODE_ENV: "test",
            PATH: directory,
            GH_TOKEN: "synthetic-github-token",
            YOUTUBE_API_KEY: "synthetic-youtube-key",
            FOURTHWALL_STOREFRONT_TOKEN: "synthetic-storefront-token",
            FLAGS_SECRET: "synthetic-flags-secret",
            EXPECTED_SHA: sha,
            CHECKOUT_SHA: scenario === "checkout-moved" ? "b".repeat(40) : sha,
            LIVE_SHA: scenario === "pr-moved" ? "b".repeat(40) : sha,
            PR_NUMBER: "79",
            GITHUB_REPOSITORY: "foxleigh81/foxyslab-website",
          },
        }
      );
      if (scenario !== "matching") {
        expect(result.status).not.toBe(0);
        expect(result.stdout + result.stderr).not.toMatch(
          /node-token|npm-token/
        );
        return;
      }
      expect(result.status).toBe(0);
      expect(result.stderr).toContain("node-token=unset");
      expect(result.stderr).toContain("node-data=unset,unset,unset");
      expect(result.stdout).toContain("npm-token=unset");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }
);

it("keeps PR-head jobs away from repository credentials", () => {
  const ci = readFileSync(".github/workflows/ci.yml", "utf8");
  const ciWorkflow = parse(ci);
  const verificationSource = readFileSync(
    ".github/workflows/videos-verification.yml",
    "utf8"
  );
  const verification = parse(verificationSource);
  expect(ci).not.toMatch(
    /secrets\.(YOUTUBE_API_KEY|FOURTHWALL_STOREFRONT_TOKEN|FLAGS_SECRET)/
  );
  const buildFlagsSecret =
    ciWorkflow.jobs["build-and-lighthouse"].env.FLAGS_SECRET;
  expect(buildFlagsSecret).toBeTypeOf("string");
  if (typeof buildFlagsSecret === "string")
    expect(Buffer.from(buildFlagsSecret, "base64url")).toHaveLength(32);
  expect(verification.on).not.toHaveProperty("pull_request");
  expect(verification.on).toHaveProperty("workflow_dispatch");
  expect(verification.jobs.videos.environment).toBe("videos-verification");
  expect(verification.jobs.videos.if).toContain("refs/heads/main");
  expect(verificationSource).toContain("github.event.inputs.expected_sha");
  expect(verificationSource).toContain("github.event.inputs.pr_number");
  for (const action of ["checkout", "setup-node", "upload-artifact"])
    expect(verificationSource).toMatch(
      new RegExp(`actions/${action}@[a-f0-9]{40}`)
    );
  expect(verificationSource).not.toMatch(
    /secrets\.(YOUTUBE_API_KEY|FOURTHWALL_STOREFRONT_TOKEN|FLAGS_SECRET)\b/
  );
});
