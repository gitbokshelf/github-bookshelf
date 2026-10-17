# Revisão de segurança de 17/10/2026

Executor e revisor: Codex. Não houve auditor independente ou pentest completo. Escopo: código/configuração do Bookshelf, histórico Git, dependências, build, verificações anônimas de baixo volume e ensaio HTTP local. Sem exaustão, força bruta ou alteração de dados de usuários.

## Correções e controles

- CSP e headers próprios na Vercel; tema sem script inline e CSS do componente 21st.dev extraído para folha própria na versão hospedada; cache longo somente em assets com hash.
- Validação de backup centralizada: arquivo/conteúdo até 2 MiB, schema estrito, data/status/tamanho, somente repositórios conhecidos, campos extras descartados e mescla atômica. Dados correntes usados após leitura assíncrona e troca de sessão não anuncia sucesso falso.
- Coleta de metadados valida slugs/URLs, timeout e fronteiras; não executa conteúdo de README. Regras obrigatórias de prompt injection e menor privilégio documentadas.
- Pipeline com Actions por SHA, timeouts, auditoria de dependências, Gitleaks, CodeQL e Dependabot. GitHub com relato privado e correções automáticas habilitados; secret scanning/push protection confirmados ativos.
- Área própria, engenharia documentada e modelos portáveis. Não foram copiados segredos para documentação.

## Evidências

| Verificação | Resultado | Limite |
| --- | --- | --- |
| Testes Node | 15 aprovados, catálogo e entradas/configuração defensivas | Não é suíte E2E completa de autenticação |
| TypeScript, Vite, HTML independente e orçamento | Aprovados, aproximadamente 251,8 KB gzip de JS | Não prova acessibilidade ou escala |
| Distribuição | 9 arquivos conferidos, scripts próprios e padrões administrativos examinados ausentes | Scanner de padrões não detecta todo segredo possível |
| npm audit completo | 0 vulnerabilidades conhecidas reportadas | Não cobre falha inédita ou regra de negócio |
| Gitleaks 8.30.1, histórico | 14 commits, aproximadamente 1,07 MB, nenhum achado | Prévio ao commit desta entrega; mudanças novas conferidas antes de enviar |
| Supabase anônimo | Leitura e RPC negados com HTTP 401 | Duas requisições, sem JWT de usuário; não prova isolamento entre contas |
| Auth no painel | Quotas registradas; CAPTCHA off e SMTP próprio pendente | Sem mudança de limite e sem ataque simulado |
| Safari local com CSP | Catálogo, busca Maccy, detalhes e tema claro após recarregar e coleções 21st.dev com abertura da pasta conferidos | Sem novo cadastro/recuperação ou edição de conta |
| k6 2.3.0 local | 10 VUs/30s, 1.800 requisições, 0 falhas, p95 10,78 ms | Somente entrega HTTP estática local, sem banco |

Relatórios sanitizados ignorados: `artifacts/security/`; resultados públicos relevantes também registrados aqui. Execução/publicação final ficam no [registro obrigatório](../docs/REGISTRO-DE-EXECUCAO.md).

## Pendências e prioridade

| Prioridade | Entrega necessária | Estado |
| --- | --- | --- |
| Alta, antes de divulgar cadastro | SMTP e fluxo real de confirmação/recuperação; CAPTCHA integrado com tratamento no cliente | Pendente |
| Alta, antes de escala | Quota de gravação por conta na API/RPC, sem contorno direto; monitoramento e alertas de abuso/consumo | Pendente |
| Alta, continuidade | Backup criptografado e restauração no ambiente separado; definir RPO/RTO | Pendente |
| Alta, administrativo | Conferir MFA, recuperação, sessões, escopos de Apps/GitHub CLI e privilégios nos provedores com o proprietário | Não auditado integralmente |
| Média | Supabase descartável e testes automatizados de isolamento, sessão, concorrência/offline e exclusão de conta | Pendente; testes SQL manuais anteriores não reaplicados |
| Média | Ensaio autenticado de staging, aparelhos físicos, Core Web Vitals e alertas operacionais | Pendente |
| Antes de futura IA | Gateway de ferramentas com autorização fora do modelo, sandbox/egress e testes de prompt injection com dados fictícios | Não aplicável ao runtime atual, obrigatório antes de adicionar LLM |

Conclusão: primeira rodada defensiva com correções concretas e evidência delimitada. O produto não deve ser anunciado como invulnerável, auditado integralmente ou capaz de atender um volume específico de produção. A operação contínua e os riscos abertos fazem parte da entrega profissional.

## Análise, correção e limpeza na continuidade

A primeira execução CodeQL concluiu com três alertas nas ferramentas: verificação de tags sem variação de caixa e dois fluxos de leitura de arquivo para HTTP no teste anônimo. A inspeção passou a conferir caixa, origem própria, atributos duplicados e scripts incompletos, com regressão. O teste de backend deixou de ler arquivo de conexão: obtém somente a chave já pública no módulo da publicação e acessa destinos fixos, sem ler .env ou sessão. Nova análise precisa confirmar o estado dos alertas.

Safari de produção após implantação: sessão e leitura da estante mantidas. Safari local: backup sintético importado, nota hostil exibida como texto, backup inválido rejeitado preservando o item; item sintético removido ao terminar, voltando a zero. Fixtures temporárias removidas na limpeza solicitada.
