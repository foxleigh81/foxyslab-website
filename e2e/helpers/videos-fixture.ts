import type { Page } from "@playwright/test";

// Runs inside page.evaluate: never collect text, attributes containing URLs,
// response bodies, or exception messages from the credentialed page.
export function observeGallery() {
  const rawState = document
    .querySelector("[data-videos-state]")
    ?.getAttribute("data-videos-state");
  const state = ["populated", "empty", "fetch-failed"].includes(rawState ?? "")
    ? rawState
    : null;
  return {
    state,
    cards: Math.min(200, document.querySelectorAll("main article").length),
    headings: Math.min(200, document.querySelectorAll("main h2").length),
  };
}

export async function gotoVideosPage(
  page: Page,
  path: string,
  waitUntil: "domcontentloaded" | "commit" = "domcontentloaded"
) {
  try {
    return await page.goto(path, { waitUntil });
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
