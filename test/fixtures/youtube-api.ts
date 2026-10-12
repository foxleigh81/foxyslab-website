/** Deterministic YouTube API responses for browser and Lighthouse checks in CI. */
const ids = Array.from(
  { length: 36 },
  (_, i) => `studioVideo${String(i + 1).padStart(2, "0")}`
);

const titles = [
  "Home Assistant from scratch",
  "Building a quiet homelab",
  "Smart lighting without the cloud",
  "Understanding Docker containers",
];

export function youtubeFixtureEnabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  return env.CI === "1" && env.STUDIO_SITE_FIXTURES === "1" && !env.VERCEL;
}

export function youtubeFixtureResponse(rawUrl: string): Response {
  const url = new URL(rawUrl);
  if (
    url.origin !== "https://www.googleapis.com" ||
    !url.pathname.startsWith("/youtube/v3/")
  ) {
    throw new Error(`Unexpected fixture request: ${url.origin}${url.pathname}`);
  }
  const endpoint = url.pathname.split("/").at(-1);
  let body: object;
  if (endpoint === "channels") {
    body = {
      items: [
        {
          id: "studio-channel",
          snippet: {
            title: "Foxy's Lab",
            description: "Smart homes and homelabs",
            thumbnails: {},
          },
          statistics: {
            subscriberCount: "4000",
            videoCount: "36",
            viewCount: "300000",
          },
          contentDetails: { relatedPlaylists: { uploads: "studio-uploads" } },
        },
      ],
    };
  } else if (endpoint === "playlistItems") {
    const playlist = url.searchParams.get("playlistId");
    const selected =
      playlist === "studio-uploads"
        ? ids
        : playlist === "studio-home"
          ? ids.filter((_, i) => i % 2 === 0)
          : playlist === "studio-lab"
            ? ids.filter((_, i) => i % 2 === 1)
            : null;
    if (!selected) throw new Error(`Unknown fixture playlist: ${playlist}`);
    const offset = Number(url.searchParams.get("pageToken") || "0");
    const limit = Number(url.searchParams.get("maxResults") || "50");
    body = {
      items: selected
        .slice(offset, offset + limit)
        .map((videoId) => ({ snippet: { resourceId: { videoId } } })),
      ...(offset + limit < selected.length
        ? { nextPageToken: String(offset + limit) }
        : {}),
    };
  } else if (endpoint === "videos") {
    const requested = (url.searchParams.get("id") || "").split(",");
    body = {
      items: requested
        .filter((id) => ids.includes(id))
        .map((id) => {
          const index = ids.indexOf(id);
          return {
            id,
            snippet: {
              title: `${titles[index % titles.length]} - episode ${index + 1}`,
              description: "A practical guide to building a better home setup.",
              publishedAt: new Date(
                Date.UTC(2026, 8, 30 - index)
              ).toISOString(),
              thumbnails: { high: { url: "/images/backdrop.webp" } },
            },
            statistics: {
              viewCount: String(12000 - index * 100),
              likeCount: "420",
              commentCount: "32",
            },
            contentDetails: { duration: "PT12M30S" },
          };
        }),
    };
  } else if (endpoint === "playlists") {
    body = {
      items: [
        {
          id: "studio-home",
          snippet: { title: "Smart Home", description: "", thumbnails: {} },
          contentDetails: { itemCount: 18 },
        },
        {
          id: "studio-lab",
          snippet: { title: "Homelab", description: "", thumbnails: {} },
          contentDetails: { itemCount: 18 },
        },
      ],
    };
  } else {
    throw new Error(`Unknown YouTube fixture endpoint: ${endpoint}`);
  }
  return Response.json(body);
}
