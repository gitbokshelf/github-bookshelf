import { translate, useLanguage, getLanguage, formatNumber } from "../i18n";
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
  useLanguage();
  const [detailTab, setDetailTab] = useState("overview");
  const tabs = [
    ["overview", "Visão geral"],
    ["start", "Como começar"],
    ["sources", "Dados e fontes"],
  ];
  return (
    <Modal
      label={translate(`Detalhes de ${selected.name}`)}
      onClose={onClose}
      className="project-modal"
    >
      <div className="detail-hero">
        <Cover project={selected} small />
        <div>
          <span className="eyebrow">
            {translate(
              categories.find((c) => c.id === selected.category)?.label,
            )}
          </span>
          <h2>{translate(selected.name)}</h2>
          <p className="detail-tagline">{translate(selected.tagline)}</p>
          <a
            className="repo-link"
            href={selected.url}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size={13} />
            {translate(selected.repo)}
            <Icon name="external" size={12} />
          </a>
          <div className="detail-stat">
            <span>
              <Icon name="star" size={14} />
              {translate(compact(selected.stars))} {translate("estrelas")}
            </span>
            <span>
              <span className="score-dot" />
              {translate(
                formatNumber(score(selected), {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }),
              )}{" "}
              {translate("editorial")}
            </span>
          </div>
        </div>
      </div>
      <div
        className="detail-tabs"
        role="tablist"
        aria-label={translate("Informações do projeto")}
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
            {translate(l)}
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
            <p className="detail-description">
              {translate(selected.description)}
            </p>
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
                  {translate(p)}
                </span>
              ))}
              <span>{translate(selected.level)}</span>
              {selected.tags.map((t) => (
                <span key={t}>{translate(t)}</span>
              ))}
            </div>
            <h3>{translate("Seu primeiro contato")}</h3>
            <p>{translate(selected.start)}</p>
            <div className="caveat">
              <Icon name="help" size={18} />
              <div>
                <strong>{translate("Antes de colocar em uso")}</strong>
                <p>{translate(selected.caveat)}</p>
              </div>
            </div>
            {library[selected.repo] && (
              <div className="personal-notes">
                <div className="notes-heading">
                  <h3>{translate("Na sua estante")}</h3>
                  <select
                    aria-label={translate("Status na estante")}
                    value={library[selected.repo].status}
                    onChange={(e) =>
                      patch(selected.repo, {
                        status: e.target.value as "saved" | "using" | "done",
                      })
                    }
                  >
                    <option value="saved">{translate("Para explorar")}</option>
                    <option value="using">{translate("Em uso")}</option>
                    <option value="done">{translate("Já explorado")}</option>
                  </select>
                </div>
                <label className="field-label">
                  {translate("Minhas notas")}
                  <textarea
                    maxLength={10000}
                    value={library[selected.repo].note}
                    onChange={(e) =>
                      patch(selected.repo, { note: e.target.value })
                    }
                    placeholder={translate(
                      "O que você quer experimentar? O que já descobriu?",
                    )}
                  />
                </label>
                <small>
                  {translate("Salvas automaticamente na sua estante.")}
                </small>
              </div>
            )}
          </>
        ) : detailTab === "start" ? (
          <>
            <h3>{translate("Seu primeiro passo")}</h3>
            <p>{translate(selected.start)}</p>
            <div className="start-steps">
              <div>
                <span>{translate("01")}</span>
                <p>
                  {translate(
                    "Abra a documentação oficial e confira requisitos, licença e compatibilidade.",
                  )}
                </p>
              </div>
              <div>
                <span>{translate("02")}</span>
                <p>
                  {translate(
                    "Experimente com um projeto ou arquivo de teste. Siga o procedimento publicado pelos mantenedores.",
                  )}
                </p>
              </div>
              <div>
                <span>{translate("03")}</span>
                <p>
                  {translate(
                    "Salve na estante, registre o resultado e marque como “Em uso” quando fizer parte da sua rotina.",
                  )}
                </p>
              </div>
            </div>
            <p className="field-hint">{translate(selected.caveat)}</p>
            <a
              className="secondary-button"
              href={selected.readmeUrl}
              target="_blank"
              rel="noreferrer"
            >
              {translate("Ler o README oficial")}
              <Icon name="external" size={15} />
            </a>
          </>
        ) : (
          <>
            <h3>{translate("Um retrato com fonte e data")}</h3>
            <dl className="source-data">
              <div>
                <dt>{translate("Consulta ao GitHub")}</dt>
                <dd>{translate(date(selected.checkedAt))}</dd>
              </div>
              <div>
                <dt>{translate("Estrelas / forks")}</dt>
                <dd>
                  {translate(selected.stars.toLocaleString(getLanguage()))}{" "}
                  {translate("/")}
                  {translate(" ")}
                  {translate(selected.forks.toLocaleString(getLanguage()))}
                </dd>
              </div>
              <div>
                <dt>{translate("Linguagem principal")}</dt>
                <dd>{translate(selected.language || "Não identificada")}</dd>
              </div>
              <div>
                <dt>{translate("Licença na API")}</dt>
                <dd>
                  {translate(
                    selected.license === "NOASSERTION"
                      ? "Consultar o arquivo de licença"
                      : selected.license,
                  )}
                </dd>
              </div>
              <div>
                <dt>{translate("Repositório criado")}</dt>
                <dd>{translate(date(selected.createdAt))}</dd>
              </div>
              <div>
                <dt>{translate("Último push")}</dt>
                <dd>{translate(date(selected.pushedAt))}</dd>
              </div>
              <div>
                <dt>{translate("Arquivado")}</dt>
                <dd>{translate(selected.archived ? "Sim" : "Não")}</dd>
              </div>
              <div>
                <dt>{translate("Última release estável")}</dt>
                <dd>
                  {translate(
                    selected.release ? (
                      <a
                        href={selected.release.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {translate(selected.release.tag)} {translate("· ")}
                        {translate(date(selected.release.date))}
                        <Icon name="external" size={11} />
                      </a>
                    ) : (
                      "Sem release na consulta"
                    ),
                  )}
                </dd>
              </div>
            </dl>
            <h3>
              {translate("Avaliação editorial:")}
              {translate(" ")}
              {translate(
                formatNumber(score(selected), {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }),
              )}{" "}
              {translate("/ 5")}
            </h3>
            <div className="score-breakdown">
              {[
                "Utilidade no objetivo proposto",
                "Clareza das orientações",
                "Facilidade para começar",
              ].map((label, i) => (
                <div key={label}>
                  <span>{translate(label)}</span>
                  <span>
                    {Array.from({ length: 5 }, (_, n) => (
                      <i
                        key={n}
                        className={n < selected.scores[i] ? "filled" : ""}
                      />
                    ))}
                    <b>
                      {selected.scores[i]}
                      {translate("/5")}
                    </b>
                  </span>
                </div>
              ))}
            </div>
            <p className="field-hint">
              {translate(
                "Notas subjetivas de curadoria, sem votação de usuários ou teste de instalação. Dados de popularidade vêm da API oficial; conteúdo, nível e compatibilidade são sínteses editoriais do README. Último push não é data de release. O conteúdo das versões deve ser consultado na fonte.",
              )}
            </p>
            <a
              className="repo-link"
              href={`https://api.github.com/repos/${selected.repo}`}
              target="_blank"
              rel="noreferrer"
            >
              {translate("Consultar API oficial")}
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
          {translate(
            library[selected.repo] ? "Salvo na estante" : "Salvar na estante",
          )}
        </button>
        <a
          className="primary-button"
          href={selected.website}
          target="_blank"
          rel="noreferrer"
        >
          {translate(
            selected.website === selected.url
              ? "Abrir no GitHub"
              : "Visitar projeto",
          )}
          <Icon name="external" size={15} />
        </a>
      </div>
    </Modal>
  );
}
