import { describe, expect, it } from "vitest";
import { youtubeFixtureEnabled, youtubeFixtureResponse } from "./youtube-api";

describe("YouTube browser fixture", () => {
  it("is available only in explicit local CI runs", () => {
    expect(youtubeFixtureEnabled({ CI: "1", YOUTUBE_TEST_FIXTURES: "1" })).toBe(
      true
    );
    expect(
      youtubeFixtureEnabled({
        CI: "1",
        YOUTUBE_TEST_FIXTURES: "1",
        VERCEL: "1",
      })
    ).toBe(false);
    expect(youtubeFixtureEnabled({ YOUTUBE_TEST_FIXTURES: "1" })).toBe(false);
  });

  it("serves enough linked videos for search, pagination and playlist tests", async () => {
    const playlist = await youtubeFixtureResponse(
      "https://www.googleapis.com/youtube/v3/playlistItems?playlistId=fixture-uploads&maxResults=50"
    ).json();
    const ids = playlist.items.map(
      (item: { snippet: { resourceId: { videoId: string } } }) =>
        item.snippet.resourceId.videoId
    );
    expect(ids).toHaveLength(36);
    const videos = await youtubeFixtureResponse(
      `https://www.googleapis.com/youtube/v3/videos?id=${ids.join(",")}`
    ).json();
    expect(videos.items).toHaveLength(36);
    expect(videos.items[0].snippet.thumbnails.high.url).toBe(
      "/images/backdrop.webp"
    );
  });
});
