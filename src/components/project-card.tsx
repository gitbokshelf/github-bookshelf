import { categories, compact, score, type Project } from "../data";
import Icon from "./ui/icon";
import Cover from "./project-cover";
export default function ProjectCard({
  project: p,
  saved,
  onSave,
  onOpen,
  list,
}: {
  project: Project;
  saved: boolean;
  onSave: () => void;
  onOpen: () => void;
  list: boolean;
}) {
  return (
    <article className={`project-card ${list ? "list-card" : ""}`}>
      <button
        className="cover-button"
        onClick={onOpen}
        aria-label={`Conhecer ${p.name}`}
      >
        <Cover project={p} />
      </button>
      <div className="card-content">
        <div className="card-eyebrow">
          <span>{categories.find((c) => c.id === p.category)?.label}</span>
          <button
            className={`save-button ${saved ? "is-saved" : ""}`}
            aria-label={
              saved
                ? `Remover ${p.name} da estante`
                : `Salvar ${p.name} na estante`
            }
            aria-pressed={saved}
            onClick={onSave}
          >
            <Icon name={saved ? "bookmark" : "plus"} size={17} />
          </button>
        </div>
        <button className="card-title" onClick={onOpen}>
          {p.name}
          <Icon name="external" size={15} />
        </button>
        <p>{p.description}</p>
        <div className="card-tags">
          {p.platforms.slice(0, 2).map((x) => (
            <span key={x}>
              <Icon
                name={
                  x === "macOS" ? "apple" : x === "Web" ? "network" : "monitor"
                }
                size={11}
              />
              {x}
            </span>
          ))}
          {p.platforms.length > 2 && (
            <span title={p.platforms.join(", ")}>
              +{p.platforms.length - 2}
            </span>
          )}
          <span>{p.level}</span>
        </div>
        <div className="card-foot">
          <span title="Estrelas no GitHub na data da coleta">
            <Icon name="star" size={13} />
            {compact(p.stars)}
          </span>
          <span
            className="editorial-score"
            title="Média editorial de utilidade, clareza e facilidade. Não é avaliação de usuários."
          >
            <span className="score-dot" />
            {score(p).toFixed(1)}
            <span>editorial</span>
          </span>
        </div>
      </div>
    </article>
  );
}
