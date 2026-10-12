import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const directory = ".lighthouseci";
const files = (await readdir(directory)).filter((name) => /^lhr-.*\.json$/.test(name)).sort();
const runs = [];
for (const name of files) {
  const report = JSON.parse(await readFile(path.join(directory, name), "utf8"));
  if (new URL(report.finalUrl).pathname !== "/videos") continue;
  const lcp = report.audits["largest-contentful-paint"]?.numericValue;
  const cls = report.audits["cumulative-layout-shift"]?.numericValue;
  if (!Number.isFinite(lcp) || !Number.isFinite(cls)) throw new Error(`Missing gallery web vitals in ${name}`);
  runs.push({ lcp, cls });
}
if (runs.length < 3) throw new Error(`Expected three gallery Lighthouse runs, found ${runs.length}`);
console.log(`Populated /videos Lighthouse: ${runs.slice(-3).map((run) => `LCP ${Math.round(run.lcp)}ms, CLS ${run.cls.toFixed(3)}`).join(" | ")}`);
