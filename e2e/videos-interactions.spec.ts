import { test, expect } from "@playwright/test";
import {
  checkPopulatedInteractions,
  type VideoOutcome,
} from "./helpers/videos-fixture";
import type { Page } from "@playwright/test";

// Synthetic DOM exercises the verifier, not the live application or its data.
async function fixture(
  page: Page,
  count: number,
  brokenSearch = false,
  missingPagination = false,
  brokenBack = false,
  brokenPlaylist = false
) {
  await page.route("**/videos*", (route) => {
    const url = new URL(route.request().url());
    const playlist = url.searchParams.get("playlist") === "tutorials";
    const current = Number(url.searchParams.get("page") || 1);
    const titles = Array.from(
      { length: playlist ? Math.min(13, count) : count },
      (_, i) => `Synthetic video ${i + 1}`
    );
    const shownPage =
      brokenBack && url.searchParams.get("page") === "1" ? 2 : current;
    const cards = titles
      .slice((shownPage - 1) * 12, shownPage * 12)
      .map(
        (title) =>
          `<article><h2>${title}</h2><img fetchpriority="high" alt="thumbnail" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"></article>`
      )
      .join("");
    return route.fulfill({
      contentType: "text/html",
      body: `<main data-videos-state="populated">
      <h1>${playlist ? "Tutorials" : "All Videos"}</h1>
      <input type="search" aria-label="Search videos" placeholder="Search ${titles.length} videos"><button id="clear">Clear search</button>
      <label>Playlist<select aria-label="Playlist"><option value="">All videos</option><option value="tutorials" ${playlist ? "selected" : ""}>Tutorials (${Math.min(13, count)})</option></select></label>
      <div id="cards">${cards}</div>
      ${titles.length > 12 && !missingPagination ? `<button aria-label="Previous page" ${current === 1 ? "disabled" : ""} onclick="go(${current - 1})">Prev</button><button aria-label="Next page" ${current * 12 >= titles.length ? "disabled" : ""} onclick="go(${current + 1})">Next</button>` : ""}
      <script>
        function go(page) { const u = new URL(location.href); u.searchParams.set('page', page); location.href = u; }
        document.querySelector('select').onchange = e => { if (${brokenPlaylist}) return; location.href = '/videos?playlist=' + e.target.value; };
        const original = document.querySelector('#cards').innerHTML;
        document.querySelector('input').oninput = e => { if (${brokenSearch}) return; document.querySelector('#cards').innerHTML = original; for (const card of document.querySelectorAll('article')) if (!card.textContent.toLowerCase().includes(e.target.value.toLowerCase())) card.remove(); };
        document.querySelector('#clear').onclick = () => { document.querySelector('input').value = ''; document.querySelector('#cards').innerHTML = original; };
      </script></main>`,
    });
  });
}

for (const count of [1, 25]) {
  test(`interaction verifier records bounded outcomes for ${count} synthetic videos`, async ({
    page,
  }) => {
    await fixture(page, count);
    const outcomes: VideoOutcome[] = [];
    await checkPopulatedInteractions(page, (outcome) => outcomes.push(outcome));
    expect(outcomes).toEqual([
      {
        source: "live",
        check: "thumbnail-priority",
        outcome: "observed",
        fetchPriority: "high",
      },
      { source: "live", check: "search", outcome: "passed" },
      {
        source: "live",
        check: "pagination-forward",
        outcome: count > 12 ? "passed" : "not-applicable",
      },
      {
        source: "live",
        check: "pagination-back",
        outcome: count > 12 ? "passed" : "not-applicable",
      },
      { source: "live", check: "playlist-selection", outcome: "passed" },
      { source: "live", check: "direct-playlist", outcome: "passed" },
    ]);
  });
}

test("broken populated search records failure, never a passed outcome", async ({
  page,
}) => {
  await fixture(page, 25, true);
  const outcomes: VideoOutcome[] = [];
  await expect(
    checkPopulatedInteractions(page, (outcome) => outcomes.push(outcome))
  ).rejects.toThrow("Populated gallery check failed: search");
  expect(outcomes.at(-1)).toEqual({
    source: "live",
    check: "search",
    outcome: "failed",
  });
  expect(JSON.stringify(outcomes)).not.toContain("Synthetic video");
});

test("pagination-back failure reports URL and rendered state without titles", async ({
  page,
}) => {
  await fixture(page, 25, false, false, true);
  const outcomes: VideoOutcome[] = [];
  await expect(
    checkPopulatedInteractions(page, (outcome) => outcomes.push(outcome))
  ).rejects.toThrow("Populated gallery check failed: pagination-back");
  expect(outcomes.at(-1)).toEqual({
    source: "live",
    check: "pagination-back",
    outcome: "failed",
    diagnostic: {
      urlPage: 1,
      activePage: null,
      cards: 12,
      matchesInitial: false,
    },
  });
  expect(JSON.stringify(outcomes)).not.toContain("Synthetic video");
});

test("playlist failure reports bounded URL and control state", async ({
  page,
}) => {
  await fixture(page, 25, false, false, false, true);
  const outcomes: VideoOutcome[] = [];
  await expect(
    checkPopulatedInteractions(page, (outcome) => outcomes.push(outcome))
  ).rejects.toThrow("Populated gallery check failed: playlist-selection");
  expect(outcomes.at(-1)).toEqual({
    source: "live",
    check: "playlist-selection",
    outcome: "failed",
    diagnostic: { cards: 12, urlHasPlaylist: false, controlMatchesUrl: false },
  });
  expect(JSON.stringify(outcomes)).not.toContain("Synthetic video");
});

test("missing pagination on a multi-page dataset is a failure, not inapplicable", async ({
  page,
}) => {
  await fixture(page, 25, false, true);
  const outcomes: VideoOutcome[] = [];
  await expect(
    checkPopulatedInteractions(page, (outcome) => outcomes.push(outcome))
  ).rejects.toThrow("Populated gallery check failed: pagination-forward");
  expect(outcomes.at(-1)).toEqual({
    source: "live",
    check: "pagination-forward",
    outcome: "failed",
    diagnostic: {
      urlPage: 1,
      activePage: null,
      cards: 12,
      matchesInitial: true,
    },
  });
});
