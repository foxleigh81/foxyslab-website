import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { useSearchParams } from "next/navigation";
import VideosPage from "../page";
import {
  getLatestVideos,
  getPlaylists,
  getPlaylistVideoIds,
} from "@/lib/youtube";
import { mockVideo, mockPlaylist } from "@/test/fixtures/youtube";
import { writeFileSync } from "node:fs";
import path from "node:path";

vi.mock("@/lib/blog", () => ({ getArticleSlugsByVideoId: async () => ({}) }));
vi.mock("@/lib/youtube", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/youtube")>()),
  getLatestVideos: vi.fn(),
  getPlaylists: vi.fn(),
  getPlaylistVideoIds: vi.fn(),
}));

const videos = Array.from({ length: 25 }, (_, index) => ({
  ...mockVideo,
  id: `video-${index + 1}`,
  title: `Tutorial ${index + 1}`,
}));

async function initialMarkup(params: Record<string, string | string[]> = {}) {
  const page = await VideosPage({ searchParams: Promise.resolve(params) });
  const document = window.document.createElement("div");
  document.innerHTML = renderToString(page);
  return document;
}

beforeEach(() => {
  vi.mocked(getLatestVideos).mockResolvedValue({ success: true, data: videos });
  vi.mocked(getPlaylists).mockResolvedValue({
    success: true,
    data: [mockPlaylist],
  });
  vi.mocked(getPlaylistVideoIds).mockResolvedValue({
    success: true,
    data: videos.slice(12).map((video) => video.id),
  });
  // Model Next's static-render bailout instead of the global hook mock,
  // which incorrectly makes URL state available during prerendering.
  vi.mocked(useSearchParams).mockImplementation(() => {
    throw new Promise(() => {});
  });
});

describe("initial videos layout", () => {
  it.each(["populated", "empty", "fetch-failed"])(
    "exposes only the bounded server data state: %s",
    async (state) => {
      vi.mocked(getLatestVideos).mockResolvedValue(
        state === "fetch-failed"
          ? { success: false, error: "synthetic49-private-response" }
          : { success: true, data: state === "empty" ? [] : videos }
      );
      const markup = await initialMarkup();
      expect(
        markup
          .querySelector("[data-videos-state]")
          ?.getAttribute("data-videos-state")
      ).toBe(state);
      expect(markup.innerHTML).not.toContain("synthetic49-private-response");
      if (state !== "populated") {
        expect(markup.querySelectorAll("article")).toHaveLength(0);
        expect(markup.textContent).toContain(
          state === "empty"
            ? "No videos in this playlist yet"
            : "Unable to load videos right now"
        );
        // Browser verification consumes actual server markup with mocked data,
        // never a live API response. The runner deletes these after use.
        if (process.env.VIDEOS_STATE_FIXTURE_DIR) {
          writeFileSync(
            path.join(process.env.VIDEOS_STATE_FIXTURE_DIR, `${state}.html`),
            `<main>${markup.innerHTML}</main>`
          );
        }
      }
    }
  );
  it.each([
    [{}, "All Videos", "Tutorial 1", 12],
    [
      { playlist: "home-assistant-tutorials" },
      mockPlaylist.title,
      "Tutorial 13",
      12,
    ],
    [
      { playlist: "home-assistant-tutorials", page: "2" },
      mockPlaylist.title,
      "Tutorial 25",
      1,
    ],
    [{ playlist: "unknown", page: "invalid" }, "All Videos", "Tutorial 1", 12],
    [
      { playlist: ["home-assistant-tutorials", "unknown"], page: ["2", "1"] },
      mockPlaylist.title,
      "Tutorial 25",
      1,
    ],
  ])("renders URL %j before hydration", async (params, title, first, count) => {
    const markup = await initialMarkup(params);
    expect(markup.querySelectorAll("h2")).toHaveLength(count);
    expect(markup.querySelector("h2")?.textContent).toBe(first);
    expect(markup.querySelector("h1")?.textContent).toBe(title);
    expect(markup.querySelector('input[type="search"]')).not.toBeNull();
  });

  it("renders the empty state before hydration", async () => {
    vi.mocked(getLatestVideos).mockResolvedValue({ success: true, data: [] });
    expect((await initialMarkup()).textContent).toContain(
      "No videos in this playlist yet"
    );
  });

  it("renders a retry link when video loading fails", async () => {
    vi.mocked(getLatestVideos).mockResolvedValue({
      success: false,
      error: "Unavailable",
    });
    const markup = await initialMarkup();
    expect(markup.textContent).toContain("Unable to load videos right now");
    expect(markup.querySelector('a[href="/videos"]')?.textContent).toBe(
      "Try Again"
    );
  });
});
