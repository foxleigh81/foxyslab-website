import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const directory = process.argv[2] ?? ".lighthouseci";
const reports = (await readdir(directory)).filter((name) => /^lhr-\d+\.json$/.test(name));
if (reports.length === 0) throw new Error("No Lighthouse measurements produced");

async function numericMetrics(name) {
  let report;
  try {
    report = JSON.parse(await readFile(path.join(directory, name), "utf8"));
  } catch {
    throw new Error("Lighthouse report is invalid JSON");
  }
  const cls = report.audits?.["cumulative-layout-shift"]?.numericValue;
  const lcpMs = report.audits?.["largest-contentful-paint"]?.numericValue;
  if (report.runtimeError || !Number.isFinite(cls) || !Number.isFinite(lcpMs))
    throw new Error("Lighthouse report lacks valid numeric measurements");
  return { cls, lcpMs };
}

const runs = await Promise.all(reports.sort().map(numericMetrics));
const output = path.join(directory, "ci", "summary.json");
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ runs })}\n`);
