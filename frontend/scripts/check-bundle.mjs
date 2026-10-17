import fs from "node:fs/promises";
import { gzipSync } from "node:zlib";

const assets = new URL("../dist/assets/", import.meta.url);
const limits = { maxJavaScriptModuleBytes: 500_000, totalJavaScriptGzipBytes: 350_000 };
const files = [];
for (const name of (await fs.readdir(assets)).sort()) {
  if (!/\.(js|css)$/.test(name)) continue;
  const content = await fs.readFile(new URL(name, assets));
  files.push({ name, bytes: content.byteLength, gzipBytes: gzipSync(content).byteLength });
}
const javascript = files.filter(file => file.name.endsWith(".js"));
if (!javascript.length) throw new Error("Build sem módulos JavaScript para conferir.");
const totalJavaScriptGzipBytes = javascript.reduce((sum, file) => sum + file.gzipBytes, 0);
const failures = javascript.filter(file => file.bytes > limits.maxJavaScriptModuleBytes).map(file => `${file.name} excede o orçamento por módulo`);
if (totalJavaScriptGzipBytes > limits.totalJavaScriptGzipBytes) failures.push("JavaScript total comprimido excede o orçamento");
const report = { generatedAt: new Date().toISOString(), limits, files, totalJavaScriptGzipBytes, passed: failures.length === 0, failures };
const output = new URL("../../artifacts/", import.meta.url);
await fs.mkdir(output, { recursive: true });
await fs.writeFile(new URL("build-report.json", output), JSON.stringify(report, null, 2) + "\n");
if (failures.length) throw new Error(failures.join("; "));
console.log(`Orçamento aprovado: ${javascript.length} módulos; ${(totalJavaScriptGzipBytes / 1000).toFixed(1)} KB de JavaScript gzip. Relatório em artifacts/build-report.json.`);
