# Ferramentas de manutenção

- `catalog/`: seleção editorial e atualização dos metadados públicos via GitHub CLI.
- `tests/`: verificações de integridade do catálogo e das fontes.
- `research/`: cache local de pesquisa, ignorado pelo Git.

Os testes de catálogo não executam dentro do navegador e não são parte do backend de contas. Para rodá-los a partir da raiz:

```bash
npm --prefix frontend test
```

Para atualizar os metadados:

```bash
npm --prefix frontend run refresh
```

A atualização consulta a API oficial usando a autenticação já gerenciada pelo `gh`. O script resolve seus caminhos a partir do arquivo, escreve em `frontend/src/data/catalog.json` e preserva o catálogo anterior quando uma consulta falha. Não atualizar números durante uma reorganização de pastas.

O empacotador específico do frontend permanece em `frontend/scripts/standalone.mjs`, junto das dependências de build que utiliza.

[Mapa geral](../README.md)
