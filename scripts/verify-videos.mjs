import { verifyVideos } from "./lib/verify-videos.mjs";

try {
  await verifyVideos();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
