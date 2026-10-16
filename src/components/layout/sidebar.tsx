import { categories, projects } from "../../data";
import { guideList, type Guide } from "../../data/guides";
import type { View } from "../../data/types";
import Icon from "../ui/icon";
type Props = {
  menu: boolean;
  view: View;
  category: string;
  savedCount: number;
  nav: (v: View) => void;
  reset: () => void;
  chooseCategory: (v: string) => void;
  setGuide: (g: Guide) => void;
  setAbout: (b: boolean) => void;
};
export default function Sidebar({
  menu,
  view,
  category,
  savedCount,
  nav,
  reset,
  chooseCategory,
  setGuide,
  setAbout,
}: Props) {
  return (
    <aside className={`sidebar ${menu ? "mobile-open" : ""}`}>
      <a
        className="brand"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          reset();
          nav("discover");
        }}
      >
        <span className="brand-mark">
          <i />
          <i />
          <i />
        </span>
        <span>
          GitHub
          <span className="brand-serif">
            Bookshelf<span className="brand-period">.</span>
          </span>
        </span>
      </a>
      <span className="workspace-label">SUA PRÓXIMA DESCOBERTA</span>
      <nav aria-label="Navegação principal" className="main-nav">
        {(
          [
            ["discover", "compass", "Descobrir"],
            ["collections", "layers", "Coleções"],
            ["shelf", "bookmark", "Minha estante"],
          ] as const
        ).map(([v, i, l]) => (
          <button
            key={v}
            className={view === v ? "active" : ""}
            onClick={() => nav(v)}
          >
            <Icon name={i} />
            {l}
            {v === "shelf" && <span className="nav-count">{savedCount}</span>}
            {v === "discover" && <span className="active-dot" />}
          </button>
        ))}
      </nav>
      <div className="nav-section-title">EXPLORE POR CATEGORIA</div>
      <nav className="category-nav" aria-label="Categorias">
        {categories.slice(1).map((c) => (
          <button
            key={c.id}
            className={
              category === c.id && view === "discover" ? "selected" : ""
            }
            onClick={() => chooseCategory(c.id)}
          >
            <Icon name={c.icon} size={17} />
            <span>{c.label}</span>
            <span className="category-count">
              {projects.filter((p) => p.category === c.id).length}
            </span>
          </button>
        ))}
      </nav>
      <div className="sidebar-divider" />
      <nav className="main-nav secondary-nav" aria-label="Recursos">
        <button
          className={view === "releases" ? "active" : ""}
          onClick={() => {
            reset();
            nav("releases");
          }}
        >
          <Icon name="clock" />
          Últimos lançamentos
          <span className="new-indicator" />
        </button>
        <button
          className={view === "guides" ? "active" : ""}
          onClick={() => nav("guides")}
        >
          <Icon name="book" />
          Guias para começar
          <Icon name="external" size={14} />
        </button>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <span className="note-icon">
            <Icon name="sparkles" size={18} />
          </span>
          <h3>
            Boas ferramentas.
            <br />
            Novas possibilidades.
          </h3>
          <p>
            Uma descoberta pode mudar
            <br />o seu jeito de criar.
          </p>
          <button
            onClick={() => {
              setGuide(guideList[0]);
            }}
          >
            Por onde começar
            <Icon name="arrow" size={14} />
          </button>
        </div>
        <button className="curation-about" onClick={() => setAbout(true)}>
          <span className="curation-avatar">gb.</span>
          <span>
            Feito para gente curiosa
            <small>
              Conheça a curadoria
              <Icon name="external" size={10} />
            </small>
          </span>
        </button>
      </div>
    </aside>
  );
}
