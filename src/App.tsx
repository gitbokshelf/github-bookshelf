import Sidebar from "./components/layout/sidebar";
import Hero from "./components/hero";
import Collections from "./pages/collections";
import Guides from "./pages/guides";
import type { View } from "./data/types";
import { useEffect, useRef, useState } from "react";

import DraggableWidgetGrid, {
  type WidgetItem,
} from "./components/ui/draggable-widget-grid";
import Icon from "./components/ui/icon";
import {
  projects,
  categories,
  score,
  compact,
  date,
  fetchedAt,
  type Project,
} from "./data";
import { useLibrary, type Library } from "./hooks/use-library";
import { guideList, type Guide } from "./data/guides";
import Modal from "./components/ui/modal";
import ProjectCard from "./components/project-card";
import ProjectDetails from "./components/project-details";

const platforms = [
  "Todos",
  "macOS",
  "Windows",
  "Linux",
  "Web",
  "Android",
  "iOS",
];
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const initialWidgets: WidgetItem[] = [
  { id: "saved", size: "sm", label: "Projetos salvos" },
  { id: "using", size: "sm", label: "Projetos em uso" },
  { id: "done", size: "sm", label: "Projetos explorados" },
  { id: "areas", size: "sm", label: "Áreas descobertas" },
];
function storedWidgets() {
  try {
    const v = JSON.parse(localStorage.getItem("bookshelf:widgets") || "null");
    if (
      Array.isArray(v) &&
      v.length === 4 &&
      new Set(v.map((x: WidgetItem) => x.id)).size === 4 &&
      v.every(
        (x: WidgetItem) =>
          initialWidgets.some((y) => y.id === x.id) && x.size === "sm",
      )
    )
      return v;
  } catch {}
  return initialWidgets;
}
export default function App() {
  const [view, setView] = useState<View>("discover"),
    [category, setCategory] = useState("all"),
    [platform, setPlatform] = useState("Todos"),
    [query, setQuery] = useState(""),
    [sort, setSort] = useState("curated"),
    [layout, setLayout] = useState<"grid" | "list">("grid"),
    [level, setLevel] = useState("Todos"),
    [license, setLicense] = useState("Todas"),
    [menu, setMenu] = useState(false),
    [filterOpen, setFilterOpen] = useState(false),
    [selected, setSelected] = useState<Project | null>(null),
    [guide, setGuide] = useState<Guide | null>(null),
    [about, setAbout] = useState(false),
    [toast, setToast] = useState(""),
    [page, setPage] = useState(1),
    [shelfStatus, setShelfStatus] = useState("all");
  const { library, toggle, patch, update, storageError } = useLibrary();
  const searchRef = useRef<HTMLInputElement>(null),
    importRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        ) &&
        !document.querySelector("dialog[open]")
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  useEffect(() => {
    setPage(1);
  }, [query, category, platform, sort, level, license, view, shelfStatus]);
  useEffect(() => {
    if (toast) {
      const t = window.setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const nav = (v: View) => {
    setQuery("");
    setCategory("all");
    setPlatform("Todos");
    setLevel("Todos");
    setLicense("Todas");
    setView(v);
    setMenu(false);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const chooseCategory = (id: string) => {
    setCategory(id);
    setView("discover");
    setQuery("");
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const reset = () => {
    setCategory("all");
    setPlatform("Todos");
    setLevel("Todos");
    setLicense("Todas");
    setQuery("");
    setShelfStatus("all");
  };
  const save = (p: Project) => {
    toggle(p.repo);
    setToast(
      library[p.repo]
        ? `${p.name} saiu da sua estante`
        : `${p.name} salvo na sua estante`,
    );
  };
  const open = (p: Project) => {
    setSelected(p);
  };
  let filtered = projects.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      (platform === "Todos" || p.platforms.includes(platform)) &&
      (level === "Todos" || p.level === level) &&
      (license === "Todas" ||
        (license === "MIT"
          ? p.license === "MIT"
          : p.license !== "NOASSERTION" && p.license !== "Não informada")) &&
      (!query ||
        normalize(
          [
            p.name,
            p.description,
            p.repo,
            ...p.tags,
            p.category,
            p.level,
            categories.find((c) => c.id === p.category)?.label,
            ...p.platforms,
          ].join(" "),
        ).includes(normalize(query))) &&
      (view !== "shelf" || library[p.repo]) &&
      (view !== "shelf" ||
        shelfStatus === "all" ||
        library[p.repo]?.status === shelfStatus) &&
      (view !== "releases" || p.release),
  );
  if (view === "releases" || sort === "release")
    filtered = [...filtered].sort((a, b) =>
      (b.release?.date || "").localeCompare(a.release?.date || ""),
    );
  else if (sort === "stars")
    filtered = [...filtered].sort((a, b) => b.stars - a.stars);
  else if (sort === "score")
    filtered = [...filtered].sort((a, b) => score(b) - score(a));
  else if (sort === "newest")
    filtered = [...filtered].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  else if (sort === "updated")
    filtered = [...filtered].sort((a, b) =>
      b.pushedAt.localeCompare(a.pushedAt),
    );
  const visible = filtered.slice(0, page * 12),
    savedProjects = projects.filter((p) => library[p.repo]),
    activeFilters =
      Number(platform !== "Todos") +
      Number(level !== "Todos") +
      Number(license !== "Todas"),
    home =
      view === "discover" && category === "all" && !query && !activeFilters;
  const exportLibrary = () => {
    const data = { version: 1, exportedAt: new Date().toISOString(), library };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "github-bookshelf-estante.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Backup da estante exportado");
  };
  const importLibrary = async (file: File) => {
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error();
      const v = JSON.parse(await file.text());
      if (
        v.version !== 1 ||
        !v.library ||
        typeof v.library !== "object" ||
        Array.isArray(v.library)
      )
        throw new Error();
      const entries = Object.entries(v.library);
      if (
        !entries.every(([k, val]) => {
          const x = val as Library[string];
          return (
            projects.some((p) => p.repo === k) &&
            x &&
            ["saved", "using", "done"].includes(x.status) &&
            typeof x.note === "string" &&
            x.note.length <= 10000 &&
            typeof x.savedAt === "string" &&
            !isNaN(Date.parse(x.savedAt))
          );
        })
      )
        throw new Error();
      update((old) => ({ ...old, ...v.library }));
      setToast(
        `${entries.length} projetos importados. Notas dos mesmos projetos foram atualizadas.`,
      );
    } catch {
      setToast(
        "Arquivo inválido. Use um backup JSON exportado por esta estante.",
      );
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  };
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <Sidebar
        menu={menu}
        view={view}
        category={category}
        savedCount={savedProjects.length}
        nav={nav}
        reset={reset}
        chooseCategory={chooseCategory}
        setGuide={setGuide}
        setAbout={setAbout}
      />
      {menu && (
        <button
          className="sidebar-overlay"
          onClick={() => setMenu(false)}
          aria-label="Fechar navegação"
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-toggle"
              onClick={() => setMenu(!menu)}
              aria-label="Abrir menu"
            >
              <Icon name="menu" />
            </button>
            <span className="breadcrumb">
              Sua biblioteca de possibilidades
              <Icon name="right" size={13} />
              <strong>
                {view === "discover"
                  ? "Descobrir"
                  : view === "collections"
                    ? "Coleções"
                    : view === "shelf"
                      ? "Minha estante"
                      : view === "releases"
                        ? "Lançamentos"
                        : "Guias"}
              </strong>
            </span>
          </div>
          <div className="topbar-actions">
            <span className="curated-label">
              <span className="status-dot" />
              Curadoria independente
            </span>
            <a
              className="github-button"
              href="https://github.com/thiagoebias/github-bookshelf"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="github" size={17} />
              <span>GitHub</span>
              <Icon name="external" size={13} />
            </a>
          </div>
        </header>
        <main id="main">
          <div className="search-row">
            <div className="search-field">
              <Icon name="search" size={18} />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!["discover", "shelf", "releases"].includes(view))
                    setView("discover");
                }}
                placeholder="Uma ideia, uma ferramenta, uma nova possibilidade..."
                aria-label="Buscar projetos"
              />
              {query ? (
                <button
                  className="icon-button"
                  onClick={() => setQuery("")}
                  aria-label="Limpar busca"
                >
                  <Icon name="x" size={16} />
                </button>
              ) : (
                <kbd>/</kbd>
              )}
            </div>
            <button
              className="search-filter"
              onClick={() => setFilterOpen(true)}
            >
              <Icon name="sliders" size={17} />
              <span>Filtros</span>
              {activeFilters > 0 && <b>{activeFilters}</b>}
            </button>
          </div>
          {home && <Hero onCollections={() => nav("collections")} />}
          {home && (
            <div className="library-strip">
              <span>
                <Icon name="library" size={17} />
                <b>{projects.length}</b> projetos selecionados
              </span>
              <span>
                <Icon name="layers" size={17} />
                <b>{categories.length - 1}</b> universos para explorar
              </span>
              <span>
                <Icon name="shield" size={17} />
                Fontes oficiais, contexto real
              </span>
              <button onClick={() => setAbout(true)}>
                Uma curadoria, não um algoritmo
                <Icon name="external" size={12} />
              </button>
            </div>
          )}
          {view === "collections" && !query ? (
            <Collections
              open={open}
              reset={reset}
              chooseCategory={chooseCategory}
            />
          ) : view === "guides" && !query ? (
            <Guides setGuide={setGuide} />
          ) : (
            <>
              {view === "shelf" && (
                <>
                  <div className="page-heading shelf-heading">
                    <div>
                      <div className="eyebrow">
                        ESPAÇO PARA AS SUAS DESCOBERTAS
                      </div>
                      <h1>
                        Sua estante. <em>Seu próximo passo.</em>
                      </h1>
                      <p>Guarde o que faz sentido. Experimente no seu tempo.</p>
                    </div>
                    <div className="backup-actions">
                      <button onClick={exportLibrary}>
                        <Icon name="download" size={15} />
                        Exportar
                      </button>
                      <button onClick={() => importRef.current?.click()}>
                        <Icon name="upload" size={15} />
                        Importar
                      </button>
                      <input
                        type="file"
                        accept=".json,application/json"
                        ref={importRef}
                        hidden
                        onChange={(e) => {
                          if (e.target.files?.[0])
                            void importLibrary(e.target.files[0]);
                        }}
                      />
                    </div>
                  </div>
                  <div className="personal-widgets">
                    <DraggableWidgetGrid
                      items={storedWidgets()}
                      onChange={(v) => {
                        try {
                          localStorage.setItem(
                            "bookshelf:widgets",
                            JSON.stringify(v),
                          );
                        } catch {
                          setToast(
                            "Não foi possível salvar a ordem dos widgets.",
                          );
                        }
                      }}
                      maxColumns={4}
                      cellSize={240}
                      gap={12}
                      radius={14}
                      renderItem={(item) => (
                        <div className={`personal-widget widget-${item.id}`}>
                          <span>
                            <Icon
                              name={
                                item.id === "saved"
                                  ? "bookmark"
                                  : item.id === "using"
                                    ? "bolt"
                                    : item.id === "done"
                                      ? "done"
                                      : "layers"
                              }
                              size={20}
                            />
                            <Icon name="grip" size={15} />
                          </span>
                          <b>
                            {item.id === "saved"
                              ? savedProjects.length
                              : item.id === "areas"
                                ? new Set(savedProjects.map((p) => p.category))
                                    .size
                                : savedProjects.filter(
                                    (p) =>
                                      library[p.repo].status ===
                                      (item.id === "done" ? "done" : "using"),
                                  ).length}
                          </b>
                          <p>
                            {item.id === "saved"
                              ? "Projetos na estante"
                              : item.id === "using"
                                ? "Em uso"
                                : item.id === "done"
                                  ? "Já explorados"
                                  : "Áreas descobertas"}
                          </p>
                        </div>
                      )}
                    />
                  </div>
                  <div className="shelf-meta">
                    <span>
                      <Icon name="shield" size={13} />
                      Salvo neste navegador. Exporte um backup para levar sua
                      estante.
                    </span>
                    <span>Arraste os widgets ou use Alt + setas.</span>
                  </div>
                  <div className="shelf-tabs">
                    {[
                      ["all", "Todos"],
                      ["saved", "Para explorar"],
                      ["using", "Em uso"],
                      ["done", "Já explorados"],
                    ].map(([v, l]) => (
                      <button
                        key={v}
                        className={shelfStatus === v ? "active" : ""}
                        onClick={() => setShelfStatus(v)}
                      >
                        {l}
                        <span>
                          {v === "all"
                            ? savedProjects.length
                            : savedProjects.filter(
                                (p) => library[p.repo].status === v,
                              ).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              {view === "releases" && (
                <div className="page-heading">
                  <div className="eyebrow">
                    O PRÓXIMO CAPÍTULO DO OPEN SOURCE
                  </div>
                  <h1>
                    Novas versões. <em>Novas possibilidades.</em>
                  </h1>
                  <p>
                    Última release estável publicada por cada projeto, ordenada
                    pela data de lançamento.
                  </p>
                  <small>
                    Retrato da coleta de {date(fetchedAt)}. Projetos sem release
                    não aparecem aqui.
                  </small>
                </div>
              )}
              <section id="catalog" className="catalog-section">
                <div className="catalog-heading">
                  <div>
                    <div className="eyebrow section-eyebrow">
                      {home
                        ? "ESCOLHIDOS PARA A SUA ESTANTE"
                        : view === "shelf"
                          ? "SUA BIBLIOTECA PESSOAL"
                          : view === "releases"
                            ? "DIRETO DOS REPOSITÓRIOS"
                            : "ENCONTRE ALGO QUE VALE A PENA"}
                    </div>
                    <h2>
                      {query
                        ? `Resultados para “${query}”`
                        : home
                          ? "Seu próximo achado"
                          : view === "shelf"
                            ? "Projetos que você guardou"
                            : view === "releases"
                              ? "Últimos lançamentos"
                              : categories.find((c) => c.id === category)
                                  ?.label || "Explore a biblioteca"}
                      <span className="result-count">{filtered.length}</span>
                    </h2>
                    {home && (
                      <p>
                        Ferramentas incríveis. Usos reais. Um mundo para
                        explorar.
                      </p>
                    )}
                  </div>
                  <div className="catalog-heading-right">
                    {home && (
                      <button
                        className="text-button"
                        onClick={() => {
                          setSort("stars");
                          document
                            .getElementById("catalog")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Ver mais populares
                        <Icon name="arrow" size={14} />
                      </button>
                    )}
                    <div
                      className="view-switch"
                      role="group"
                      aria-label="Visualização"
                    >
                      <button
                        aria-label="Visualização em grade"
                        aria-pressed={layout === "grid"}
                        className={layout === "grid" ? "active" : ""}
                        onClick={() => setLayout("grid")}
                      >
                        <Icon name="grid" size={16} />
                      </button>
                      <button
                        aria-label="Visualização em lista"
                        aria-pressed={layout === "list"}
                        className={layout === "list" ? "active" : ""}
                        onClick={() => setLayout("list")}
                      >
                        <Icon name="list" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="filter-bar">
                  <div
                    className="platform-pills"
                    role="group"
                    aria-label="Sistema operacional"
                  >
                    {platforms.slice(0, 5).map((p) => (
                      <button
                        key={p}
                        className={platform === p ? "active" : ""}
                        aria-pressed={platform === p}
                        onClick={() => setPlatform(p)}
                      >
                        {p === "macOS" && <Icon name="apple" size={13} />}{" "}
                        {p === "Todos" ? "Todos os sistemas" : p}
                      </button>
                    ))}
                  </div>
                  <label className="sort-select">
                    <Icon name="sort" size={14} />
                    <select
                      aria-label="Ordenar projetos"
                      value={view === "releases" ? "release" : sort}
                      disabled={view === "releases"}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="curated">Escolha da curadoria</option>
                      <option value="stars">Mais estrelas no GitHub</option>
                      <option value="score">Melhor avaliação editorial</option>
                      <option value="release">Release mais recente</option>
                      <option value="newest">Repositório mais novo</option>
                      <option value="updated">Atividade mais recente</option>
                    </select>
                    <Icon name="down" size={12} />
                  </label>
                </div>
                {(category !== "all" || activeFilters > 0 || query) && (
                  <div className="active-filters">
                    <span>
                      {filtered.length}{" "}
                      {filtered.length === 1
                        ? "projeto encontrado"
                        : "projetos encontrados"}
                      {category !== "all" &&
                        ` em ${categories.find((c) => c.id === category)?.label}`}
                      {platform !== "Todos" && ` · ${platform}`}
                      {level !== "Todos" && ` · ${level}`}
                      {license !== "Todas" && ` · Licença: ${license}`}
                    </span>
                    <button onClick={reset}>
                      Limpar filtros
                      <Icon name="x" size={12} />
                    </button>
                  </div>
                )}
                {!visible.length ? (
                  <div className="empty-state">
                    <span>
                      <Icon
                        name={view === "shelf" ? "bookmark" : "search"}
                        size={34}
                      />
                    </span>
                    <h3>
                      {view === "shelf" && !savedProjects.length
                        ? "Sua próxima descoberta merece um lugar."
                        : "Ainda não encontramos esse capítulo."}
                    </h3>
                    <p>
                      {view === "shelf" && !savedProjects.length
                        ? "Clique no + de um projeto para guardá-lo aqui. Depois, acompanhe seu uso e escreva suas notas."
                        : "Experimente outro termo ou ajuste os filtros para explorar mais possibilidades."}
                    </p>
                    <button
                      className="primary-button"
                      onClick={() => {
                        reset();
                        if (view === "shelf" && !savedProjects.length)
                          nav("discover");
                      }}
                    >
                      {view === "shelf" && !savedProjects.length
                        ? "Descobrir projetos"
                        : "Limpar filtros"}
                      <Icon name="arrow" size={15} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`projects-grid ${layout === "list" ? "projects-list" : ""}`}
                  >
                    {visible.map((p) => (
                      <div key={p.repo}>
                        <ProjectCard
                          project={p}
                          list={layout === "list"}
                          saved={!!library[p.repo]}
                          onSave={() => save(p)}
                          onOpen={() => open(p)}
                        />
                        {view === "releases" && p.release && (
                          <a
                            className="release-line"
                            href={p.release.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>{p.release.tag}</span>
                            {date(p.release.date)}
                            <Icon name="external" size={12} />
                          </a>
                        )}
                        {view === "shelf" && (
                          <div className="shelf-card-state">
                            <span
                              className={`status-${library[p.repo].status}`}
                            >
                              <span className="status-dot" />
                              {library[p.repo].status === "saved"
                                ? "Para explorar"
                                : library[p.repo].status === "using"
                                  ? "Em uso"
                                  : "Já explorado"}
                            </span>
                            <button onClick={() => open(p)}>
                              {library[p.repo].note
                                ? "Ver minha nota"
                                : "Adicionar nota"}
                              <Icon name="external" size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {filtered.length > visible.length && (
                  <div className="load-more">
                    <button
                      className="secondary-button"
                      onClick={() => setPage(page + 1)}
                    >
                      Mais descobertas
                      <Icon name="down" size={15} />
                    </button>
                    <span>
                      {visible.length} de {filtered.length} projetos
                    </span>
                  </div>
                )}
              </section>
              {home && (
                <>
                  <section className="spotlight">
                    <div className="spotlight-art" aria-hidden="true">
                      <span>
                        (<Icon name="flame" size={72} />)
                      </span>
                      <small>freeCodeCamp</small>
                      <div className="code-lines">
                        <span>&lt;your_next_chapter&gt;</span>
                        <span> learn. build. repeat.</span>
                        <span>&lt;/your_next_chapter&gt;</span>
                      </div>
                    </div>
                    <div className="spotlight-copy">
                      <div className="eyebrow">
                        <Icon name="graduation" size={16} />
                        UM BOM LUGAR PARA COMEÇAR
                      </div>
                      <h2>
                        A próxima habilidade
                        <br />
                        pode mudar <em>o seu caminho.</em>
                      </h2>
                      <p>
                        Comece pela prática com o freeCodeCamp. Uma plataforma
                        gratuita para aprender programação, com conteúdo em
                        português.
                      </p>
                      <button
                        className="primary-button"
                        onClick={() => open(projects[0])}
                      >
                        Conheça o freeCodeCamp
                        <Icon name="arrow" size={15} />
                      </button>
                      <a
                        href="https://www.freecodecamp.org/portuguese/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ir para o portal em português
                        <Icon name="external" size={13} />
                      </a>
                    </div>
                  </section>
                  <section className="collections-preview">
                    <div className="catalog-heading">
                      <div>
                        <div className="eyebrow section-eyebrow">
                          SIGA A SUA CURIOSIDADE
                        </div>
                        <h2>Um universo para cada interesse.</h2>
                      </div>
                      <button
                        className="text-button"
                        onClick={() => nav("collections")}
                      >
                        Todas as coleções
                        <Icon name="arrow" size={15} />
                      </button>
                    </div>
                    <div className="quick-collections">
                      {categories
                        .filter((c) =>
                          ["mac", "ai", "structure", "study"].includes(c.id),
                        )
                        .map((c, i) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              reset();
                              chooseCategory(c.id);
                            }}
                          >
                            <span className={`collection-icon ci-${i}`}>
                              <Icon name={c.icon} size={23} />
                            </span>
                            <span>
                              <strong>{c.label}</strong>
                              <small>
                                {
                                  projects.filter((p) => p.category === c.id)
                                    .length
                                }{" "}
                                projetos para explorar
                              </small>
                            </span>
                            <Icon name="external" size={15} />
                          </button>
                        ))}
                    </div>
                  </section>
                </>
              )}
            </>
          )}
          <footer>
            <a
              className="footer-brand"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                reset();
                nav("discover");
              }}
            >
              <Icon name="library" size={17} />
              GitHub Bookshelf<span>.</span>
            </a>
            <p>O código é aberto. As possibilidades também.</p>
            <div>
              <button onClick={() => setAbout(true)}>Sobre a curadoria</button>
              <span className="footer-date">Dados de {date(fetchedAt)}</span>
              <a
                href="https://github.com/thiagoebias/github-bookshelf"
                target="_blank"
                rel="noreferrer"
                aria-label="Abrir código do GitHub Bookshelf"
              >
                <Icon name="github" size={16} />
              </a>
            </div>
          </footer>
        </main>
      </div>
      {storageError && (
        <div className="storage-warning" role="alert">
          O navegador bloqueou o armazenamento. Exporte sua estante para guardar
          as alterações.
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <Icon name="check" size={17} />
          {toast}
        </div>
      )}
      {filterOpen && (
        <Modal
          label="Filtros de projetos"
          onClose={() => setFilterOpen(false)}
          className="filters-modal"
        >
          <div className="eyebrow">ENCONTRE O SEU PRÓXIMO PROJETO</div>
          <h2>Do seu jeito.</h2>
          <label className="field-label">
            Sistema ou ambiente
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {platforms.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Categoria
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Experiência para começar
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              {["Todos", "Iniciante", "Intermediário", "Avançado"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Licença identificada pela API
            <select
              value={license}
              onChange={(e) => setLicense(e.target.value)}
            >
              {["Todas", "MIT", "Identificada"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <p className="field-hint">
            macOS, Windows e Linux incluem execução local com as dependências
            documentadas, como Docker. Web indica acesso pelo navegador. Confira
            requisitos no projeto.
          </p>
          <div className="modal-actions">
            <button className="text-button" onClick={reset}>
              Limpar filtros
            </button>
            <button
              className="primary-button"
              onClick={() => {
                setFilterOpen(false);
                if (["collections", "guides"].includes(view))
                  setView("discover");
              }}
            >
              Ver resultados
              <Icon name="arrow" size={15} />
            </button>
          </div>
        </Modal>
      )}
      {selected && (
        <ProjectDetails
          key={selected.repo}
          selected={selected}
          library={library}
          save={save}
          patch={patch}
          onClose={() => setSelected(null)}
        />
      )}
      {guide && (
        <Modal
          label={guide.title}
          onClose={() => setGuide(null)}
          className="guide-modal"
        >
          <div className="eyebrow">
            <Icon name={guide.icon} size={16} /> GUIA DE BOLSO · {guide.time}
          </div>
          <h2>{guide.title}</h2>
          <p className="guide-subtitle">{guide.sub}</p>
          <div className="guide-steps">
            {guide.steps.map(([title, body], i) => (
              <div key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <section>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </section>
              </div>
            ))}
          </div>
          <div className="guide-sources">
            <h3>Continue nas fontes oficiais</h3>
            {guide.sources.map(([label, url]) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {label}
                <Icon name="external" size={13} />
              </a>
            ))}
          </div>
        </Modal>
      )}
      {about && (
        <Modal
          label="Sobre a curadoria"
          onClose={() => setAbout(false)}
          className="about-modal"
        >
          <div className="eyebrow">UM LUGAR PARA BOAS DESCOBERTAS</div>
          <h2>
            Uma estante com <em>intenção.</em>
          </h2>
          <p>
            GitHub Bookshelf organiza projetos públicos em torno de problemas e
            interesses reais. É um catálogo independente, sem vínculo oficial
            com o GitHub.
          </p>
          <h3>Como escolhemos</h3>
          <p>
            A coleção inicial prioriza utilidade prática, documentação pública e
            diversidade de objetivos. As notas de 1 a 5 representam uma leitura
            editorial de utilidade, clareza e facilidade para começar. A média
            aparece nos cartões. Não representam testes de instalação ou
            opiniões de usuários.
          </p>
          <h3>De onde vêm os dados</h3>
          <p>
            Estrelas, forks, datas, linguagens e licença identificada vêm da API
            oficial do GitHub. O catálogo é um retrato da coleta de{" "}
            {date(fetchedAt)}, sem atualização automática em tempo real. Novas
            versões listam a primeira release estável entre as cinco publicações
            mais recentes por projeto; quando não há uma, consultamos o endpoint
            oficial de última release.
          </p>
          <h3>Sua estante fica com você</h3>
          <p>
            Favoritos, progresso, notas e ordem dos widgets são guardados neste
            navegador. Use Exportar e Importar para fazer backup e levar os
            dados a outro dispositivo. Não há sincronização de conta nesta
            versão.
          </p>
          <h3>Componentes que dão vida à biblioteca</h3>
          <p>
            Glass Folder Cards e Draggable Widget Grid são os componentes
            fornecidos nos anexos via 21st.dev, adaptados ao catálogo. As capas
            e os livros são composições visuais do portal.
          </p>
          <div className="attribution-links">
            <a
              className="repo-link"
              href="https://21st.dev/@kedhareswer/components/glass-folder-cards"
              target="_blank"
              rel="noreferrer"
            >
              Pastas: Kedhareswer Naidu / 21st.dev
              <Icon name="external" size={13} />
            </a>
            <a
              className="repo-link"
              href="https://21st.dev/@carolinaraulino/components/draggable-widget-grid"
              target="_blank"
              rel="noreferrer"
            >
              Widgets: carolina / 21st.dev
              <Icon name="external" size={13} />
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}
