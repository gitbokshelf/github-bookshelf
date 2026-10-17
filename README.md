# GitHub Bookshelf

[![Validação](https://github.com/gitbokshelf/github-bookshelf/actions/workflows/ci.yml/badge.svg)](https://github.com/gitbokshelf/github-bookshelf/actions/workflows/ci.yml)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-c3e99a)](LICENSE)

[![GitHub Bookshelf: sua biblioteca de possibilidades](docs/assets/cover.svg)](https://githubbokshelf.hubdetrabalho.com.br/)

Um portal para descobrir projetos úteis do GitHub, com 150 projetos em 8 categorias, coleções e estante pessoal. Criado por [Thiago Ebias](https://github.com/thiagoebias).

[Portal publicado](https://githubbokshelf.hubdetrabalho.com.br/) · [Guia da aplicação](frontend/README.md) · [Curadoria](docs/CURADORIA.md) · [Validação](docs/VALIDACAO.md)

## Organização e regra obrigatória

A estrutura e as responsabilidades são definidas em [ARQUITETURA.md](docs/ARQUITETURA.md). Toda tarefa deve consultar essa arquitetura e registrar execução e revisão no [registro obrigatório](docs/REGISTRO-DE-EXECUCAO.md), conforme [AGENTS.md](AGENTS.md).

```text
frontend/             Aplicação do navegador e seu build
backend/supabase/     Autenticação, banco, funções SQL, RLS e migrações
integrations/         Serviços externos e seus arquivos locais
  github/             Repositório e publicação do código
  vercel/             Hospedagem e domínio
  locaweb/            DNS do subdomínio
  outlook/            Contato do produto
  resend/             SMTP e alertas transacionais
security/             Engenharia de segurança, testes, carga e modelos reutilizáveis
docs/                 Arquitetura, decisões, curadoria e validação
tools/                Manutenção e testes do catálogo
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

O portal está publicado na Vercel, com código aberto na conta `gitbokshelf`, temas claro/escuro, tipografia ampliada e integração de acesso e estante por conta com Supabase. O login e a estante foram conferidos no Safari de produção e no Chrome local, na mesma conta. Salvar projeto, nota e progresso, recarregar, receber a alteração no outro navegador e remover o registro de teste também foram conferidos. Recuperação de senha e uso em dois dispositivos ainda precisam de validação.

Português, inglês e espanhol foram solicitados e continuam pendentes de integração e seletor. O código público está em [gitbokshelf/github-bookshelf](https://github.com/gitbokshelf/github-bookshelf), com publicação na Vercel. SMTP de produção foi ativado com Resend; entrega e recuperação completa seguem em validação. Consulte os registros de cada integração antes da próxima publicação.

## Pendências para divulgação

A infraestrutura está publicada e os fluxos principais foram conferidos. O produto ainda tem entregas pendentes:

1. Configurar envio transacional e validar cadastro, confirmação e recuperação de senha para usuários externos. SMTP personalizado foi ativado em 17/10/2026; a recuperação completa ainda precisa da conferência do proprietário.
2. Concluir português, inglês e espanhol, incluindo seletor, guias, ilustrações, mensagens e acessibilidade. Os rascunhos sem integração foram removidos na limpeza; a tradução continua como entrega pendente.
3. Ampliar testes de autenticação, troca de contas, concorrência, uso offline e dois dispositivos físicos. A CI inclui testes de catálogo e segurança de entradas/configuração, sem suíte automática completa desses fluxos.
4. Completar informações de privacidade e gestão de dados, incluindo exclusão de conta. A exportação de estante existe; a conta hoje oferece saída, sem fluxo próprio de exclusão. Definir e testar restauração operacional do backend.
5. Medir desempenho e ampliar revisão de acessibilidade e aparelhos físicos. O orçamento de build passou, com ensaio local limitado, sem teste de carga autenticada ou medição completa de produção.

A exclusão futura do repositório pessoal permanece [registrada na integração GitHub](integrations/github/README.md). Antes dela, conferir itens exclusivos e acesso à conta correta.

## Contribuir e licença

[Como contribuir](CONTRIBUTING.md), [licença MIT](LICENSE) e [créditos](THIRD_PARTY_NOTICES.md). Projeto independente, sem afiliação oficial com o GitHub ou os projetos catalogados.

## Segurança

A [área de engenharia de segurança](security/README.md) reúne ameaças, regras para agentes e prompt injection, controles das integrações, testes, capacidade, operação e [modelos reutilizáveis](security/PORTABILIDADE.md). O build verifica a distribuição; a CI inclui auditoria de dependências, detecção de segredos e análise CodeQL. Consulte a [revisão e seus limites](security/REVISAO.md) antes de interpretar resultados como aprovação integral do produto. Relatos privados seguem [SECURITY.md](SECURITY.md).
