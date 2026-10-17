import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import curation from "./curation.mjs";
import { repoSlug, publicUrl } from "./untrusted-metadata.mjs";
const researchDir = fileURLToPath(new URL("../research/", import.meta.url));
const catalogFile = fileURLToPath(
  new URL("../../frontend/src/data/catalog.json", import.meta.url),
);
const exec = promisify(execFile);
const api = async (path) => {
  const { stdout } = await exec("gh", ["api", path], {
    maxBuffer: 8 * 1024 * 1024,
    timeout: 30000,
  });
  return JSON.parse(stdout);
};
const projects = [];
const failures = [];
for (let n = 0; n < curation.length; n += 3) {
  await Promise.all(
    curation.slice(n, n + 3).map(async (p) => {
      try {
        repoSlug(p.repo);
        const [r, readme, releases] = await Promise.all([
          api(`repos/${p.repo}`),
          api(`repos/${p.repo}/readme`),
          api(`repos/${p.repo}/releases?per_page=5`),
        ]);
        const release =
          releases.find((x) => !x.draft && !x.prerelease) ||
          (await api(`repos/${p.repo}/releases/latest`).catch((e) => {
            if (e.message.includes("404")) return null;
            throw e;
          }));
        const homepage = p.website || r.homepage;
        const slug = repoSlug(r.full_name);
        const repositoryUrl = `https://github.com/${slug}`;
        projects.push({
          ...p,
          repo: slug,
          url: repositoryUrl,
          website: publicUrl(homepage, repositoryUrl),
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          license: r.license?.spdx_id || "Não informada",
          archived: r.archived,
          createdAt: r.created_at,
          pushedAt: r.pushed_at,
          avatar: r.owner.avatar_url,
          sourceDescription: r.description,
          readmeUrl: publicUrl(readme.html_url, `${repositoryUrl}#readme`, true),
          release: release
            ? {
                name: release.name || release.tag_name,
                tag: release.tag_name,
                date: release.published_at,
                url: publicUrl(release.html_url, `${repositoryUrl}/releases`, true),
              }
            : null,
          checkedAt: new Date().toISOString(),
        });
        await fs.mkdir(researchDir, { recursive: true });
        await fs.writeFile(
          path.join(researchDir, `${p.repo.replace("/", "--")}.md`),
          Buffer.from(readme.content, "base64"),
        );
        console.log(
          `OK ${r.full_name} · ${r.stargazers_count} stars · ${release?.tag_name || "sem release"}`,
        );
      } catch (e) {
        failures.push(p.repo);
        console.error(`FALHOU ${p.repo}: ${e.message.slice(0, 160)}`);
      }
    }),
  );
}
if (failures.length)
  throw new Error(
    `Catálogo anterior preservado. Corrija: ${failures.join(", ")}`,
  );
projects.sort((a, b) => a.order - b.order);
const next = {
  fetchedAt: new Date().toISOString(),
  source: "GitHub REST API: repos, readme, releases",
  projects,
};
await fs.writeFile(catalogFile + ".tmp", JSON.stringify(next, null, 2) + "\n");
await fs.rename(catalogFile + ".tmp", catalogFile);
console.log(`Catálogo atualizado: ${projects.length} projetos.`);
