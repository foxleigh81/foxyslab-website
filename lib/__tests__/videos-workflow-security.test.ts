import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { expect, it } from "vitest";

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
