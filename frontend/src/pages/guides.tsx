import { guideList, type Guide } from "../data/guides";
import Icon from "../components/ui/icon";
export default function Guides({ setGuide }: { setGuide: (g: Guide) => void }) {
  return (
    <>
      <div className="page-heading">
        <div className="eyebrow">CONHECIMENTO QUE ABRE PORTAS</div>
        <h1>
          Um bom começo <em>faz diferença.</em>
        </h1>
        <p>
          Guias curtos para explorar com mais clareza e colocar suas ideias em
          prática.
        </p>
      </div>
      <div className="guides-grid">
        {guideList.map((g, i) => (
          <button
            className={`guide-card guide-${i}`}
            key={g.id}
            onClick={() => setGuide(g)}
          >
            <span className="guide-icon">
              <Icon name={g.icon} size={32} />
            </span>
            <span className="guide-time">
              GUIA {String(i + 1).padStart(2, "0")} · {g.time} de leitura
            </span>
            <h2>{g.title}</h2>
            <p>{g.sub}</p>
            <span className="text-button">
              Abrir guia
              <Icon name="arrow" size={17} />
            </span>
          </button>
        ))}
      </div>
      <div className="guide-note">
        <Icon name="book" size={23} />
        <div>
          <h3>Entender antes de instalar.</h3>
          <p>
            Os guias são uma orientação editorial. Requisitos, comandos e
            compatibilidade devem ser conferidos na documentação oficial
            vinculada.
          </p>
        </div>
      </div>
    </>
  );
}
