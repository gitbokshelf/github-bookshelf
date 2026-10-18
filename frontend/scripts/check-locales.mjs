import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import { guideList } from "../src/data/guides.ts";
const src = fileURLToPath(new URL("../src", import.meta.url));
const catalog = JSON.parse(
  fs.readFileSync(path.join(src, "data/catalog.json")),
);
const canonical = new Set();
const add = (text) => {
  if (
    typeof text === "string" &&
    /[A-Za-zÀ-ÿ]/.test(text) &&
    !/^https?:|^[\w-]+\/[\w.-]+$/.test(text)
  )
    canonical.add(text.trim());
};
for (const project of catalog.projects) {
  for (const field of ["tagline", "description", "start", "caveat", "level"])
    add(project[field]);
  project.tags.forEach(add);
}
for (const guide of guideList) {
  add(guide.title);
  add(guide.sub);
  guide.steps.flat().forEach(add);
  guide.sources.forEach(([label]) => add(label));
}
const files = fs
  .readdirSync(src, { recursive: true })
  .filter((file) => /\.(tsx|ts)$/.test(file));
const untranslated = [];
for (const file of files) {
  const source = fs.readFileSync(path.join(src, file), "utf8");
  const ast = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  function expression(node) {
    if (
      ts.isJsxElement(node) ||
      ts.isJsxSelfClosingElement(node) ||
      ts.isJsxFragment(node)
    )
      return;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      add(node.text);
      return;
    }
    if (ts.isConditionalExpression(node)) {
      expression(node.whenTrue);
      expression(node.whenFalse);
      return;
    }
    if (ts.isBinaryExpression(node)) {
      if (
        [
          ts.SyntaxKind.AmpersandAmpersandToken,
          ts.SyntaxKind.BarBarToken,
          ts.SyntaxKind.QuestionQuestionToken,
        ].includes(node.operatorToken.kind)
      )
        expression(node.right);
      return;
    }
    if (ts.isCallExpression(node)) {
      if (
        ts.isIdentifier(node.expression) &&
        node.expression.text === "translate"
      )
        return;
      return;
    }
    if (ts.isTemplateExpression(node)) return;
    ts.forEachChild(node, expression);
  }
  function visit(node) {
    if (ts.isJsxText(node) && /[A-Za-zÀ-ÿ]/.test(node.text) && !["Português","English","Español"].includes(node.text.trim())) untranslated.push(`${file}: ${node.text.trim()}`);
    if (ts.isJsxAttribute(node) && ["aria-label","title","placeholder","alt","label"].includes(node.name.getText(ast)) && node.initializer && ts.isStringLiteral(node.initializer)) untranslated.push(`${file}: ${node.initializer.text}`);
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      ["translate", "setToast", "setMessage", "setError"].includes(
        node.expression.text,
      )
    )
      node.arguments.forEach(expression);
    if (
      ts.isPropertyAssignment(node) &&
      ["label", "hint"].includes(node.name.getText(ast))
    )
      expression(node.initializer);
    ts.forEachChild(node, visit);
  }
  visit(ast);
}
if (untranslated.length) {
  console.error("Textos de interface fora do tradutor:", untranslated);
  process.exitCode = 1;
}
// IDs, marcas, tecnologias e nomes de protocolos não são traduzidos.
const identity = new Set([
  "GitHub Bookshelf",
  "English",
  "Português",
  "Español",
  "Web",
  "macOS",
  "Windows",
  "Linux",
  "Android",
  "iOS",
  "MIT",
  "Apache-2.0",
  "GPL-3.0",
  "MCP",
  "API",
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "HTML",
  "CSS",
  "JSON",
  "CLI",
  "SQL",
  "PostgreSQL",
  "README",
  "Open Source",
  "open source",
  "VS Code",
  "Docker",
  "Git",
  "Bootstrap",
  "Tailwind CSS",
  "Next.js",
  "Supabase",
  "Vercel",
  "Figma",
  "Homebrew",
  "Codex",
  "IA",
  "PDF",
  "Markdown",
  "Electron",
  "Vue",
  "Svelte",
  "Rust",
  "Go",
  "Swift",
  "Firebase",
  "Cloudflare",
  "Node.js",
]);
for (const p of catalog.projects) {
  identity.add(p.name);
  identity.add(p.repo);
}
const dictionaries = {};
fs.mkdirSync(new URL("../../artifacts/", import.meta.url), { recursive: true });
for (const language of ["en", "es"]) {
  const dictionary = JSON.parse(
    fs.readFileSync(
      new URL(`../public/locales/${language}.json`, import.meta.url),
    ),
  );
  dictionaries[language] = dictionary;
  const missing = [...canonical].filter(
    (key) =>
      !Object.hasOwn(dictionary, key) &&
      !identity.has(key) &&
      !/^[a-z0-9_-]+$/.test(key),
  );
  const report = new URL(
    `../../artifacts/locales-missing-${language}.json`,
    import.meta.url,
  );
  fs.writeFileSync(report, JSON.stringify(missing, null, 2) + "\n");
  console.log(
    `${language}: ${canonical.size} textos examinados; ${missing.length} sem tradução.`,
  );
  if (missing.length) process.exitCode = 1;
}
if (process.argv.includes("--export"))
  fs.writeFileSync(
    new URL("../../artifacts/locales-canonical.json", import.meta.url),
    JSON.stringify([...canonical], null, 2) + "\n",
  );
