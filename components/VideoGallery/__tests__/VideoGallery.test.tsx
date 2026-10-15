import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { VideoGallery } from "../index";
import { mockVideo, mockVideo2 } from "@/test/fixtures/youtube";
import type { YouTubeVideo } from "@/types/youtube";

function buildVideos(count: number): YouTubeVideo[] {
  return Array.from({ length: count }, (_, i) => ({
    ...mockVideo,
    id: `video-${i}`,
    title: `Video ${i + 1}`,
  }));
}

const playlists = [
  { id: "PL1", title: "Tutorials", slug: "tutorials", itemCount: 2 },
  { id: "PL2", title: "Reviews", slug: "reviews", itemCount: 1 },
];

const playlistVideoMap: Record<string, string[]> = {
  PL1: [mockVideo.id, mockVideo2.id],
  PL2: [mockVideo2.id],
};

const playlistSlugMap: Record<string, string> = {
  tutorials: "PL1",
  reviews: "PL2",
};

const defaultProps = {
  activeSlug: null,
  pageParam: null,
  videos: [mockVideo, mockVideo2],
  playlists,
  playlistVideoMap,
  playlistSlugMap,
};

describe("VideoGallery", () => {
  it("renders all videos when no playlist is selected", () => {
    render(<VideoGallery {...defaultProps} />);

    expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
    expect(screen.getByText(mockVideo2.title)).toBeInTheDocument();
  });

  it("renders page header with 'All Videos' when no filter active", () => {
    render(<VideoGallery {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "All Videos" })
    ).toBeInTheDocument();
  });

  it("filters videos when playlist slug is in URL", () => {
    const urlProps = { activeSlug: "reviews" };

    render(<VideoGallery {...defaultProps} {...urlProps} />);

    expect(screen.getByText(mockVideo2.title)).toBeInTheDocument();
    expect(screen.queryByText(mockVideo.title)).not.toBeInTheDocument();
  });

  it("shows all videos when URL contains an invalid slug", () => {
    const urlProps = { activeSlug: "nonexistent" };

    render(<VideoGallery {...defaultProps} {...urlProps} />);

    expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
    expect(screen.getByText(mockVideo2.title)).toBeInTheDocument();
  });

  it("calls router.push with slug when playlist is selected", async () => {
    const user = userEvent.setup();
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });

    render(<VideoGallery {...defaultProps} />);

    // The filter is a select now rather than a row of toggle pills.
    await user.selectOptions(screen.getByLabelText("Playlist"), ["tutorials"]);

    expect(mockPush).toHaveBeenCalledWith("/videos?playlist=tutorials", {
      scroll: false,
    });
  });

  it("does not show pagination when 12 or fewer videos", () => {
    render(<VideoGallery {...defaultProps} />);

    expect(
      screen.queryByRole("navigation", { name: "Video pagination" })
    ).not.toBeInTheDocument();
  });

  it("shows pagination when more than 12 videos", () => {
    const manyVideos = buildVideos(15);

    render(
      <VideoGallery
        {...defaultProps}
        videos={manyVideos}
        playlistVideoMap={{}}
        playlistSlugMap={{}}
      />
    );

    expect(
      screen.getByRole("navigation", { name: "Video pagination" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Page 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Page 2")).toBeInTheDocument();
  });

  it("shows empty state when filtered playlist has no matching videos", () => {
    const urlProps = { activeSlug: "tutorials" };

    render(
      <VideoGallery
        {...defaultProps}
        {...urlProps}
        videos={[]}
        playlistVideoMap={{ PL1: ["nonexistent"] }}
      />
    );

    expect(
      screen.getByText("No videos in this playlist yet")
    ).toBeInTheDocument();
  });

  it("keeps the search query when navigation supplies a new page", async () => {
    const user = userEvent.setup();
    const videos = buildVideos(25);
    const { rerender } = render(
      <VideoGallery {...defaultProps} videos={videos} />
    );
    await user.type(screen.getByRole("searchbox"), "Video");

    rerender(<VideoGallery {...defaultProps} videos={videos} pageParam="2" />);

    expect(screen.getByRole("searchbox")).toHaveValue("Video");
    expect(screen.getByRole("heading", { name: "Video 13" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Video 1" })).toBeNull();
    expect(screen.getByLabelText("Page 2")).toHaveAttribute(
      "aria-current",
      "page"
    );

    await user.type(screen.getByRole("searchbox"), " 25");
    expect(screen.getByRole("heading", { name: "Video 25" })).toBeVisible();
  });

  /*
   * The filter runs over the video list already in the browser rather than an
   * index built at deploy time, which is what keeps results as fresh as the
   * page. These cover the behaviour that decides whether it feels like a search
   * box or an annoyance.
   */
  describe("text filter", () => {
    it("says how many videos are being filtered", () => {
      // The count that matters is the pool available to search, not the live
      // result count — the placeholder is only visible while the box is empty.
      render(<VideoGallery {...defaultProps} />);

      expect(screen.getByRole("searchbox")).toHaveAttribute(
        "placeholder",
        "Search 2 videos"
      );
    });

    it("keeps announcing the count after the visible one was removed", async () => {
      // Sighted users see the grid change; without this live region, screen
      // reader users would get nothing until they went looking.
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "lighting");

      expect(screen.getByRole("status")).toHaveTextContent("1 video of 2");
    });

    it("does not call a query-filtered count the playlist total", async () => {
      // "N videos in this playlist" stops being true the moment someone types.
      const user = userEvent.setup();
      const urlProps = { activeSlug: "tutorials" };
      render(<VideoGallery {...defaultProps} {...urlProps} />);

      await user.type(screen.getByRole("searchbox"), "lighting");

      expect(screen.queryByText(/videos in this playlist/i)).toBeNull();
      expect(screen.getByText(/matches "lighting"/i)).toBeInTheDocument();
    });

    it("says the search found nothing, not that the playlist is empty", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "qqqzzz");

      expect(screen.getByText(/no videos match "qqqzzz"/i)).toBeInTheDocument();
      expect(screen.queryByText(/no videos in this playlist/i)).toBeNull();
    });

    it("offers a way out of a search that found nothing", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "qqqzzz");

      // Two controls legitimately clear the search — the one in the field and
      // the one offered alongside the no-results message. This is the latter.
      const [, emptyStateClear] = screen.getAllByRole("button", {
        name: /clear search/i,
      });
      await user.click(emptyStateClear);

      expect(screen.getByRole("searchbox")).toHaveValue("");
      expect(
        screen.getByText("Getting Started with Home Assistant")
      ).toBeInTheDocument();
    });

    it("leaves the playlist control unset for an unknown slug", () => {
      // The grid falls back to showing everything; the control should agree
      // rather than sitting blank with no option matching.
      const urlProps = { activeSlug: "does-not-exist" };
      render(<VideoGallery {...defaultProps} {...urlProps} />);

      expect(screen.getByLabelText("Playlist")).toHaveValue("");
    });

    it("narrows the list as you type", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "lighting");

      expect(screen.getByText("Smart Lighting Guide")).toBeInTheDocument();
      expect(
        screen.queryByText("Getting Started with Home Assistant")
      ).not.toBeInTheDocument();
    });

    it("matches each word separately rather than the whole phrase", async () => {
      // "assistant home" appears in no title in that order. Requiring the
      // phrase contiguously meant real queries returned nothing.
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "assistant home");

      expect(
        screen.getByText("Getting Started with Home Assistant")
      ).toBeInTheDocument();
    });

    it("searches descriptions, not just titles", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "from scratch");

      expect(
        screen.getByText("Getting Started with Home Assistant")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Smart Lighting Guide")
      ).not.toBeInTheDocument();
    });

    it("ignores case", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "SMART LIGHTING");

      expect(screen.getByText("Smart Lighting Guide")).toBeInTheDocument();
    });

    it("announces the result count", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      expect(screen.getByRole("status")).toHaveTextContent("2 videos");

      await user.type(screen.getByRole("searchbox"), "lighting");

      expect(screen.getByRole("status")).toHaveTextContent("1 video of 2");
    });

    it("restores everything when cleared", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "lighting");
      await user.click(screen.getByRole("button", { name: /clear/i }));

      expect(
        screen.getByText("Getting Started with Home Assistant")
      ).toBeInTheDocument();
      expect(screen.getByRole("searchbox")).toHaveValue("");
    });

    it("shows no clear button until there is something to clear", () => {
      render(<VideoGallery {...defaultProps} />);
      expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
    });

    it("handles a query matching nothing", async () => {
      const user = userEvent.setup();
      render(<VideoGallery {...defaultProps} />);

      await user.type(screen.getByRole("searchbox"), "qqqzzz");

      expect(screen.getByRole("status")).toHaveTextContent("0 videos of 2");
      expect(
        screen.queryByText("Smart Lighting Guide")
      ).not.toBeInTheDocument();
    });
  });
});
