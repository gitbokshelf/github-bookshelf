# Revisão de segurança, atualização de 18/10/2026

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
| Testes Node | 23 aprovados, incluindo idiomas, monitor e backoff de quota | Não é suíte E2E completa de autenticação |
| TypeScript, Vite, HTML independente e orçamento | Aprovados, aproximadamente 255,1 KB gzip de JS | Não prova acessibilidade ou escala |
| Distribuição | 11 arquivos conferidos; bootstrap próprio, Turnstile sob demanda na origem oficial autorizada | Scanner de padrões não detecta todo segredo possível |
| npm audit completo | 0 vulnerabilidades conhecidas reportadas | Não cobre falha inédita ou regra de negócio |
| Gitleaks 8.30.1, histórico | 17 commits, aproximadamente 1,18 MB, nenhum achado | Histórico até ee6902e e diffs preparados conferidos; não detecta todo tipo de segredo |
| CodeQL security-extended | Seis alertas corrigidos, zero abertos após análise 39134719583 de bbf7b91 | Escopo da análise estática, sem certificação/pentest completo |
| Supabase anônimo | Leitura e RPC negados com HTTP 401 | Duas requisições, sem JWT de usuário; não prova isolamento entre contas |
| Auth no painel | SMTP configurado, quota RPC aplicada; CAPTCHA backend ainda off | Sem mudança de limite e sem ataque simulado |
| Safari local com CSP | Catálogo, busca Maccy, detalhes e tema claro após recarregar e coleções 21st.dev com abertura da pasta conferidos | Sem novo cadastro/recuperação ou edição de conta |
| k6 2.3.0 local | 10 VUs/30s, 1.800 requisições, 0 falhas, p95 10,78 ms | Somente entrega HTTP estática local, sem banco |

Relatórios sanitizados ignorados: `artifacts/security/`; resultados públicos relevantes também registrados aqui. Execução/publicação final ficam no [registro obrigatório](../docs/REGISTRO-DE-EXECUCAO.md).

## Pendências e prioridade

| Prioridade | Entrega necessária | Estado |
| --- | --- | --- |
| Alta, antes de divulgar cadastro | Entrega SMTP e confirmação/recuperação; exigência CAPTCHA no backend | SMTP salvo, cliente/widget publicado; testes e ativação final pendentes |
| Alta, antes de escala | Quota e monitoramento de abuso/consumo | Quota RPC aplicada e monitor público com e-mail ativo; métricas internas/consumo pendentes |
| Alta, continuidade | Backup criptografado e restauração no ambiente separado; definir RPO/RTO | Pendente |
| Alta, administrativo | Conferir MFA, recuperação, sessões, escopos de Apps/GitHub CLI e privilégios nos provedores com o proprietário | Não auditado integralmente |
| Média | Testes de sessão, concorrência/offline e exclusão de conta | SQL de isolamento/quota e restore sintético automatizados; E2E Auth e Supabase de staging pendentes |
| Média | Ensaio autenticado de staging, aparelhos físicos, Core Web Vitals | Pendente; monitor público já ativo |
| Antes de futura IA | Gateway de ferramentas com autorização fora do modelo, sandbox/egress e testes de prompt injection com dados fictícios | Não aplicável ao runtime atual, obrigatório antes de adicionar LLM |

Conclusão: primeira rodada defensiva com correções concretas e evidência delimitada. O produto não deve ser anunciado como invulnerável, auditado integralmente ou capaz de atender um volume específico de produção. A operação contínua e os riscos abertos fazem parte da entrega profissional.

## Conferência final e limpeza

Código final desta rodada em `ee6902e`: CI 39039774205, segurança 39039774152 e implantação Vercel aprovadas. API de code scanning confirmou os quatro achados como corrigidos, sem alertas abertos. Os fluxos de arquivo para HTTP saíram do teste anônimo; a verificação obtém somente chave já pública na distribuição, sem ler .env ou sessão, e usa destinos fixos.

A inspeção usa AST HTML5 por parse5 8.0.1 e rejeita HTML malformado, atributos duplicados e scripts fora da distribuição. O empacotador independente escapa caracteres de controle e fechamentos de script em qualquer caixa e valida a sintaxe JS resultante. Parser, testes e build passaram. HTML independente abriu no Safari com 150 projetos e coleções reais.

Removidos 324 arquivos/~3,60 MB sem uso, incluindo cache, rascunhos não integrados, fixtures e snapshots superados. Retirados nove widgets e três arquivos fictícios dos componentes; dados reais são obrigatórios. TypeScript e grafo de 30 fontes conferidos. Testes ativos e histórico de migração foram mantidos.

Safari local: backup sintético importado, nota hostil exibida como texto, backup inválido rejeitado preservando o item. Item sintético removido, estante local voltou a zero e fixtures foram excluídas. Safari de produção: sessão e leitura da estante preservadas após publicação, sem alteração de dados da conta. Sete headers e sete recursos próprios conferidos por HTTP. Servidor de preview e abas temporárias desta rodada encerrados.

Evidências e limites desta revisão estão no registro obrigatório. As pendências da tabela anterior permanecem abertas; a limpeza e as análises não representam monitoramento operacional, capacidade de produção medida ou proteção absoluta.

## Continuidade de 18/10/2026

Quota por conta aplicada na RPC, com tabela privada/RLS e bloqueio de escrita direta conferidos no Supabase. Isolamento, quota e restauração lógica passaram localmente e no job database da CI 39042377275. O restore usa dados sintéticos e contrato Auth emulado; backup de produção e recuperação de Auth real continuam pendentes.

SMTP Resend ativo. Monitor publicado em 0be23c2, execução 39042382783: nove controles passaram, API de envio aceitou o teste e painel Resend confirmou Delivered para o e-mail técnico autorizado. Recuperação completa depende da ação do proprietário. Cron nominal de 15 minutos não tem SLA e não cobre consumo/abuso interno.

CodeQL da entrega anterior apontou dois alertas novos no monitor, apesar dos jobs verdes. Origem CSP passou a ser comparada por tokens exatos, com regressão de domínio embutido/malicioso. Valores de relatório são convertidos em constantes booleanas por condição, sem copiar conteúdo de resposta de rede. Reanálise 39134719583 concluída; consulta retornou zero alertas abertos, sem supressão manual.

Turnstile: widget Managed criado, dois hostnames publicados, pre-clearance off, secret destinado somente ao Supabase e sitekey público salvo na Vercel Production. Componente preparado para ciclo de token, expiração/erro/repetição, bloqueio do submit sem token e remoção ao fechar formulário. CSP autoriza apenas origem oficial de scripts/frames necessária ao serviço. Backend ainda não ativado nesta etapa, para evitar bloquear formulários antes de publicar e conferir o cliente.

Internacionalização: cobertura estática de 1.188 textos examinados, incluindo dados editoriais e guias; regressões de formato/protótipos, preservação de nomes/busca e limites de processamento. Idioma e traduções não alteram IDs, autorização ou notas. HTML independente compara JSON decodificado às fontes após escape. Revisão visual desktop no Safari foi feita em PT/EN/ES; a revisão estreita desta alteração foi interrompida pela indisponibilidade do acesso às janelas.
