# Validação da entrega

Revisão em 16/10/2026. Versão 1.1.0.

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

O build gera `dist/` e um HTML independente. Na expansão, o JavaScript final ficou em aproximadamente 193 KB comprimidos com gzip. O Vite avisa sobre um chunk acima de 500 KB sem compressão; o build conclui, e o HTML independente mantém tudo em um arquivo. Dividir módulos para hospedagem é uma melhoria futura que deve preservar essa versão independente.

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

O HTML independente da primeira entrega foi aberto diretamente no Safari, sem servidor. O HTML da versão 1.1 também foi aberto diretamente no Chrome, exibindo os 150 registros. Os dados de teste foram removidos após a verificação.

## Publicação e autoria

Repositório público da conta pessoal: [thiagoebias/github-bookshelf](https://github.com/thiagoebias/github-bookshelf).

Portal: [GitHub Bookshelf](https://thiagoebias.github.io/github-bookshelf/).

[Workflow de validação e publicação](https://github.com/thiagoebias/github-bookshelf/actions/workflows/pages.yml). Alterações da branch main são testadas e publicadas pelo GitHub Pages. A primeira publicação foi concluída na [execução 38948594065](https://github.com/thiagoebias/github-bookshelf/actions/runs/38948594065), com HTTP 200 sem autenticação.

Credenciais, arquivos de ambiente, cache de pesquisa e caminhos privados foram excluídos da entrega pública. Os componentes do 21st.dev preservam atribuição e licença nos [créditos](../THIRD_PARTY_NOTICES.md).

## Limites e próximo passo

Os 150 projetos não foram instalados ou certificados. A curadoria é documental; avaliações e níveis são editoriais. Requisitos exatos e licenças devem ser conferidos nas fontes. Não há promessa de integração com bancos brasileiros.

A revisão responsiva usa emulação no Chrome; não substitui testes em aparelhos físicos. A transferência do backup entre dois dispositivos físicos distintos ainda não foi conferida. A estante permanece local ao navegador, sem sincronização de conta.

Próximo passo: conferir a experiência em um celular físico e evoluir a curadoria com casos de uso, comparações e feedback real.

Relacionado: [[github-bookshelf/README|Guia do projeto]] e [[github-bookshelf/docs/CURADORIA|Curadoria]].

[Voltar ao README](../README.md)
