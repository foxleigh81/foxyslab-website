// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { expect, it } from "vitest";
import localFontLoader from "next/dist/compiled/@next/font/dist/local/loader";

it("builds every Poppins weight from bundled fonts without a Google Fonts request", async () => {
  const filename = path.resolve("app/layout.tsx");
  const source = ts.createSourceFile(
    filename,
    fs.readFileSync(filename, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  let fontCall: ts.CallExpression | undefined;
  function visit(node: ts.Node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText(source) === "poppins" &&
      node.initializer &&
      ts.isCallExpression(node.initializer)
    ) {
      fontCall = node.initializer;
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  expect(fontCall?.expression.getText(source)).toBe("localFont");

  // Exercise Next's actual loader with the layout's literal font options.
  const options = runInNewContext(
    `(${fontCall!.arguments[0].getText(source)})`
  );
  const emitted: Buffer[] = [];
  const result = await localFontLoader({
    functionName: "",
    variableName: "poppins",
    data: [options],
    isDev: false,
    isServer: true,
    loaderContext: { fs },
    resolve: (file: string) => path.resolve(path.dirname(filename), file),
    emitFontFile: (content: Buffer) => {
      emitted.push(content);
      return `/_next/static/media/font-${emitted.length}.woff2`;
    },
  });
  expect(emitted).toHaveLength(6);
  for (const content of emitted) {
    expect(content.subarray(0, 4).toString()).toBe("wOF2");
  }
  for (const weight of [300, 400, 500, 600, 700, 900]) {
    expect(result.css).toContain(`font-weight: ${weight};`);
  }
  expect(result.variable).toBe("--font-poppins");
  expect(result.css).toContain("font-display: swap;");
  expect(result.adjustFontFallback).toBeDefined();
  expect(result.css).not.toMatch(/https?:/);
});
