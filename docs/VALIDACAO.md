# Validação da entrega

Revisão inicial em 16/10/2026. Versão 1.1.0. As seções seguintes preservam as evidências de cada etapa; o estado mais recente está no [registro obrigatório](REGISTRO-DE-EXECUCAO.md).

## Catálogo e fontes

- 150 projetos únicos, com metadados e README consultados pela API oficial do GitHub.
- Distribuição: Mac 24, IA 25, web 19, arquivos 19, finanças 13, ferramentas dev 23, estudo 14 e organização 13.
- Nenhum registro está arquivado na consulta. Os 120 novos candidatos também foram conferidos quanto à indicação de fork.
- Os dados publicados são um retrato com data de consulta, sem números de popularidade simulados.
- Plataformas foram revisadas com README, documentação, manifests e matrizes oficiais quando necessário. Isso não constitui teste funcional em cada sistema.
- n8n, Paperless-ngx, Firefly III e Ghostfolio passaram a ser classificados como serviços Web, para não sugerir aplicativos nativos de desktop.
- Exemplos depreciados foram substituídos por referências atuais. OpenAI Plugins substitui openai/skills; o cartão 21st MCP informa a migração do Magic MCP.

## Testes e build

Seis testes de integridade passaram: correspondência entre seleção e catálogo, unicidade, fontes e datas, contagens, scores, releases, referências atuais, configuração da publicação e cobertura mínima de cada área. TypeScript e build de produção concluídos.

O build gera `dist/` e um HTML independente. Após a revisão, a versão hospedada separa aplicação, catálogo e bibliotecas em três módulos, de aproximadamente 89 KB, 196 KB e 358 KB sem compressão, todos abaixo do limite de aviso do Vite. O gerador do HTML recombina esses módulos para manter o arquivo independente. As ações oficiais do workflow foram atualizadas para versões com runtime Node.js 24 e o runner foi fixado em Ubuntu 24.04, removendo os avisos de runtime antigo e migração implícita de ambiente.

## Revisão visual e de navegação

Chrome com viewports emulados, operado pela interface:

- 1366 × 600: rodapé da barra lateral permanece visível; a navegação tem rolagem própria e permite chegar aos últimos links.
- 390 × 844: título da abertura quebra em linhas sem corte; o menu móvel exibe navegação e rodapé.
- 844 × 390: menu mantém o rodapé acessível e a navegação rola dentro do espaço restante.
- O painel decorativo se recolhe quando não há altura suficiente.
- O menu fechado fica fora do foco no celular. No menu aberto, Shift + Tab circula para o último controle e Escape fecha e devolve o foco ao botão de abertura.
- 24 cartões são exibidos inicialmente. A opção Mostrar todos foi acionada e os últimos registros, incluindo o cartão 150, foram conferidos na página.
- Busca por Maccy retornou um projeto novo, com os detalhes corretos.
- Nas abas de detalhes, a tecla End selecionou Dados e fontes e levou o foco à aba correspondente.
- Notas editoriais usam separador decimal em português e estão distinguidas de estrelas do GitHub.
- Pastas das coleções mostram uma prévia explícita de quatro projetos e um acesso à coleção completa.

## Persistência já conferida

Na versão 1.0, Safari foi usado para verificar favoritos, nota e status após recarregar, contadores reais, reorganização de widgets pelo teclado, importação de um backup de teste e exportação lida independentemente. Esses fluxos mantêm o mesmo esquema de armazenamento na versão 1.1; as estantes existentes não são migradas nem apagadas.

O HTML independente da primeira entrega foi aberto diretamente no Safari, sem servidor. O HTML da versão 1.1 também foi aberto diretamente no Chrome, exibindo os 150 registros. Após a separação de módulos, tanto o HTML recomposto quanto a prévia de produção foram novamente abertos no Chrome e exibiram a coleção completa. Os dados de teste foram removidos após a verificação.

## Publicação e autoria

