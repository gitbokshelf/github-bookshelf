import fs from "node:fs/promises";
import path from "node:path";
let html = await fs.readFile("dist/index.html", "utf8");
const script = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const style = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/);
if (!script || !style)
  throw new Error("Build sem os assets esperados; HTML anterior preservado.");
const js = await fs.readFile(path.join("dist", script[1]), "utf8");
const css = await fs.readFile(path.join("dist", style[1]), "utf8");
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
await fs.writeFile("GitHub Bookshelf.html.tmp", html);
await fs.rename("GitHub Bookshelf.html.tmp", "GitHub Bookshelf.html");
console.log(
  `HTML independente criado: ${Math.round(Buffer.byteLength(html) / 1024)} KB`,
);
