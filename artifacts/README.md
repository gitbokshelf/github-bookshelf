# Arquivos gerados para entrega

`npm --prefix frontend run build` gera nesta pasta o arquivo `GitHub Bookshelf.html`, que pode ser aberto localmente com a estante de visitante.

O HTML gerado é ignorado pelo Git. A aplicação hospedada é gerada em `frontend/dist/`, também ignorada. Não editar saídas geradas; alterar a fonte e reconstruir.

O build também gera `build-report.json`, com pesos de JavaScript/CSS, compressão e resultado do orçamento definido em `frontend/scripts/check-bundle.mjs`. Esse relatório local não contém credenciais e também é ignorado.

[Mapa geral](../README.md)
