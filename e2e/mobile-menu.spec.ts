import { test, expect } from "@playwright/test";
import { gotoPage, waitForHydration } from "./helpers";

test.describe("Mobile Menu", () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14

  test("menu is usable while a decorative image is still loading", async ({
    page,
  }) => {
    let releaseImage!: () => void;
    const imageReady = new Promise<void>((resolve) => {
      releaseImage = resolve;
    });
    let imageRequested = false;
    await page.route("**/_next/image?*", async (route) => {
      imageRequested = true;
      await imageReady;
      await route.abort();
    });

    try {
      page.setDefaultNavigationTimeout(15_000);
      await gotoPage(page, "/");
      await waitForHydration(page, 'button[aria-label="Open menu"]');
      expect(imageRequested).toBe(true);
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(
        page.getByRole("button", { name: "Close menu" })
      ).toHaveAttribute("aria-expanded", "true");
    } finally {
      releaseImage();
      await page.unrouteAll({ behavior: "wait" });
    }
  });

  test("toggle button opens and closes menu", async ({ page }) => {
    await gotoPage(page, "/");
    await waitForHydration(page, 'button[aria-label="Open menu"]');

    const openBtn = page.getByRole("button", { name: "Open menu" });
    await expect(openBtn).toBeVisible();
    await expect(openBtn).toHaveAttribute("aria-expanded", "false");

    await openBtn.click();
    const closeBtn = page.getByRole("button", { name: "Close menu" });
    await expect(closeBtn).toHaveAttribute("aria-expanded", "true");

    await closeBtn.click();
    await expect(openBtn).toHaveAttribute("aria-expanded", "false");
  });

  test("menu links navigate to pages", async ({ page }) => {
    await gotoPage(page, "/");
    await waitForHydration(page, 'button[aria-label="Open menu"]');

    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByTestId("mobile-menu")
      .getByRole("link", { name: "About", exact: true })
      .click();

    await expect(page).toHaveURL(/\/about/);
  });

  test("menu closes after link click", async ({ page }) => {
    await gotoPage(page, "/");
    await waitForHydration(page, 'button[aria-label="Open menu"]');

    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    await page
      .getByTestId("mobile-menu")
      .getByRole("link", { name: "About", exact: true })
      .click();

    // After navigation, menu should be closed
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
