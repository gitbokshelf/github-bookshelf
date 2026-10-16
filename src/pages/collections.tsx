import { categories, projects, type Project } from "../data";
import GlassFolder from "../components/ui/glass-folder-cards";
import Icon from "../components/ui/icon";
export default function Collections({
  open,
  reset,
  chooseCategory,
}: {
  open: (p: Project) => void;
  reset: () => void;
  chooseCategory: (id: string) => void;
}) {
  return (
    <>
      <div className="page-heading">
        <div className="eyebrow">CONEXÕES QUE FAZEM SENTIDO</div>
        <h1>
          Uma coleção para <em>cada ideia.</em>
        </h1>
        <p>Projetos que funcionam melhor quando você sabe por onde começar.</p>
      </div>
      <div className="collections-grid">
        {categories.slice(1).map((c, i) => {
          const members = projects.filter((p) => p.category === c.id);
          return (
            <article className="collection-tile" key={c.id}>
              <div className="folder-stage">
                <GlassFolder
                  width={235}
                  tone="dark"
                  art={
                    (
                      ["verdant", "dusk", "glacier", "ember", "aurora"] as const
                    )[i % 5]
                  }
                  seed={i + 5}
                  label={c.label}
                  meta={`${members.length} projetos selecionados`}
                  action="none"
                  files={members.map((p) => ({
                    name: p.name,
                    meta: p.level,
                  }))}
                  onFileSelect={(_, index) => open(members[index])}
                />
              </div>
              <div className="collection-description">
                <h2>{c.label}</h2>
                <p>{c.hint}</p>
                <button
                  className="text-button"
                  onClick={() => {
                    reset();
                    chooseCategory(c.id);
                  }}
                >
                  Explorar coleção
                  <Icon name="arrow" size={15} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="component-credit">
        Pastas por{" "}
        <a
          href="https://21st.dev/@kedhareswer/components/glass-folder-cards"
          target="_blank"
          rel="noreferrer"
        >
          Kedhareswer Naidu / 21st.dev
        </a>
        . Clique para abrir e escolher um projeto.
      </p>
    </>
  );
}
