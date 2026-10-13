export function selectPlaylist(
  options: { value: string; text: string }[],
  requested?: string
): string {
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
