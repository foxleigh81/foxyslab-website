import { describe, expect, it } from "vitest";
import {
  selectPlaylist,
  observeGallery,
} from "../../e2e/helpers/videos-fixture";

const all = { value: "", text: "All videos" };
const empty = { value: "empty", text: "Empty (0)" };
const populated = { value: "tutorials", text: "Tutorials (12)" };

describe("gallery browser fixture selection", () => {
  it("collects only bounded rendered state from credential-bearing DOM fixtures", () => {
    document.body.innerHTML =
      '<main><div data-videos-state="populated"><article><h3><a href="/?key=synthetic49">synthetic49</a></h3></article></div></main>';
    expect(observeGallery()).toEqual({
      state: "populated",
      cards: 1,
      headings: 0,
      documentCards: 1,
      documentHeadings: 0,
      serverError: false,
    });
    document
      .querySelector("[data-videos-state]")!
      .setAttribute("data-videos-state", "synthetic49");
    expect(observeGallery()).toEqual({
      state: null,
      cards: 1,
      headings: 0,
      documentCards: 1,
      documentHeadings: 0,
      serverError: false,
    });
    document.body.innerHTML = "";
  });
  it("rejects an empty rendered gallery even when playlist labels claim videos", () => {
    expect(() => selectPlaylist([all, populated], undefined, 0)).toThrow(
      /Gallery fixture\/data unavailable: no rendered video cards/
    );
  });

  it("selects a populated playlist instead of assuming the second option exists", () => {
    expect(selectPlaylist([all, empty, populated], undefined, 12)).toBe(
      "tutorials"
    );
  });

  it.each([
    { name: "missing control", options: [] },
    { name: "no playlists", options: [all] },
    { name: "empty playlist", options: [all, empty] },
  ])("reports unavailable populated data immediately: $name", ({ options }) => {
    expect(() => selectPlaylist(options, undefined, 12)).toThrow(
      /populated playlist.*YouTube/i
    );
  });

  it("uses the requested known playlist", () => {
    expect(
      selectPlaylist(
        [all, populated, { value: "smart-home", text: "Smart home (3)" }],
        "smart-home",
        12
      )
    ).toBe("smart-home");
  });

  it("diagnoses an unavailable requested fixture without falling back", () => {
    expect(() => selectPlaylist([all, populated], "missing", 12)).toThrow(
      /VIDEOS_PLAYLIST_SLUG/
    );
  });
});

describe("HTTP response versus rendered gallery observations", () => {
  it("counts streamed cards outside main without retaining synthetic credentials", () => {
    document.body.innerHTML =
      '<main></main><div hidden data-videos-state="populated"><article><h2>synthetic50</h2></article></div><template data-dgst="synthetic50"></template>';
    expect(observeGallery()).toEqual({
      state: "populated",
      cards: 0,
      headings: 0,
      documentCards: 1,
      documentHeadings: 1,
      serverError: true,
    });
    expect(JSON.stringify(observeGallery())).not.toContain("synthetic50");
    const response = document.body.innerHTML;
    document.body.innerHTML = "";
    expect(observeGallery(response)).toEqual({
      state: "populated",
      cards: 0,
      headings: 0,
      documentCards: 1,
      documentHeadings: 1,
      serverError: true,
    });
    expect(observeGallery().documentCards).toBe(0);
  });
});
