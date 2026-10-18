import { translate, useLanguage } from "../i18n";
import { guideList, type Guide } from "../data/guides";
import Icon from "../components/ui/icon";
export default function Guides({ setGuide }: { setGuide: (g: Guide) => void }) {
  useLanguage();
  return (
    <>
      <div className="page-heading">
        <div className="eyebrow">
          {translate("CONHECIMENTO QUE ABRE PORTAS")}
        </div>
        <h1>
          {translate("Um bom começo ")}
          <em>{translate("faz diferença.")}</em>
        </h1>
        <p>
          {translate(
            "Guias curtos para explorar com mais clareza e colocar suas ideias em prática.",
          )}
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
              {translate("GUIA ")}
              {translate(String(i + 1).padStart(2, "0"))} {translate("· ")}
              {translate(g.time)} {translate("de leitura")}
            </span>
            <h2>{translate(g.title)}</h2>
            <p>{translate(g.sub)}</p>
            <span className="text-button">
              {translate("Abrir guia")}
              <Icon name="arrow" size={17} />
            </span>
          </button>
        ))}
      </div>
      <div className="guide-note">
        <Icon name="book" size={23} />
        <div>
          <h3>{translate("Entender antes de instalar.")}</h3>
          <p>
            {translate(
              "Os guias são uma orientação editorial. Requisitos, comandos e compatibilidade devem ser conferidos na documentação oficial vinculada.",
            )}
          </p>
        </div>
      </div>
    </>
  );
}
