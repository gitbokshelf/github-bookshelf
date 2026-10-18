# Engenharia de segurança e confiabilidade

Área obrigatória de segurança do GitHub Bookshelf. Responsável pelo produto: Thiago Ebias. Revisão técnica desta entrega: Codex, sem auditoria independente. Evidências datadas e limites ficam em [REVISAO.md](REVISAO.md) e no [registro de execução](../docs/REGISTRO-DE-EXECUCAO.md).

## Mapa

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| [MODELO-DE-AMEACAS.md](MODELO-DE-AMEACAS.md) | Ativos, fronteiras de confiança, ataques e controles |
| [AGENTES-E-INTEGRACOES.md](AGENTES-E-INTEGRACOES.md) | Prompt injection, MCP, ferramentas e permissões |
| [BACKUP-E-RESTAURACAO.md](BACKUP-E-RESTAURACAO.md) | Recuperação, critérios de conclusão e limites do ensaio |
| [OPERACAO.md](OPERACAO.md) | Manutenção, alertas, incidentes e recuperação |
| [CAPACIDADE.md](CAPACIDADE.md) | Sobrecarga, limites, ensaio e critérios de expansão |
| [FERRAMENTAS.md](FERRAMENTAS.md) | Fontes oficiais e ferramentas adotadas ou candidatas |
| [REVISAO.md](REVISAO.md) | Evidências, correções e riscos ainda abertos |
| [PORTABILIDADE.md](PORTABILIDADE.md) | Como aplicar esta engenharia em outro projeto |
| [templates/](templates/) | Modelos sem credenciais para adoção em outro produto |
| [tests/security.test.mjs](tests/security.test.mjs) | Entradas hostis e contrato HTTP do Bookshelf |
| [tools/check-build.mjs](tools/check-build.mjs) | Inspeção da distribuição antes de publicar |
| [load/catalog.k6.js](load/catalog.k6.js) | Carga exclusivamente local, limitada e sem banco |

Segredos reais continuam nos arquivos locais ignorados de cada integração. Não copiar senhas, tokens, sessões, dados privados nem notas de usuários para esta pasta ou para relatórios de ferramentas. Relatórios gerados ficam em `artifacts/security/`, ignorado pelo Git.

## Executar neste projeto

Node 24 LTS, dependências instaladas em `frontend/`. A partir da raiz:

```bash
npm --prefix frontend test
npm --prefix frontend audit --audit-level=high
npm --prefix frontend run build
```

O build inclui a inspeção de segurança da distribuição. A CI executa os mesmos controles, Gitleaks e CodeQL. Dependabot propõe atualizações; isso exige revisão e não autoriza merge automático.

Gitleaks 8.30.1 e k6 2.3.0 foram instalados pelo Homebrew oficial nesta máquina. Para repetir a inspeção de histórico:

```bash
mkdir -p artifacts/security
gitleaks git --redact=100 --no-banner --report-format json --report-path artifacts/security/gitleaks-history.json .
```

O Gitleaks cobre histórico Git. Para mudanças ainda não commitadas, conferir também o diff preparado antes do commit. O scanner não garante ausência de todos os tipos de segredo.

O ensaio k6 requer `npm --prefix frontend run preview -- --port 4173 --strictPort` em outro terminal:

```bash
k6 run --summary-export artifacts/security/load-local.json security/load/catalog.k6.js
```

Nunca apontar esse ensaio para produção. Ele rejeita destinos fora de `localhost:4173`/`127.0.0.1:4173`. Não mede usuários autenticados, banco, renderização do React, rede móvel ou capacidade contratada da hospedagem.

## Critério obrigatório

Uma alteração em identidade, dados, integração, execução de agentes, dependências ou infraestrutura exige revisar os riscos relevantes, executar os testes aplicáveis e atualizar o registro. Não concluir apenas porque uma ferramenta ficou verde. Vulnerabilidade confirmada exige responsável, prioridade e evidência de correção. Risco sem validação deve permanecer explícito.