Repositório público da conta pessoal: [thiagoebias/github-bookshelf](https://github.com/thiagoebias/github-bookshelf).

Portal: [GitHub Bookshelf](https://thiagoebias.github.io/github-bookshelf/).

[Workflow de validação e publicação](https://github.com/thiagoebias/github-bookshelf/actions/workflows/pages.yml). Alterações da branch main são testadas e publicadas pelo GitHub Pages. A primeira publicação foi concluída na [execução 38948594065](https://github.com/thiagoebias/github-bookshelf/actions/runs/38948594065), com HTTP 200 sem autenticação.

Credenciais, arquivos de ambiente, cache de pesquisa e caminhos privados foram excluídos da entrega pública. Os componentes do 21st.dev preservam atribuição e licença nos [créditos](../THIRD_PARTY_NOTICES.md).

## Limites e próximo passo

Os 150 projetos não foram instalados ou certificados. A curadoria é documental; avaliações e níveis são editoriais. Requisitos exatos e licenças devem ser conferidos nas fontes. Não há promessa de integração com bancos brasileiros.

A revisão responsiva usa emulação no Chrome; não substitui testes em aparelhos físicos. A transferência do backup entre dois dispositivos físicos distintos ainda não foi conferida. A estante permanece local ao navegador, sem sincronização de conta.

Próximo passo: conferir a experiência em um celular físico e evoluir a curadoria com casos de uso, comparações e feedback real.

Relacionado: [Guia do projeto](../frontend/README.md) e [Curadoria](CURADORIA.md).

[Voltar ao README](../frontend/README.md)

## Integração em preparação, 17/10/2026

O projeto foi movido, com o histórico Git preservado, para a pasta do OneDrive escolhida pelo proprietário. Não permanece dentro do cofre Obsidian; os links relacionados passaram a ser Markdown relativos.

Supabase foi configurado no projeto exclusivo. O registro detalhado está em [CONFIGURACAO.md](../backend/supabase/CONFIGURACAO.md). Foram conferidos RLS, isolamento de duas identidades em transação desfeita, revisão otimista, validação e bloqueio de acesso anônimo por HTTP. Esses testes não equivalem a login e recuperação por e-mail completos.

No código local foram acrescentados cliente Supabase, contexto de sessão, formulário de acesso/cadastro/recuperação, estante remota, cache por conta e proteção contra troca de sessão durante gravações. O modo claro, a preferência do sistema, o link superior para o perfil pessoal e fontes maiores também estão no código local. O modal passou a ser centralizado explicitamente.

Os seis testes existentes passaram. O frontend abriu no Chrome, com formulário nos temas escuro e claro; a largura emulada de 390 px não apresentou transbordamento horizontal. Descrições dos cartões passaram para 15 px. Essa revisão é parcial e precisa ser ampliada antes da próxima publicação.

Português, inglês e espanhol ainda não estão ativos: há dicionários parciais, sem seletor integrado. A publicação destas alterações e a abertura de cadastros aguardam a conta GitHub exclusiva, a Vercel e a entrega de e-mails de produção. O portal público continua com a versão anteriormente publicada.

## Primeira reorganização e verificação do acesso, 17/10/2026

Registro histórico da primeira tentativa de organização, posteriormente corrigida. Ela concentrou também documentação, ferramentas e cache em `frontend/`. A estrutura vigente separa essas responsabilidades e está em [ARQUITETURA.md](ARQUITETURA.md). A execução e revisão da correção constam no [registro obrigatório](REGISTRO-DE-EXECUCAO.md).

Antes de ajustar referências, foram comparados hashes de 53 arquivos da aplicação após a mudança, sem divergência. Os seis arquivos privados de conexão permaneceram intactos. Workflow, cache do npm, caminhos de artefatos e orientações da Vercel foram ajustados para `frontend`. O alias e a pasta de variáveis do Vite passaram a usar `fileURLToPath`, pois o caminho local tem espaços. Foram conferidos 40 links relativos, sem destino ausente. Os seis testes e o build passaram no novo diretório.

O servidor foi reiniciado em `127.0.0.1:5173`. O login foi preservado e a conta do produto foi conferida pela interface. Um registro temporário de Maccy, com nota e status Em uso, foi salvo e permaneceu após recarregar; a interface indicou sincronização concluída. O registro foi removido e uma nova recarga confirmou a remoção. O teste terminou com a estante autenticada vazia, como estava antes. Não houve preenchimento ou leitura de senha pelo agente.

Essa validação cobre um usuário no Chrome. Recuperação por e-mail, concorrência na interface e transferência entre dispositivos continuam pendentes. Não houve nova publicação pública nesta reorganização.

## Estrutura de produto e registro obrigatório

A estrutura vigente está em [ARQUITETURA.md](ARQUITETURA.md). Frontend, backend Supabase, integrações, documentação, ferramentas e artefatos têm áreas próprias. O registro obrigatório da execução e da revisão desta correção está em [REGISTRO-DE-EXECUCAO.md](REGISTRO-DE-EXECUCAO.md); as regras vinculantes ficam em [AGENTS.md](../AGENTS.md).

O build passou no novo layout, incluindo o orçamento de peso. A revisão da interface confirmou o catálogo, a sessão e a leitura da estante autenticada após mover o ambiente para `backend/supabase/`. A estrutura local foi corrigida; não houve nova publicação ou mudança no schema remoto.
