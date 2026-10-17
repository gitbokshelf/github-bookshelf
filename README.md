# GitHub Bookshelf

[![Validação](https://github.com/gitbokshelf/github-bookshelf/actions/workflows/ci.yml/badge.svg)](https://github.com/gitbokshelf/github-bookshelf/actions/workflows/ci.yml)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-c3e99a)](LICENSE)

[![GitHub Bookshelf: sua biblioteca de possibilidades](docs/assets/cover.svg)](https://github-bookshelf.vercel.app/)

Um portal para descobrir projetos úteis do GitHub, com 150 projetos em 8 categorias, coleções e estante pessoal. Criado por [Thiago Ebias](https://github.com/thiagoebias).

[Portal publicado](https://github-bookshelf.vercel.app/) · [Guia da aplicação](frontend/README.md) · [Curadoria](docs/CURADORIA.md) · [Validação](docs/VALIDACAO.md)

## Organização e regra obrigatória

A estrutura e as responsabilidades são definidas em [ARQUITETURA.md](docs/ARQUITETURA.md). Toda tarefa deve consultar essa arquitetura e registrar execução e revisão no [registro obrigatório](docs/REGISTRO-DE-EXECUCAO.md), conforme [AGENTS.md](AGENTS.md).

```text
frontend/             Aplicação do navegador e seu build
backend/supabase/     Autenticação, banco, funções SQL, RLS e migrações
integrations/         GitHub, Outlook, Vercel e seus arquivos locais
docs/                 Arquitetura, decisões, curadoria e validação
tools/                Manutenção, testes do catálogo e cache ignorado
artifacts/            Arquivos gerados para entrega
.github/              Workflow do repositório
```

O código que acessa a API pelo navegador fica no frontend. O código executado no Supabase fica no backend. As credenciais reais são ignoradas pelo Git e não pertencem ao código público.

## Executar

Node.js 24 LTS e npm:

```bash
cd frontend
npm ci
npm run dev
```

Para conferir e gerar a aplicação, dentro de `frontend/`:

```bash
npm test
npm run build
npm run preview
```

Saídas: `frontend/dist/` e `artifacts/GitHub Bookshelf.html`. O HTML aberto por arquivo usa a estante de visitante.

Para habilitar o Supabase, configure `backend/supabase/.env.local` a partir do exemplo. O Vite localiza essa pasta a partir do próprio arquivo de configuração, inclusive quando o caminho do projeto contém espaços. Consulte [configuração e orientações do Supabase](backend/supabase/CONFIGURACAO.md).

## Estado atual

O portal está publicado na Vercel, com código aberto na conta `gitbokshelf`, temas claro/escuro, tipografia ampliada e integração de acesso e estante por conta com Supabase. O login da conta do produto foi conferido no Chrome. Salvar projeto, nota e progresso, recarregar e remover o registro de teste também foram conferidos. Recuperação de senha e uso em dois dispositivos ainda precisam de validação.

Português, inglês e espanhol ainda estão em desenvolvimento, sem seletor ativo. O repositório exclusivo [gitbokshelf/github-bookshelf](https://github.com/gitbokshelf/github-bookshelf) foi criado. O código foi enviado e a primeira implantação na Vercel respondeu HTTP 200 sem autenticação. O envio transacional de e-mails de produção continua pendente. Consulte os registros de cada integração antes da próxima publicação.

## Contribuir e licença

[Como contribuir](CONTRIBUTING.md), [licença MIT](LICENSE) e [créditos](THIRD_PARTY_NOTICES.md). Projeto independente, sem afiliação oficial com o GitHub ou os projetos catalogados.
