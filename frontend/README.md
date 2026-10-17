# GitHub Bookshelf

[![Validação](https://github.com/gitbokshelf/github-bookshelf/actions/workflows/ci.yml/badge.svg)](https://github.com/gitbokshelf/github-bookshelf/actions/workflows/ci.yml)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-c3e99a)](../LICENSE)

[![GitHub Bookshelf: sua biblioteca de possibilidades](../docs/assets/cover.svg)](https://githubbokshelf.hubdetrabalho.com.br/)

Menos abas abertas. Mais descobertas.

Um portal em português para descobrir projetos úteis do GitHub e entender onde eles entram na vida real. Criado por [Thiago Ebias](https://github.com/thiagoebias).

[Abrir o portal](https://githubbokshelf.hubdetrabalho.com.br/) · [HTML nos artefatos da CI](https://github.com/gitbokshelf/github-bookshelf/actions/workflows/ci.yml) · [Como contribuir](../CONTRIBUTING.md) · [Fontes e metodologia](../docs/CURADORIA.md)

## O que você encontra

- 150 projetos reais, distribuídos em 8 categorias.
- Busca por nome, descrição, categoria, tags e sistema, com tratamento de acentos.
- 24 cartões por vez e opção para exibir todos os resultados.
- Filtros por sistema, experiência e licença identificada.
- Ordenação por curadoria, estrelas, avaliação editorial, release, criação e atividade.
- Coleções com pastas de vidro interativas do 21st.dev.
- Estante pessoal com favoritos, notas, progresso e widgets reorganizáveis.
- Exportação e importação da estante em JSON.
- Temas claro, escuro e do sistema, com preferência salva.
- Login por e-mail e integração de estante privada com Supabase, disponíveis em ambientes configurados.
- Guias sobre GitHub, organização de projetos, skills e produtividade no Mac.
- Uma versão HTML independente gerada no build, para abrir localmente.

As categorias cobrem Mac e produtividade, IA e agentes, web e interfaces, arquivos, finanças pessoais, ferramentas de desenvolvimento, estudo e organização de projetos.

## Executar localmente

Pré-requisito: Node.js 24 LTS e npm.

```bash
cd frontend
npm ci
npm run dev
```

Abra a URL informada pelo Vite.

Para habilitar login, copie `../backend/supabase/.env.example` para `../backend/supabase/.env.local` e configure o projeto conforme [o registro do Supabase](../backend/supabase/CONFIGURACAO.md). O catálogo continua utilizável como visitante quando a integração não está configurada. O HTML aberto por arquivo usa a estante local.

Execute os comandos a seguir dentro de `frontend/`:

```bash
npm test
npm run build
npm run preview
```

O build cria `frontend/dist/` para hospedagem e `artifacts/GitHub Bookshelf.html` para uso local. Esse HTML reúne JavaScript, CSS e catálogo no próprio arquivo. Fontes externas são opcionais; links para os projetos precisam de internet. O arquivo independente pode ser obtido também como artefato da execução do GitHub Actions.

## Estrutura

Os caminhos abaixo são relativos a `frontend/`. Backend, integrações, documentação de produto e ferramentas têm áreas próprias, conforme a [arquitetura](../docs/ARQUITETURA.md).

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
    use-theme.ts     Preferência de aparência
  api/               Cliente Supabase, sem chave administrativa
  context/           Sessão autenticada
  services/          Leitura e gravação da estante remota
  pages/
    collections.tsx  Coleções temáticas
    guides.tsx       Entrada dos guias
  App.tsx            Busca, filtros e composição das telas
  styles.css         Identidade visual e responsividade
scripts/
  standalone.mjs     Geração do HTML independente
public/              Recursos públicos
```

React 19, TypeScript, Vite, Tailwind CSS 4, Motion e Lucide. Supabase fornece autenticação e banco para a estante por conta. A versão hospedada separa aplicação, catálogo, Supabase e bibliotecas; esbuild os reúne novamente no HTML independente. O alias `@/` aponta para `src/`. Os componentes ficam em `src/components/ui`, conforme a configuração shadcn em `components.json`. Não há Redux: o estado atual usa hooks e contexto. Pastas são criadas quando têm uma função real.

## Atualizar o catálogo

Os caminhos de manutenção nesta seção são relativos à raiz do repositório. O comando npm encaminha a execução à ferramenta em `tools/`.

O portal publicado não chama a API do GitHub no navegador. Os dados são um retrato com data de consulta visível. A seleção e os textos editoriais ficam em `tools/catalog/curation.mjs` e nos arquivos `tools/catalog/curation-extra-*.mjs` que ele importa.

Com [GitHub CLI](https://cli.github.com/) instalado e autenticado:

Dentro de `frontend/`:

```bash
npm run refresh
npm test
npm run build
```

O script consulta apenas endpoints públicos de repositórios, README e releases. Usa a autenticação já gerenciada pelo `gh`, sem copiar tokens para arquivos ou para o navegador. Se uma consulta falhar, preserva o catálogo anterior. A pasta `tools/research/`, na raiz do projeto, é um cache local ignorado pelo Git.

Depois de revisar os textos e resultados, faça commit e envie para `main`. O GitHub Actions valida a mudança; a integração da Vercel publica o frontend a partir de `main`. A atualização dos dados é manual nesta versão.

## Seus dados

Como visitante, favoritos, notas e progresso ficam no `localStorage`. Em ambiente com Supabase configurado, entrar abre uma estante separada por conta e sincroniza projetos, notas e progresso com o banco. O cache é isolado por usuário. A estante de visitante não é enviada automaticamente. O controle de revisão interrompe gravações quando outra sessão já alterou a estante; a interface permite exportar a versão local e carregar a remota. A ordem dos widgets continua local e separada por conta.

Domínio próprio, alias Vercel, origens locais e GitHub Pages têm sessões e caches separados. A mesma conta recupera a estante remota ao entrar em cada origem; os dados de visitante continuam locais. Exporte e importe o JSON para levar a estante entre eles. A importação mescla projetos e substitui notas e status dos mesmos registros. Não há analytics. O login da conta do produto e a persistência de projeto, nota e progresso após recarregar foram conferidos no Chrome. A remoção do registro temporário também persistiu. Recuperação de senha e uso em dois dispositivos continuam pendentes. A produção está em `https://githubbokshelf.hubdetrabalho.com.br/`. Login, nota e progresso foram conferidos no Safari de produção e no Chrome local, na mesma conta e no mesmo Mac. SMTP de produção, recuperação e dois dispositivos físicos continuam pendentes.

## Curadoria e limites

Estrelas e datas vêm da API oficial. Nível, compatibilidade e avaliações são editoriais. A nota não é uma avaliação da comunidade nem certificação de qualidade. Os projetos catalogados não foram instalados como parte da curadoria. Plataformas podem envolver dependências como Docker. Licenças, serviços pagos e requisitos devem ser conferidos nas fontes.

Leia a [metodologia](../docs/CURADORIA.md), o [registro de validação](../docs/VALIDACAO.md) e os [créditos de terceiros](../THIRD_PARTY_NOTICES.md).

## Próximos passos

- Ampliar a curadoria com casos de uso e fontes verificadas.
- Adicionar comparações entre ferramentas para o mesmo objetivo.
- Avaliar atualização periódica dos metadados sem perder revisão editorial.
- Validar a sincronização entre dispositivos e configurar o envio de e-mail para produção.
- Concluir português, inglês e espanhol. Os dicionários estão em elaboração, ainda sem seletor ativo.

## Licença

O código original do portal está sob [MIT](../LICENSE). Componentes e dependências de terceiros preservam suas próprias atribuições. GitHub Bookshelf é um projeto independente, sem afiliação oficial com o GitHub ou com os projetos listados.

Documentação relacionada: [Curadoria](../docs/CURADORIA.md), [Validação](../docs/VALIDACAO.md) e [Supabase](../backend/supabase/CONFIGURACAO.md).
