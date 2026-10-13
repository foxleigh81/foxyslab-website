import { describe, expect, it, vi } from "vitest";
import type { Page } from "@playwright/test";
import { gotoVideosPage } from "../../e2e/helpers/videos-fixture";

describe("videos fixture navigation", () => {
  it("diagnoses a failed videos navigation as unavailable fixture data", async () => {
    const page = {
      goto: vi.fn().mockRejectedValue(new Error("Navigation timeout")),
    } as unknown as Page;

    await expect(gotoVideosPage(page, "/videos")).rejects.toThrow(
      /Gallery fixture\/data unavailable:.*navigation/i
    );
  });

  it("starts direct playlist navigation before blocked scripts load", async () => {
    const goto = vi.fn().mockResolvedValue(null);
    const page = { goto } as unknown as Page;

    await gotoVideosPage(page, "/videos?playlist=tutorials", "commit");

    expect(goto).toHaveBeenCalledWith("/videos?playlist=tutorials", {
      waitUntil: "commit",
    });
  });
});
