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
