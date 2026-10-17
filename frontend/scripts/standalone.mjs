import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const artifactsDir = fileURLToPath(
  new URL("../../artifacts/", import.meta.url),
);
let html = await fs.readFile(path.join(distDir, "index.html"), "utf8");
const script = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const style = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/);
if (!script || !style)
  throw new Error("Build sem os assets esperados; HTML anterior preservado.");
// Reunite the hosted chunks so the downloadable HTML has no module imports.
const bundled = await build({
  entryPoints: [path.resolve(distDir, script[1])],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: "es2022",
  minify: true,
  legalComments: "inline",
  metafile: true,
});
// Motion retains an optional require wrapped in try/catch. It does not request a browser module.
// Unresolved ESM imports would break the standalone file and must fail the build.
if (
  Object.values(bundled.metafile.outputs).some((output) =>
    output.imports.some(
      (item) =>
        item.external &&
        !(
          item.kind === "require-call" && item.path === "@emotion/is-prop-valid"
        ),
    ),
  )
)
  throw new Error("HTML independente contém um módulo externo.");
const js = bundled.outputFiles[0].text;
html = html.replace(/<link\b(?=[^>]*\brel="modulepreload")[^>]*>/g, "");
const css = await fs.readFile(path.join(distDir, style[1]), "utf8");
html = html
  .replace(
    script[0],
    () =>
      `<script type="module">${js.replaceAll("</script", "<\\/script")}</script>`,
  )
  .replace(
    style[0],
    () => `<style>${css.replaceAll("</style", "<\\/style")}</style>`,
  );
html = html.replace(
  /href="(?:\.\/|\/)?favicon.svg"/,
  `href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='9' fill='%23c3e99a'/%3E%3Cpath d='M11 10v19m8-21v21m6-17 5 17M8 32h25' stroke='%23263d20' stroke-width='3'/%3E%3C/svg%3E"`,
);
await fs.mkdir(artifactsDir, { recursive: true });
await fs.writeFile(path.join(artifactsDir, "GitHub Bookshelf.html.tmp"), html);
await fs.rename(
  path.join(artifactsDir, "GitHub Bookshelf.html.tmp"),
  path.join(artifactsDir, "GitHub Bookshelf.html"),
);
console.log(
  `HTML independente criado: ${Math.round(Buffer.byteLength(html) / 1024)} KB`,
);
