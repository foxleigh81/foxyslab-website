import type { Page } from "@playwright/test";

const settledGallerySelector = [
  "main article",
  'main [data-videos-state="empty"]',
  'main [data-videos-state="fetch-failed"]',
].join(", ");

// Runs inside page.evaluate: return only bounded observations, never text,
// URLs, response bodies, or exception messages from the credentialed page.
export function observeGallery(html?: string) {
  // Parse the completed HTTP response inertly; never execute its scripts.
  const root =
    html === undefined
      ? document
      : new DOMParser().parseFromString(html, "text/html");
  const rawState = root
    .querySelector("[data-videos-state]")
    ?.getAttribute("data-videos-state");
  const state = ["populated", "empty", "fetch-failed"].includes(rawState ?? "")
    ? rawState
    : null;
  const count = (selector: string) =>
    Math.min(200, root.querySelectorAll(selector).length);
  return {
    state,
    cards: count("main article"),
    headings: count("main h2"),
    documentCards: count("article"),
    documentHeadings: count("h2"),
    serverError: root.querySelector("template[data-dgst]") !== null,
  };
}

export async function gotoVideosPage(
  page: Page,
  path: string,
  waitUntil: "domcontentloaded" | "commit" = "domcontentloaded"
) {
  try {
    const response = await page.goto(path, { waitUntil });
    if (waitUntil === "domcontentloaded") {
      // DOMContentLoaded can precede React's streamed boundary placement.
      // A timeout still returns the response for bounded failure diagnostics.
      await page
        .locator(settledGallerySelector)
        .first()
        .waitFor({ state: "visible", timeout: 5000 })
        .catch((error: unknown) => {
          if (!(error instanceof Error) || error.name !== "TimeoutError")
            throw error;
        });
    }
    return response;
  } catch (error) {
    throw new Error(
      "Gallery fixture/data unavailable: videos navigation failed. Check the production server and YouTube credentials.",
      { cause: error }
    );
  }
}

export const missingCardsDiagnostic =
  "Gallery fixture/data unavailable: no rendered video cards. " +
  "Check YouTube credentials and playlist membership in the latest videos.";

export function selectPlaylist(
  options: { value: string; text: string }[],
  requested: string | undefined,
  cardCount: number
): string {
  if (cardCount === 0) {
    throw new Error(missingCardsDiagnostic);
  }
  const populated = options.filter(
    // The gallery labels options with the count of matching, loaded videos.
    (option) =>
      option.value && Number(option.text.match(/\((\d+)\)\s*$/)?.[1]) > 0
  );
  const selected = requested
    ? populated.find((option) => option.value === requested)
    : populated[0];
  if (!selected) {
    throw new Error(
      "Gallery fixture/data unavailable: no populated playlist matches " +
        "VIDEOS_PLAYLIST_SLUG (or none is available for discovery). " +
        "Check YouTube credentials, playlist membership in the latest videos, " +
        "and the configured fixture slug."
    );
  }
  return selected.value;
}

export type VideoOutcome = {
  source: "live" | "fixture";
  check: string;
  outcome: "passed" | "failed" | "not-applicable" | "observed";
  fetchPriority?: string;
  diagnostic?:
    | {
        urlPage: number | null;
        activePage: number | null;
        cards: number;
        matchesInitial: boolean;
      }
    | {
        cards: number;
        urlHasPlaylist: boolean;
        controlMatchesUrl: boolean;
      };
};

