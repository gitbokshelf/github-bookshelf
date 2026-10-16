# GitHub Bookshelf

[![Publicação](https://github.com/thiagoebias/github-bookshelf/actions/workflows/pages.yml/badge.svg)](https://github.com/thiagoebias/github-bookshelf/actions/workflows/pages.yml)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-c3e99a)](LICENSE)

[![GitHub Bookshelf: sua biblioteca de possibilidades](docs/assets/cover.svg)](https://thiagoebias.github.io/github-bookshelf/)

Menos abas abertas. Mais descobertas.

Um portal em português para descobrir projetos úteis do GitHub e entender onde eles entram na vida real. Criado por [Thiago Ebias](https://github.com/thiagoebias).

[Abrir o portal](https://thiagoebias.github.io/github-bookshelf/) · [Como contribuir](CONTRIBUTING.md) · [Fontes e metodologia](docs/CURADORIA.md)

## O que você encontra

- 30 projetos reais, distribuídos em 8 categorias.
- Busca por nome, descrição, categoria, tags e sistema, com tratamento de acentos.
- Filtros por sistema, experiência e licença identificada.
- Ordenação por curadoria, estrelas, avaliação editorial, release, criação e atividade.
- Coleções com pastas de vidro interativas do 21st.dev.
- Estante pessoal com favoritos, notas, progresso e widgets reorganizáveis.
- Exportação e importação da estante em JSON.
- Guias sobre GitHub, organização de projetos, skills e produtividade no Mac.
- Uma versão HTML independente gerada no build, para abrir localmente.

As categorias cobrem Mac e produtividade, IA e agentes, web e interfaces, arquivos, finanças pessoais, ferramentas de desenvolvimento, estudo e organização de projetos.

## Executar localmente

Pré-requisito: Node.js 24 LTS e npm.

```bash
npm ci
npm run dev
```

Abra a URL informada pelo Vite. Para validar e gerar a versão final:

```bash
npm test
npm run build
npm run preview
```

O build cria `dist/` para hospedagem e `GitHub Bookshelf.html` na raiz. Esse HTML reúne JavaScript, CSS e catálogo no próprio arquivo. Fontes externas são opcionais; links para os projetos precisam de internet. O arquivo independente pode ser obtido também como artefato da execução do GitHub Actions.

## Estrutura

```text
src/
  components/
    layout/          Navegação da aplicação
    ui/              Componentes reutilizáveis, incluindo os anexos do 21st.dev
    hero.tsx         Abertura visual da biblioteca
    project-*.tsx    Capa, cartão e detalhes de projeto
  data/
    catalog.json     Retrato dos metadados oficiais do GitHub
    guides.ts        Conteúdo editorial dos guias
    index.ts         Categorias, tipos e formatação
    types.ts         Tipos compartilhados de navegação
  hooks/
    use-library.ts   Estado, notas e persistência da estante
  pages/
    collections.tsx  Coleções temáticas
    guides.tsx       Entrada dos guias
  App.tsx            Busca, filtros e composição das telas
  styles.css         Identidade visual e responsividade
scripts/
  curation.mjs       Seleção e contexto editorial dos projetos
  refresh-catalog.mjs  Coleta de metadados públicos via GitHub CLI
  standalone.mjs     Geração do HTML independente
public/              Recursos públicos
.github/workflows/   Validação e publicação no GitHub Pages
```

React 19, TypeScript, Vite, Tailwind CSS 4, Motion e Lucide. O alias `@/` aponta para `src/`. Os componentes ficam em `src/components/ui`, conforme a configuração shadcn em `components.json`. Não há Redux, backend ou banco de dados porque a versão atual não precisa deles.

## Atualizar o catálogo

O portal publicado não chama a API do GitHub no navegador. Os dados são um retrato com data de consulta visível. A seleção e os textos editoriais ficam em `scripts/curation.mjs`.

Com [GitHub CLI](https://cli.github.com/) instalado e autenticado:

```bash
npm run refresh
npm test
npm run build
```

O script consulta apenas endpoints públicos de repositórios, README e releases. Usa a autenticação já gerenciada pelo `gh`, sem copiar tokens para arquivos ou para o navegador. Se uma consulta falhar, preserva o catálogo anterior. A pasta `research/` é um cache local ignorado pelo Git.

Depois de revisar os textos e resultados, faça commit e envie para `main`. O GitHub Actions valida e publica a versão no Pages. A atualização dos dados é manual nesta versão.

## Seus dados

Favoritos, notas, progresso e ordem dos widgets ficam no `localStorage` do navegador. Não há conta, analytics ou sincronização com servidor. Originais, versões locais e GitHub Pages têm armazenamentos separados. Exporte e importe o JSON para levar a estante entre eles. A importação mescla os projetos e substitui as notas e o status dos projetos que já existirem no backup.

## Curadoria e limites

Estrelas e datas vêm da API oficial. Nível, compatibilidade e avaliações são editoriais. A nota não é uma avaliação da comunidade nem certificação de qualidade. Os projetos catalogados não foram instalados como parte da curadoria. Plataformas podem envolver dependências como Docker. Licenças, serviços pagos e requisitos devem ser conferidos nas fontes.

Leia a [metodologia](docs/CURADORIA.md), o [registro de validação](docs/VALIDACAO.md) e os [créditos de terceiros](THIRD_PARTY_NOTICES.md).

## Próximos passos

- Ampliar a curadoria com casos de uso e fontes verificadas.
- Adicionar comparações entre ferramentas para o mesmo objetivo.
- Avaliar atualização periódica dos metadados sem perder revisão editorial.
- Considerar sincronização opcional da estante entre dispositivos.

## Licença

O código original do portal está sob [MIT](LICENSE). Componentes e dependências de terceiros preservam suas próprias atribuições. GitHub Bookshelf é um projeto independente, sem afiliação oficial com o GitHub ou com os projetos listados.

Documentação relacionada: [[github-bookshelf/docs/CURADORIA|Curadoria]] e [[github-bookshelf/docs/VALIDACAO|Validação]]. Os links Markdown acima continuam disponíveis para navegação no GitHub.
