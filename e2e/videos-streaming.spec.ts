import { test, expect } from "@playwright/test";
import {
  gotoVideosPage,
  observeGallery,
  selectPlaylist,
} from "./helpers/videos-fixture";

test("permanently misplaced cards remain a diagnosed failure", async ({
  page,
}) => {
  await page.route("**/videos", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<main></main><div hidden data-videos-state="populated"><article><h2>Video</h2></article></div>',
    })
  );
  const response = await gotoVideosPage(page, "/videos");
  expect(response?.status()).toBe(200);
  const rendered = await page.evaluate(observeGallery);
  expect(rendered.cards).toBe(0);
  expect(rendered.documentCards).toBe(1);
  expect(() =>
    selectPlaylist(
      [{ value: "tutorial", text: "Tutorial (1)" }],
      undefined,
      rendered.headings
    )
  ).toThrow(/no rendered video cards/);
});

for (const state of ["empty", "fetch-failed"]) {
  test(`navigation preserves the ${state} state`, async ({ page }) => {
    test.setTimeout(3000);
    await page.route("**/videos", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<main><div data-videos-state="${state}">No cards</div></main>`,
      })
    );
    await gotoVideosPage(page, "/videos");
    expect((await page.evaluate(observeGallery)).state).toBe(state);
  });
}

test("navigation waits for streamed cards to enter main", async ({ page }) => {
  const marker = "synthetic51-private";
  await page.route("**/videos", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<main></main><div hidden id="stream"><div data-videos-state="populated"><article><h2>${marker}</h2></article></div></div>
        <script>addEventListener('DOMContentLoaded', () => setTimeout(() => {
          document.querySelector('main').append(document.querySelector('[data-videos-state]'));
        }, 250));</script>`,
    })
  );
  const response = await gotoVideosPage(page, "/videos");
  const parsed = await page.evaluate(observeGallery, await response!.text());
  const rendered = await page.evaluate(observeGallery);
  expect(parsed.cards).toBe(0);
  expect(parsed.documentCards).toBe(1);
  expect(rendered.cards).toBe(1);
  expect(rendered.documentCards).toBe(1);
  expect(JSON.stringify({ parsed, rendered })).not.toContain(marker);
});