export async function checkPopulatedInteractions(
  page: Page,
  record: (outcome: VideoOutcome) => void
) {
  const { expect } = await import("@playwright/test");
  let initialTitles: string[] = [];
  const check = async (name: string, action: () => Promise<void>) => {
    try {
      await action();
      record({ source: "live", check: name, outcome: "passed" });
    } catch {
      let diagnostic: VideoOutcome["diagnostic"];
      if (name.startsWith("pagination-")) {
        try {
          const currentTitles = await page
            .locator("main article h2")
            .allTextContents();
          const rawPage = new URL(page.url()).searchParams.get("page") ?? "1";
          const urlPage = Number(rawPage);
          const active = await page
            .locator('[aria-current="page"]')
            .first()
            .getAttribute("aria-label", { timeout: 1000 })
            .catch(() => null);
          const activePage = Number(active?.match(/^Page (\d+)$/)?.[1]);
          diagnostic = {
            urlPage:
              Number.isInteger(urlPage) && urlPage >= 1 && urlPage <= 17
                ? urlPage
                : null,
            activePage:
              Number.isInteger(activePage) &&
              activePage >= 1 &&
              activePage <= 17
                ? activePage
                : null,
            cards: Math.min(200, currentTitles.length),
            matchesInitial:
              currentTitles.length === initialTitles.length &&
              currentTitles.every(
                (title, index) => title === initialTitles[index]
              ),
          };
        } catch {
          // Navigation can destroy the old execution context; the check still fails.
        }
      } else if (name === "playlist-selection") {
        try {
          const slug = new URL(page.url()).searchParams.get("playlist");
          const selected = await page
            .getByLabel("Playlist", { exact: true })
            .inputValue();
          diagnostic = {
            cards: Math.min(200, await page.locator("main article").count()),
            urlHasPlaylist: Boolean(slug),
            controlMatchesUrl: Boolean(slug) && selected === slug,
          };
        } catch {
          // The page may be navigating while the failed state is inspected.
        }
      }
      record({
        source: "live",
        check: name,
        outcome: "failed",
        ...(diagnostic ? { diagnostic } : {}),
      });
      // Assertion details can include data titles and URLs.
      throw new Error(`Populated gallery check failed: ${name}`);
    }
  };
  await gotoVideosPage(page, "/videos");
  const cards = page.locator("main article h2");
  await expect(cards.first()).toBeVisible();
  const titles = await cards.allTextContents();
  initialTitles = titles;
  const image = page.locator("main article img:visible").first();
  await expect(image).toBeVisible();
  const hint = await image.getAttribute("fetchpriority");
  record({
    source: "live",
    check: "thumbnail-priority",
    outcome: "observed",
    fetchPriority:
      hint === null
        ? "absent"
        : ["high", "low", "auto"].includes(hint)
          ? hint
          : "invalid",
  });

  await check("search", async () => {
    await page.getByRole("searchbox").fill(titles[0]);
    await expect(cards.filter({ hasText: titles[0] }).first()).toBeVisible();
    await page.getByRole("searchbox").fill("no-matching-video-71");
    await expect(cards).toHaveCount(0);
    await page.getByRole("button", { name: "Clear search" }).first().click();
    await expect(cards).toHaveText(titles);
  });

  const next = page.getByRole("button", { name: "Next page", exact: true });
  const placeholder = await page
    .getByRole("searchbox")
    .getAttribute("placeholder");
  const total = Number(placeholder?.match(/^Search (\d+) videos?$/)?.[1]);
  // Only a known single-page dataset permits skipping either direction.
  if (!(total > 0 && total <= 12)) {
    await check("pagination-forward", async () => {
      expect(Number.isInteger(total) && total <= 200).toBe(true);
      await expect(next).toBeEnabled();
      await next.click();
      await expect
        .poll(() => new URL(page.url()).searchParams.get("page"))
        .toBe("2");
      await expect(cards.first()).toBeVisible();
      await expect.poll(() => cards.allTextContents()).not.toEqual(titles);
    });
    await check("pagination-back", async () => {
      await page
        .getByRole("button", { name: "Previous page", exact: true })
        .click();
      await expect
        .poll(() => new URL(page.url()).searchParams.get("page") ?? "1")
        .toBe("1");
      await expect(cards).toHaveText(titles);
    });
  } else {
    for (const direction of ["forward", "back"]) {
      record({
        source: "live",
        check: `pagination-${direction}`,
        outcome: "not-applicable",
      });
    }
  }

  const select = page.getByLabel("Playlist", { exact: true });
  let slug = "";
  let selectedTitles: string[] = [];
  await check("playlist-selection", async () => {
    const options = await select.locator("option").evaluateAll((options) =>
      options.map((option) => ({
        value: (option as HTMLOptionElement).value,
        text: option.textContent ?? "",
      }))
    );
    slug = selectPlaylist(
      options,
      process.env.VIDEOS_PLAYLIST_SLUG,
      titles.length
    );
    const option = options.find((option) => option.value === slug)!;
    const count = Number(option.text.match(/\((\d+)\)\s*$/)![1]);
    await select.selectOption(slug);
    await expect
      .poll(() => new URL(page.url()).searchParams.get("playlist"))
      .toBe(slug);
    await expect(page.locator("main h1")).toHaveText(
      option.text.replace(/\s*\(\d+\)\s*$/, "")
    );
    await expect(cards).toHaveCount(Math.min(12, count));
    await expect(select).toHaveValue(slug);
    selectedTitles = await cards.allTextContents();
  });
  await check("direct-playlist", async () => {
    await gotoVideosPage(page, "/videos");
    await gotoVideosPage(page, `/videos?playlist=${encodeURIComponent(slug)}`);
    await expect(select).toHaveValue(slug);
    await expect(cards).toHaveText(selectedTitles);
  });
}
