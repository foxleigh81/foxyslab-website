import { describe, expect, it } from "vitest";
import { selectPlaylist } from "../../e2e/helpers/videos-fixture";

const all = { value: "", text: "All videos" };
const empty = { value: "empty", text: "Empty (0)" };
const populated = { value: "tutorials", text: "Tutorials (12)" };

describe("gallery browser fixture selection", () => {
  it("selects a populated playlist instead of assuming the second option exists", () => {
    expect(selectPlaylist([all, empty, populated])).toBe("tutorials");
  });

  it.each([
    { name: "missing control", options: [] },
    { name: "no playlists", options: [all] },
    { name: "empty playlist", options: [all, empty] },
  ])("reports unavailable populated data immediately: $name", ({ options }) => {
    expect(() => selectPlaylist(options)).toThrow(
      /populated playlist.*YouTube/i
    );
  });

  it("uses the requested known playlist", () => {
    expect(
      selectPlaylist(
        [all, populated, { value: "smart-home", text: "Smart home (3)" }],
        "smart-home"
      )
    ).toBe("smart-home");
  });

  it("diagnoses an unavailable requested fixture without falling back", () => {
    expect(() => selectPlaylist([all, populated], "missing")).toThrow(
      /VIDEOS_PLAYLIST_SLUG/
    );
  });
});
