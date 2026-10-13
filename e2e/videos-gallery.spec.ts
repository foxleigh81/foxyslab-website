import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { selectPlaylist } from "./helpers/videos-fixture";

test.describe("Videos Page", () => {
  test("page loads with heading", async ({ page }) => {
    await page.goto("/videos");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("handles empty state gracefully", async ({ page }) => {
    await page.goto("/videos");
    // Page should load without errors even without YouTube API key
    await expect(page).toHaveTitle(/Foxy's Lab/);
  });

  test(
    "default and playlist grids keep the footer stable through hydration",
    { tag: "@production" },
    async ({ page }) => {
      test.slow();
      await page.goto("/videos");
      const options = await page
        .getByLabel("Playlist", { exact: true })
        .locator("option")
        .evaluateAll((options) =>
          options.map((option) => ({
            value: (option as HTMLOptionElement).value,
            text: option.textContent ?? "",
          }))
        );
      const slug = selectPlaylist(options, process.env.VIDEOS_PLAYLIST_SLUG);

      for (const url of [
        "/videos",
        `/videos?playlist=${encodeURIComponent(slug)}`,
      ]) {
        let releaseScripts!: () => void;
        const scriptsReady = new Promise<void>((resolve) => {
          releaseScripts = resolve;
        });
        await page.route("**/*", async (route) => {
          if (route.request().resourceType() === "script") await scriptsReady;
          await route.continue();
        });

        try {
          await page.goto(url, { waitUntil: "commit" });
          const cards = page.locator("main h2");
          await expect(cards.first()).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          const titles = await cards.allTextContents();
          const footerBefore = await page.locator("footer").boundingBox();
          expect(footerBefore).not.toBeNull();

          releaseScripts();
          await page.waitForLoadState("networkidle");
          await expect(cards).toHaveText(titles);
          const footerAfter = await page.locator("footer").boundingBox();
          expect(footerAfter).not.toBeNull();
          expect(Math.abs(footerAfter!.y - footerBefore!.y)).toBeLessThan(2);

          // A working controlled input confirms hydration has completed.
          await page.getByRole("searchbox").fill("no-matching-video-71");
          await expect(
            page.getByText('No videos match "no-matching-video-71"')
          ).toBeVisible();
          await page
            .getByRole("button", { name: "Clear search" })
            .first()
            .click();
          await expect(cards).toHaveText(titles);
          expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
            []
          );
        } finally {
          releaseScripts();
          await page.unrouteAll({ behavior: "wait" });
        }
      }
    }
  );
});
