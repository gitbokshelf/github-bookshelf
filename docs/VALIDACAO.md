# Validação vigente

Atualização de 18/10/2026. Histórico no [registro obrigatório](REGISTRO-DE-EXECUCAO.md). Executor e revisor: Codex, sem auditoria independente ou pentest completo.

## Produto e execução

[Portal](https://githubbokshelf.hubdetrabalho.com.br/) e [código público](https://github.com/gitbokshelf/github-bookshelf). Vercel hospeda o frontend; Supabase mantém Auth e estantes; Locaweb mantém DNS; Resend fornece envio; Cloudflare Turnstile é exigido nos endpoints de autenticação. Catálogo com 150 projetos únicos em oito categorias. Metadados datados da API oficial e notas editoriais, sem certificação de instalação dos aplicativos.

- 23 testes Node aprovados: catálogo, contratos de backup/UTF-8, entradas hostis, URLs, headers, parser HTML, idiomas, política de alertas e espera de quota.
- TypeScript, cobertura de 1.188 textos, grafo de 36 fontes, Vite, HTML independente, orçamento e inspeção de distribuição aprovados. Quatro módulos, aproximadamente 255,1 KB JS gzip. JSON dos dois idiomas no HTML independente passou por comparação completa após decodificação, incluindo caracteres HTML.
- Isolamento entre duas identidades, quota por conta/refill e pg_dump/pg_restore em banco separado passaram em PostgreSQL descartável local e na CI. Contrato Auth mínimo emulado, com dados sintéticos; cluster/dump removidos ao terminar.
- Migração 002 aplicada no Supabase. Consulta somente leitura confirmou seis indicadores: tabela quota, RLS, privacidade, bloqueio de escrita direta, RPC authenticated e PT429. Nenhuma estante real foi modificada.
- Monitor publicado: nove verificações públicas/negação anônima, estado de incidente, supressão de repetição, e-mail de teste autorizado entregue no Resend. Execução 39042382783 passou. Cron nominal de 15 minutos pode atrasar e não cobre métricas internas/consumo.
- SMTP configurado e persistido no Supabase, com chave Resend restrita. Isso ainda não comprova entrega via SMTP ou recuperação completa. A entrega confirmada acima é do monitor pela API.
- Turnstile Managed criado para os dois domínios publicados, pre-clearance off. Sitekey público salvo na Vercel Production e cliente publicado em bbf7b91. Formulário de login concluiu verificação automática no Chrome; exigência ativada no Supabase. Login e recuperação sem token retornaram HTTP 400/captcha_failed, com valores fictícios em domínio reservado e nenhum usuário criado.
- CI 39137097247 e segurança 39137097365 passaram para bd93fc9. CodeQL apontou sete alertas ao longo das rodadas; todos corrigidos e zero abertos na consulta em main após essa análise. Vercel confirmou publicação; domínio respondeu 200 com o mesmo módulo do build local, sete headers e sete recursos próprios conferidos. Os dois JSONs de idioma publicados são idênticos às fontes, com 1.201 entradas cada.

## Interface observada

Safari local, preview 4177: português com ilustrações traduzidas; seletor mudou para inglês, com navegação, catálogo, números e título alterados. Recarregar preservou inglês. Mudança para espanhol funcionou. Busca por ventanas retornou cinco projetos pelo conteúdo traduzido; AeroSpace mostrou descrição, orientações e ressalva em espanhol. Guia GitHub sin laberintos abriu com títulos, parágrafos e fontes traduzidos.

A tentativa de conferir layout estreito foi interrompida porque o acesso às janelas do Safari deixou de estar disponível. Não declarar aprovação móvel desta alteração. A janela privada do teste de recuperação ficou bloqueada pelo Safari e depende do proprietário; não foi desbloqueada pelo agente. Não houve edição de estante de usuário ou definição de senha.

Em rodadas anteriores foram conferidos temas claro/escuro, busca, coleções 21st.dev, importação válida/inválida com nota hostil exibida como texto e sincronização entre Chrome local e Safari de produção na mesma conta. Itens sintéticos foram removidos. Emulação de 1366×600, 390×844 e 844×390 foi feita em 16/10, sem repetir todas essas dimensões agora; dois dispositivos físicos continuam pendentes.

## Limites e próximos passos

- Concluir teste SMTP/cadastro/recuperação com o proprietário; modelos de confirmação e recuperação localizados estão em validação.
- Concluir fluxo positivo de autenticação com o proprietário após a ativação do Turnstile. Exigência e negação sem token já comprovadas.
- Executar backup criptografado de produção e restaurar em ambiente separado. Senha de conexão do banco ainda não está preenchida no arquivo privado; não há backup real nem RPO/RTO comprovados.
- Completar MFA/escopos administrativos, privacidade/exclusão de conta, testes E2E de identidades/offline/concorrência, telas estreitas e aparelhos físicos.
- Medir capacidade autenticada em staging e Core Web Vitals. O ensaio k6 anterior mediu somente HTTP local estático, sem banco ou capacidade contratada.

A [engenharia de segurança](../security/README.md) reúne controles e modelos reutilizáveis. Build, scanners e organização não equivalem a proteção absoluta ou capacidade certificada. O repositório pessoal anterior continua preservado para exclusão futura específica.

## Conferência complementar de acesso e apresentação

Em 18/10/2026, Chrome no domínio principal sem sessão: login concluiu Turnstile automaticamente; recuperação apresentou desafio interativo para o proprietário. Supabase confirmou exigência Turnstile ativa. Duas requisições sem token, usando endereço reservado example.invalid, retornaram HTTP 400/captcha_failed para login e recuperação. Não houve criação de usuário, leitura de estante ou nova senha pelo agente. Relatório sanitizado: artifacts/security/captcha.json.

Viewport emulada de 390 × 844: largura de conteúdo 390 px, controles sem corte horizontal, PT/EN/ES e temas claro/escuro examinados. Evidências locais em artifacts/security/mobile-en-light.png e mobile-es-dark.png. Não comprova aparelhos físicos ou toda combinação de texto.

Dois modelos de Auth salvos no painel, com assuntos localizados. A revisão local que trata Data completamente ausente aguarda reaplicação por indisponibilidade da janela administrativa. Teste real com os motores Go html/template e text/template passou em vinte renderizações sintéticas, sem rede/envio. Preview do painel não resolve condicionais Go.

Publicação complementar ab43ba6: CI 39138376436, segurança 39138376413 e status Vercel aprovados. Vinte renderizações Go passaram também no Ubuntu da CI; consulta de code scanning em main retornou zero abertos. Não há certificado de ausência de vulnerabilidades.
