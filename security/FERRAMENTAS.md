# Ferramentas, projetos e fontes

Referências verificadas em 17/10/2026. Seleção por função e adequação, não por estrelas. Nenhuma ferramenta oferece segurança permanente sozinha.

| Projeto | Uso | Situação no Bookshelf |
| --- | --- | --- |
| [Gitleaks](https://github.com/gitleaks/gitleaks) | Segredos no Git | CLI 8.30.1 executada; CI com versão e SHA-256 do pacote fixados. O mantenedor informa foco em correções de segurança; reavaliar manutenção periodicamente |
| [CodeQL](https://github.com/github/codeql) e [Action](https://github.com/github/codeql-action) | Análise estática JS/TS | Workflow com security-extended e agendamento semanal. Consultar execução e alertas, não apenas o badge |
| [Dependabot](https://github.com/dependabot/dependabot-core) | Atualizações de dependências | Configuração semanal npm/Actions; correções de segurança habilitadas no repositório |
| [k6](https://github.com/grafana/k6) | Ensaio de carga reprodutível | CLI 2.3.0 e cenário limitado a localhost executados; sem ensaio de banco ou produção |
| [OWASP CheatSheetSeries](https://github.com/OWASP/CheatSheetSeries) | Referência de engenharia | Usada para CSP, headers, autorização e prompt injection; não é certificação |
| [OWASP GenAI Security](https://github.com/OWASP/www-project-top-10-for-large-language-model-applications) | Modelo de riscos de IA | Referência para manutenção assistida e futura IA no produto |
| [OWASP ZAP](https://github.com/zaproxy/zaproxy) | Inspeção dinâmica/passiva de aplicação | Candidato para staging. Não executado; Docker não está instalado. Baseline também navega/gera tráfego e exige escopo |
| [NVIDIA garak](https://github.com/NVIDIA/garak) | Ensaios de vulnerabilidades de LLM | Candidato se houver LLM no produto. Não instalado nem executado; não substitui isolamento e autorização das ferramentas |

## Acompanhamento de ameaças

Priorizar avisos de segurança do GitHub, changelogs/advisories dos fornecedores e dependências, [GitHub Advisory Database](https://github.com/advisories), [CISA KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) e referências OWASP. Fóruns dos projetos podem ajudar a confirmar comportamento; confrontar versão, origem e evidência.

Não há monitoramento da dark web instalado. Alegações de vazamento são pistas a verificar por indicadores e logs próprios. Não comprar vazamentos, usar credenciais encontradas, enviar segredos a scanners públicos ou instalar um agente desconhecido com acesso ao Mac. Caso a necessidade futura seja monitoramento de marca/credenciais, escolher serviço e escopo com o proprietário, incluindo tratamento de dados, alertas e custo.

## Pipeline

`ci.yml`: npm ci, testes, npm audit (bloqueia high/critical), TypeScript/Vite, orçamento e inspeção da distribuição. `security.yml`: Gitleaks no histórico e CodeQL. Actions fixadas por SHA, permissões por job e timeout. `dependabot.yml`: propostas semanais.

CodeQL pode concluir a análise e ainda emitir alertas; sua conclusão não significa zero vulnerabilidades. Triar os alertas de code scanning separadamente. Gitleaks rejeita padrões detectados sem expor seu valor (`--redact=100`). Não há auto-merge nem aprovação automática de segurança.
