import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers";

test.describe("populated video gallery", () => {
  test.skip(
    process.env.YOUTUBE_TEST_FIXTURES !== "1",
    "Requires deterministic YouTube data"
  );

  test("keeps search, playlists and pagination working with a populated gallery", async ({
    page,
  }) => {
    await page.goto("/videos");
    await expect(page.locator("article")).toHaveCount(12);
    await waitForHydration(page, 'input[type="search"]');
    await page.getByRole("searchbox").fill("quiet homelab");
    await expect(page.locator("article")).toHaveCount(9);
    await page.getByRole("button", { name: /clear search/i }).click();
    await page.getByRole("button", { name: "Page 2" }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.locator("article")).toHaveCount(12);
    await page.getByLabel("Playlist").selectOption("smart-home");
    await expect(page).toHaveURL(/playlist=smart-home/);
    await expect(page.getByRole("status")).toContainText("18 videos");
  });
});
