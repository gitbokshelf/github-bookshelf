# Validação da entrega

Revisão em 16/10/2026.

## Verificado

- Consulta dos metadados e leitura dos READMEs dos 30 projetos públicos.
- Cinco testes de integridade do catálogo, fontes, releases e configuração da publicação.
- TypeScript e build de produção concluídos.
- Servidor local com resposta HTTP 200.
- HTML independente aberto diretamente no Safari via arquivo local, sem servidor.
- Renderização visual no Safari em desktop.
- Busca por “finanças”, incluindo acentos, retornou três projetos da categoria.
- Categoria Mac e sistema Windows combinaram corretamente, exibindo o estado sem resultados.
- Favorito salvo, status alterado para Em uso, nota gravada e preservados após recarregar a página.
- Contadores da estante refletiram o status real.
- Pasta Mac abriu os quatro itens; escolher Rectangle abriu os detalhes corretos.
- O espaçamento das pastas foi corrigido após inspeção visual.
- Dados, versões e avaliações editoriais aparecem separados, com fontes e metodologia.

## Limites

Os projetos do catálogo não foram instalados ou certificados. A validação visual desta entrega foi feita em desktop; as regras responsivas foram implementadas, mas não equivalem a testes em dispositivos físicos Android e iOS.

Exportação e importação têm validação de formato no código; ainda precisam de uma rodada completa de testes de transferência entre dispositivos. A estante permanece local ao navegador. O portal não atualiza o catálogo em tempo real.

As páginas oficiais dos dois componentes do 21st.dev identificam licença MIT. Autores, fontes e adaptações estão registrados [nos créditos](../THIRD_PARTY_NOTICES.md).

## Publicação

Repositório público: [thiagoebias/github-bookshelf](https://github.com/thiagoebias/github-bookshelf).

Portal: [GitHub Bookshelf](https://thiagoebias.github.io/github-bookshelf/).

Primeira publicação concluída pelo GitHub Actions em 16/10/2026, com build e deploy aprovados na [execução 38948594065](https://github.com/thiagoebias/github-bookshelf/actions/runs/38948594065). Repositório e página responderam HTTP 200 sem autenticação. O workflow publica novas alterações da branch main após os checks.

## Próximo passo

Validar a experiência em um celular físico, completar o teste de transferência do backup e ampliar a curadoria com casos de uso reais.

Relacionado: [[github-bookshelf/README|Guia do projeto]] e [[github-bookshelf/docs/CURADORIA|Curadoria]].

[Voltar ao README](../README.md)
