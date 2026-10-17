import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import curation from "../catalog/curation.mjs";
const catalog = JSON.parse(
  fs.readFileSync(
    new URL("../../frontend/src/data/catalog.json", import.meta.url),
    "utf8",
  ),
);
const categories = new Set([
  "mac",
  "ai",
  "web",
  "files",
  "finance",
  "tools",
  "study",
  "structure",
]);
test("O catálogo preserva toda a curadoria, sem repositórios repetidos", () => {
  assert.equal(catalog.projects.length, curation.length);
  assert.ok(
    catalog.projects.length >= 150,
    "A coleção deve ter pelo menos 150 projetos",
  );
  assert.equal(
    new Set(catalog.projects.map((p) => p.repo.toLowerCase())).size,
    curation.length,
  );
});
test("Metadados têm fonte, data, contagens válidas e as oito categorias", () => {
  assert.ok(!isNaN(Date.parse(catalog.fetchedAt)));
  assert.deepEqual(
    new Set(catalog.projects.map((p) => p.category)),
    categories,
  );
  for (const p of catalog.projects) {
    assert.ok(/^https:\/\/github.com\//.test(p.url));
    assert.ok(/^https?:\/\//.test(p.website));
    assert.ok(/^https:\/\/github.com\//.test(p.readmeUrl));
    assert.ok(Number.isInteger(p.stars) && p.stars >= 0);
    assert.ok(Number.isInteger(p.forks) && p.forks >= 0);
    assert.ok(!isNaN(Date.parse(p.checkedAt)));
    assert.ok(!isNaN(Date.parse(p.createdAt)));
    assert.ok(!isNaN(Date.parse(p.pushedAt)));
    assert.equal(p.scores.length, 3);
    assert.ok(p.scores.every((s) => Number.isInteger(s) && s >= 1 && s <= 5));
    assert.ok(p.platforms.length > 0);
  }
});
test("Releases têm versão, fonte oficial e data real", () => {
  for (const p of catalog.projects) {
    if (p.release) {
      assert.ok(p.release.tag);
      assert.ok(/^https:\/\/github.com\//.test(p.release.url));
      assert.ok(!isNaN(Date.parse(p.release.date)));
      assert.ok(Date.parse(p.release.date) <= Date.parse(p.checkedAt));
    }
  }
});
test("A seleção mantém o portal em português e a referência atual de plugins", () => {
  assert.equal(
    catalog.projects.find((p) => p.name === "freeCodeCamp").website,
    "https://www.freecodecamp.org/portuguese/",
  );
  assert.ok(catalog.projects.some((p) => p.repo === "openai/plugins"));
  assert.ok(!catalog.projects.some((p) => p.repo === "openai/skills"));
});
test("Publicação usa caminhos relativos e não exige credenciais no navegador", () => {
  assert.ok(
    fs
      .readFileSync(
        new URL("../../frontend/vite.config.ts", import.meta.url),
        "utf8",
      )
      .includes('base: "./"'),
  );
  const publicText = JSON.stringify(catalog);
  assert.ok(!publicText.includes("/Users/"));
  assert.ok(
    !/gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]+/.test(publicText),
  );
});

test("Todas as áreas têm variedade real para explorar", () => {
  for (const category of categories) {
    assert.ok(
      catalog.projects.filter((p) => p.category === category).length >= 10,
      `Cobertura insuficiente em ${category}`,
    );
  }
  for (const p of catalog.projects) {
    assert.equal(p.archived, false, `Projeto arquivado: ${p.repo}`);
    assert.ok(p.start.length >= 40);
    assert.ok(p.caveat.length >= 40);
  }
});
