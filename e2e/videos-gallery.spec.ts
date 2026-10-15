import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  missingCardsDiagnostic,
  observeGallery,
  selectPlaylist,
  gotoVideosPage,
} from "./helpers/videos-fixture";

test.describe("Videos Page", () => {
  test("page loads with heading", async ({ page }) => {
    await gotoVideosPage(page, "/videos");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("handles empty state gracefully", async ({ page }) => {
    await gotoVideosPage(page, "/videos");
    // Page should load without errors even without YouTube API key
    await expect(page).toHaveTitle(/Foxy's Lab/);
  });

  test(
    "default and playlist grids keep the footer stable through hydration",
    { tag: "@production" },
    async ({ page }, testInfo) => {
      test.slow();
      page.setDefaultNavigationTimeout(5000);
      const response = await gotoVideosPage(page, "/videos");
      let observation = await page.evaluate(observeGallery);
      const initial = response
        ? await page.evaluate(observeGallery, await response.text())
        : null;
      const diagnostic = {
        type: "videos-state",
        description: "",
      };
      testInfo.annotations.push(diagnostic);
      const recordAssertion = (assertion: string) => {
        diagnostic.description = JSON.stringify({
          ...observation,
          initial,
          httpStatus: response?.status(),
          assertion,
        });
      };
      recordAssertion("playlist-selection");
      const options = await page
        .getByLabel("Playlist", { exact: true })
        .locator("option")
        .evaluateAll((options) =>
          options.map((option) => ({
            value: (option as HTMLOptionElement).value,
            text: option.textContent ?? "",
          }))
        );
      observation = await page.evaluate(observeGallery);
      recordAssertion(
        observation.headings === 0 ? "initial-cards" : "playlist-selection"
      );
      const slug = selectPlaylist(
        options,
        process.env.VIDEOS_PLAYLIST_SLUG,
        observation.headings
      );

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
          recordAssertion("server-cards");
          await gotoVideosPage(page, url, "commit");
          const cards = page.locator("main h2");
          await expect(cards.first(), missingCardsDiagnostic).toBeVisible({
            timeout: 5000,
          });
          await page.evaluate(() => document.fonts.ready);
          const titles = await cards.allTextContents();
          const footerBefore = await page.locator("footer").boundingBox();
          expect(footerBefore).not.toBeNull();

          recordAssertion("hydration-layout");
          releaseScripts();
          await page.waitForLoadState("networkidle");
          await expect(cards).toHaveText(titles);
          const footerAfter = await page.locator("footer").boundingBox();
          expect(footerAfter).not.toBeNull();
          expect(Math.abs(footerAfter!.y - footerBefore!.y)).toBeLessThan(2);

          // A working controlled input confirms hydration has completed.
          recordAssertion("search");
          await page.getByRole("searchbox").fill("no-matching-video-71");
          await expect(
            page.getByText('No videos match "no-matching-video-71"')
          ).toBeVisible();
          await page
            .getByRole("button", { name: "Clear search" })
            .first()
            .click();
          await expect(cards).toHaveText(titles);
          recordAssertion("accessibility");
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
