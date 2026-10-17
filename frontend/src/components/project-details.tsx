import { useState } from "react";
import { categories, compact, score, date, type Project } from "../data";
import type { Library, Entry } from "../hooks/use-library";
import Icon from "./ui/icon";
import Cover from "./project-cover";
import Modal from "./ui/modal";
type Props = {
  selected: Project;
  library: Library;
  save: (p: Project) => void;
  patch: (repo: string, v: Partial<Entry>) => void;
  onClose: () => void;
};
export default function ProjectDetails({
  selected,
  library,
  save,
  patch,
  onClose,
}: Props) {
  const [detailTab, setDetailTab] = useState("overview");
  const tabs = [
    ["overview", "Visão geral"],
    ["start", "Como começar"],
    ["sources", "Dados e fontes"],
  ];
  return (
    <Modal
      label={`Detalhes de ${selected.name}`}
      onClose={onClose}
      className="project-modal"
    >
      <div className="detail-hero">
        <Cover project={selected} small />
        <div>
          <span className="eyebrow">
            {categories.find((c) => c.id === selected.category)?.label}
          </span>
          <h2>{selected.name}</h2>
          <p className="detail-tagline">{selected.tagline}</p>
          <a
            className="repo-link"
            href={selected.url}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size={13} />
            {selected.repo}
            <Icon name="external" size={12} />
          </a>
          <div className="detail-stat">
            <span>
              <Icon name="star" size={14} />
              {compact(selected.stars)} estrelas
            </span>
            <span>
              <span className="score-dot" />
              {score(selected).toFixed(1).replace(".", ",")} editorial
            </span>
          </div>
        </div>
      </div>
      <div
        className="detail-tabs"
        role="tablist"
        aria-label="Informações do projeto"
        onKeyDown={(event) => {
          const current = tabs.findIndex(([key]) => key === detailTab);
          const next =
            event.key === "ArrowRight"
              ? (current + 1) % tabs.length
              : event.key === "ArrowLeft"
                ? (current + tabs.length - 1) % tabs.length
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? tabs.length - 1
                    : null;
          if (next === null) return;
          event.preventDefault();
          const key = tabs[next][0];
          setDetailTab(key);
          event.currentTarget
            .querySelector<HTMLButtonElement>(`#tab-${key}`)
            ?.focus();
        }}
      >
        {tabs.map(([v, l]) => (
          <button
            key={v}
            role="tab"
            tabIndex={detailTab === v ? 0 : -1}
            aria-selected={detailTab === v}
            aria-controls={`panel-${v}`}
            id={`tab-${v}`}
            onClick={() => setDetailTab(v)}
          >
            {l}
          </button>
        ))}
      </div>
      <div
        className="detail-body"
        role="tabpanel"
        id={`panel-${detailTab}`}
        aria-labelledby={`tab-${detailTab}`}
      >
        {detailTab === "overview" ? (
          <>
            <p className="detail-description">{selected.description}</p>
            <div className="detail-tags">
              {selected.platforms.map((p) => (
                <span key={p}>
                  <Icon
                    name={
                      p === "macOS"
                        ? "apple"
                        : p === "Web"
                          ? "network"
                          : "monitor"
                    }
                    size={12}
                  />
                  {p}
                </span>
              ))}
              <span>{selected.level}</span>
              {selected.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <h3>Seu primeiro contato</h3>
            <p>{selected.start}</p>
            <div className="caveat">
              <Icon name="help" size={18} />
              <div>
                <strong>Antes de colocar em uso</strong>
                <p>{selected.caveat}</p>
              </div>
            </div>
            {library[selected.repo] && (
              <div className="personal-notes">
                <div className="notes-heading">
                  <h3>Na sua estante</h3>
                  <select
                    aria-label="Status na estante"
                    value={library[selected.repo].status}
                    onChange={(e) =>
                      patch(selected.repo, {
                        status: e.target.value as "saved" | "using" | "done",
                      })
                    }
                  >
                    <option value="saved">Para explorar</option>
                    <option value="using">Em uso</option>
                    <option value="done">Já explorado</option>
                  </select>
                </div>
                <label className="field-label">
                  Minhas notas
                  <textarea
                    maxLength={10000}
                    value={library[selected.repo].note}
                    onChange={(e) =>
                      patch(selected.repo, { note: e.target.value })
                    }
                    placeholder="O que você quer experimentar? O que já descobriu?"
                  />
                </label>
                <small>Salvas automaticamente neste navegador.</small>
              </div>
            )}
          </>
        ) : detailTab === "start" ? (
          <>
            <h3>Seu primeiro passo</h3>
            <p>{selected.start}</p>
            <div className="start-steps">
              <div>
                <span>01</span>
                <p>
                  Abra a documentação oficial e confira requisitos, licença e
                  compatibilidade.
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  Experimente com um projeto ou arquivo de teste. Siga o
                  procedimento publicado pelos mantenedores.
                </p>
              </div>
              <div>
                <span>03</span>
                <p>
                  Salve na estante, registre o resultado e marque como “Em uso”
                  quando fizer parte da sua rotina.
                </p>
              </div>
            </div>
            <p className="field-hint">{selected.caveat}</p>
            <a
              className="secondary-button"
              href={selected.readmeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Ler o README oficial
              <Icon name="external" size={15} />
            </a>
          </>
        ) : (
          <>
            <h3>Um retrato com fonte e data</h3>
            <dl className="source-data">
              <div>
                <dt>Consulta ao GitHub</dt>
                <dd>{date(selected.checkedAt)}</dd>
              </div>
              <div>
                <dt>Estrelas / forks</dt>
                <dd>
                  {selected.stars.toLocaleString("pt-BR")} /{" "}
                  {selected.forks.toLocaleString("pt-BR")}
                </dd>
              </div>
              <div>
                <dt>Linguagem principal</dt>
                <dd>{selected.language || "Não identificada"}</dd>
              </div>
              <div>
                <dt>Licença na API</dt>
                <dd>
                  {selected.license === "NOASSERTION"
                    ? "Consultar o arquivo de licença"
                    : selected.license}
                </dd>
              </div>
              <div>
                <dt>Repositório criado</dt>
                <dd>{date(selected.createdAt)}</dd>
              </div>
              <div>
                <dt>Último push</dt>
                <dd>{date(selected.pushedAt)}</dd>
              </div>
              <div>
                <dt>Arquivado</dt>
                <dd>{selected.archived ? "Sim" : "Não"}</dd>
              </div>
              <div>
                <dt>Última release estável</dt>
                <dd>
                  {selected.release ? (
                    <a
                      href={selected.release.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {selected.release.tag} · {date(selected.release.date)}
                      <Icon name="external" size={11} />
                    </a>
                  ) : (
                    "Sem release na consulta"
                  )}
                </dd>
              </div>
            </dl>
            <h3>
              Avaliação editorial:{" "}
              {score(selected).toFixed(1).replace(".", ",")} / 5
            </h3>
            <div className="score-breakdown">
              {[
                "Utilidade no objetivo proposto",
                "Clareza das orientações",
                "Facilidade para começar",
              ].map((label, i) => (
                <div key={label}>
                  <span>{label}</span>
                  <span>
                    {Array.from({ length: 5 }, (_, n) => (
                      <i
                        key={n}
                        className={n < selected.scores[i] ? "filled" : ""}
                      />
                    ))}
                    <b>{selected.scores[i]}/5</b>
                  </span>
                </div>
              ))}
            </div>
            <p className="field-hint">
              Notas subjetivas de curadoria, sem votação de usuários ou teste de
              instalação. Dados de popularidade vêm da API oficial; conteúdo,
              nível e compatibilidade são sínteses editoriais do README. Último
              push não é data de release. O conteúdo das versões deve ser
              consultado na fonte.
            </p>
            <a
              className="repo-link"
              href={`https://api.github.com/repos/${selected.repo}`}
              target="_blank"
              rel="noreferrer"
            >
              Consultar API oficial
              <Icon name="external" size={12} />
            </a>
          </>
        )}
      </div>
      <div className="detail-actions">
        <button
          className={
            library[selected.repo]
              ? "secondary-button saved-action"
              : "secondary-button"
          }
          onClick={() => save(selected)}
        >
          <Icon
            name={library[selected.repo] ? "check" : "bookmark"}
            size={16}
          />
          {library[selected.repo] ? "Salvo na estante" : "Salvar na estante"}
        </button>
        <a
          className="primary-button"
          href={selected.website}
          target="_blank"
          rel="noreferrer"
        >
          {selected.website === selected.url
            ? "Abrir no GitHub"
            : "Visitar projeto"}
          <Icon name="external" size={15} />
        </a>
      </div>
    </Modal>
  );
}
