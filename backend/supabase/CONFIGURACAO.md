# Configuração do Supabase

Integração exclusiva do GitHub Bookshelf, configurada em 17/10/2026.

Nome no painel: GitHub Bookshelf. Identificador: `dxnfhzgxdkhdggqoogft`. Endpoint: `https://dxnfhzgxdkhdggqoogft.supabase.co`. Região: `us-east-2`.

A pasta original `supabse` foi padronizada como `backend/supabase`, reunindo a estrutura do backend e sua configuração local. O cliente do navegador está em `frontend/src/api/supabase.ts`, `frontend/src/context/auth-context.tsx` e `frontend/src/services/shelf-service.ts`.

## Arquivos locais

| Arquivo                 | Uso                                                                 | Git público |
| ----------------------- | ------------------------------------------------------------------- | ----------- |
| `.env.local`            | URL e chave publicável usadas pelo Vite                             | Ignorado    |
| `connection.local.json` | Referência do projeto, painel e conta administrativa                | Ignorado    |
| `secrets.local.env`     | Campos reservados para eventual senha do banco/chave administrativa | Ignorado    |
| `migrations/`           | Estrutura versionada, sem credenciais                               | Permitido   |
| `tests/`                | Teste transacional de isolamento                                    | Permitido   |

Os três arquivos locais têm permissão 600, leitura e escrita apenas pelo proprietário no Mac. Isso não os criptografa: esta pasta também está no OneDrive. O arquivo de segredos está sem valores porque a configuração foi feita pela sessão do painel; nenhuma senha ou chave administrativa foi coletada. Os arquivos privados não são copiados para o build.

O Vite lê variáveis a partir desta pasta. Somente variáveis prefixadas com `VITE_` entram no frontend. Nunca adicionar esse prefixo a uma senha ou chave secret/service_role. A chave publicável, por definição, faz parte do aplicativo distribuído; o isolamento é garantido pela sessão do usuário e pelas políticas do banco.

## Estrutura aplicada

Migração: [202610170001_user_shelves.sql](migrations/202610170001_user_shelves.sql).

- `user_shelves`: uma linha por usuário autenticado, ligada a `auth.users`.
- RLS habilitada; cada usuário só lê a própria linha.
- Escritas passam por `save_my_shelf`. O proprietário vem de `auth.uid()`, nunca de um ID informado pelo cliente.
- Revisão otimista impede sobrescrever silenciosamente uma versão editada em outro dispositivo.
- Validação de JSON, status, tamanho de nota e limite de 2 MB por estante.
- Visitantes não acessam a tabela nem a função de gravação.
- Excluir um usuário remove sua linha pela chave estrangeira. Nenhuma exclusão de usuário foi feita nesta configuração.

## Autenticação

Login por e-mail habilitado, cadastro permitido, confirmação de e-mail exigida e senha mínima de 12 caracteres. Login anônimo continua desabilitado. O frontend usa PKCE, renovação de sessão e recuperação de senha. Senhas são enviadas diretamente ao Supabase pelo SDK e não são gravadas nos arquivos do projeto.

Site URL de produção: `https://githubbokshelf.hubdetrabalho.com.br/`, configurada em 17/10/2026 após validar o domínio próprio.

Retornos exatos permitidos: domínio próprio `https://githubbokshelf.hubdetrabalho.com.br/`, alias `https://github-bookshelf.vercel.app/`, portal anterior da conta pessoal, `127.0.0.1` e `localhost` nas portas 5173 e 4173. São sete retornos, sem curingas de domínio. Para adotar outro domínio, validar HTTPS antes de atualizar a Site URL e a lista.

## Validação feita

- `/auth/v1/settings`: HTTP 200 com a chave publicável.
- Consulta anônima à tabela: HTTP 401, código 42501.
- Chamada anônima à função: HTTP 401, código 42501.
- [Teste SQL](tests/isolation.sql): aprovado com dois usuários temporários, leitura isolada, escrita direta negada, conflito de revisão e JSON inválido rejeitados. A transação terminou com rollback; os registros de teste não ficaram no banco.
- O schema public não tinha tabelas antes da migração.

## Pendências de produção

- SMTP próprio ou Send Email Hook: o remetente padrão do Supabase só atende membros da organização e tem limite baixo. Não é um serviço de cadastro público em produção.
- Validar entrega dos e-mails de confirmação e recuperação, recuperação completa de senha e entrada em dois dispositivos. O login da conta do produto e a persistência no portal já foram conferidos no Chrome.
- Testar duas sessões/dispositivos, alternância de contas, uso offline e resolução de conflitos na interface.
- Validar o ciclo completo de autenticação no endereço de produção. URL e chave publicável foram configuradas na Vercel; arquivos locais ignorados não foram enviados.
- Completar textos de privacidade e gestão de conta antes de divulgar cadastros ao público. URL final, domínio e login já foram configurados e conferidos.

## Fontes oficiais

[Chaves de API](https://supabase.com/docs/guides/getting-started/api-keys), [senhas](https://supabase.com/docs/guides/auth/passwords), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

[Voltar ao projeto](../../README.md)

## Organização das integrações

A aplicação do navegador fica em `frontend/`; o backend fica em `backend/supabase/`. GitHub, Vercel e Outlook ficam em suas pastas dentro de `integrations/`. Cada área mantém suas orientações. Os arquivos `*.local.*`, `.env*` e subpastas `private/` previstos no `.gitignore` não devem ser versionados.

A conta administrativa do Supabase e a conta de acesso ao portal têm funções diferentes. Criar a primeira não cria automaticamente um usuário em `auth.users`. O cadastro pelo portal deve confirmar o e-mail antes do login.

## Implementação do cliente no portal

O botão Entrar abre os formulários de acesso, cadastro e recuperação. O SDK oficial envia as credenciais diretamente ao Supabase. O cache de estantes usa uma chave por usuário. A estante de visitante permanece no formato anterior e não é enviada silenciosamente ao criar uma conta.

Gravações usam a revisão lida do servidor. Em conflito, a sincronização para e mantém as alterações locais. A ação Exportar e carregar versão da nuvem gera um JSON e também preserva uma cópia local por conta antes de carregar o registro remoto. Essa resolução ainda precisa de teste completo na interface com duas sessões reais.

As requisições de estante capturam o token da identidade esperada antes de acessar o banco. Trocar a conta enquanto uma requisição aguarda não reaproveita o conteúdo da conta anterior para a nova sessão.

O HTML aberto por `file://` mantém o modo de visitante. Login e sincronização são usados no portal servido por HTTP/HTTPS. O formulário foi conferido no Chrome em modo escuro e claro, também em largura emulada de 390 px. Nenhuma senha foi preenchida pelo agente.

## O que não foi feito

Não foi copiada a chave secret/service_role, não foi acessada a senha do banco, não foi criado login com senha inventada e não foi enviada mensagem à caixa postal. Nenhum plano pago, domínio ou serviço de envio foi contratado. A publicação na Vercel e o repositório exclusivo foram configurados na etapa seguinte, registrada na documentação das integrações.

## Histórico da configuração inicial

TypeScript e build de produção aprovados; os seis testes do catálogo também passaram. A verificação de arquivos candidatos ao Git não encontrou padrões de chave administrativa ou chave privada. Os arquivos locais de conexão estão ignorados e com permissão 600. Os links relativos deste documento foram conferidos.

O proprietário concluiu o primeiro cadastro. A interface mostrou a conta do produto autenticada. Foi salvo um Maccy temporário com nota e status Em uso; ambos permaneceram após recarregar, com a indicação Estante salva na sua conta. O registro temporário foi removido; outra recarga confirmou a remoção. Nenhuma senha foi preenchida ou recebida pelo agente. Recuperação e dois dispositivos continuam pendentes. As alterações locais não foram publicadas na versão pública anterior.

## Reorganização da aplicação

Em 17/10/2026, a primeira organização foi corrigida para separar frontend, backend, integrações, documentação e ferramentas. Os arquivos de conexão foram preservados em `backend/supabase/`, com seus valores e permissões. `frontend/vite.config.ts` resolve `../backend/supabase/` a partir do próprio arquivo, com tratamento de espaços no caminho. Para iniciar, use `npm --prefix frontend run dev` na raiz. A arquitetura vigente está em [ARQUITETURA.md](../../docs/ARQUITETURA.md) e toda execução/revisão deve ser registrada em [REGISTRO-DE-EXECUCAO.md](../../docs/REGISTRO-DE-EXECUCAO.md).

## Validação da publicação Vercel

Em 17/10/2026, o proprietário entrou no portal de produção no Safari. Um projeto temporário com nota e progresso foi salvo e permaneceu após recarregar. No Chrome local, autenticado na mesma conta, uma recarga trouxe projeto, nota e progresso do backend. O registro temporário foi removido e a remoção persistiu nas duas origens. Esse teste usa dois navegadores no mesmo Mac, sem comprovar dois dispositivos físicos. O estado inicial e final da estante foram preservados. A execução completa está no [registro obrigatório](../../docs/REGISTRO-DE-EXECUCAO.md).

## Domínio próprio

O domínio `githubbokshelf.hubdetrabalho.com.br` foi configurado na Vercel e na Locaweb em 17/10/2026. Site URL e retorno exato foram salvos e conferidos no painel. O alias Vercel e as origens locais continuam permitidos. Sessões de navegador são separadas por origem; entrar no novo endereço não reaproveita automaticamente o login de vercel.app. A conta usa a mesma estante no backend. Após o proprietário entrar, o Safari mostrou Minha conta e a estante com sincronização concluída. Recarregar preservou a sessão e a leitura da estante no domínio próprio. Nenhum projeto, nota ou progresso foi alterado nessa conferência. A gravação e a sincronização entre origens já verificadas no endereço Vercel permanecem como evidências da etapa anterior. Recuperação por e-mail e SMTP de produção continuam pendentes.

## Revisão defensiva de 17/10/2026

Duas verificações anônimas de baixo volume retornaram HTTP 401: leitura de `user_shelves` e tentativa de chamar `save_my_shelf`. Executadas por `security/tools/check-anonymous.mjs --live` com somente chave publicável; nenhum dado de estante retornado ou alterado. Não substituem teste entre duas contas. A migração aplicada não foi modificada nem reaplicada.

Painel Auth, somente leitura: login/cadastro 30 requisições por 5 minutos/IP, verificação 30 por 5 minutos/IP, refresh 150 por 5 minutos/IP, e-mails 2/h; CAPTCHA desligado. Esses limites não cobrem RPC. Quota de gravação, automação, SMTP e recuperação precisam de implantação/teste próprios. Detalhes e limites em [segurança](../../security/README.md).

## Atualização de SMTP e gravações, 17/10/2026

SMTP personalizado ativo e persistido no painel: [Resend](../../integrations/resend/README.md), porta 465, remetente `acesso@auth.githubbokshelf.hubdetrabalho.com.br`. Chave somente de envio, restrita ao domínio, guardada no campo privado do Supabase. E-mails passam ao limite inicial de 30/h. Recuperação completa ainda depende de teste com o proprietário definindo a senha; não foi feita troca automática de senha.

Migração `202610170002_write_quota.sql` aplicada pelo SQL Editor ao projeto `dxnfhzgxdkhdggqoogft`. Sucesso confirmado, seguido de consulta somente leitura: tabela de quota existe, RLS ativo, acesso direto negado, escrita direta em estantes negada, RPC permitida para authenticated e PT429 presente no corpo. Os seis indicadores retornaram true.

A quota é por conta, compartilhada entre dispositivos: rajada de 10 escritas aceitas, reposição de um crédito/2 segundos, 30/min em média. Registros inválidos e conflitos sofrem rollback sem consumir crédito; isso não limita todas as requisições maliciosas nem substitui WAF/controle de IP. O cliente mantém o cache e faz três novas tentativas espaçadas; depois exige tentativa manual. Nenhuma estante real foi modificada pela migração/conferência.

Ensaio isolado: `node backend/supabase/tools/test-database.mjs`. Requer PostgreSQL local e Node 24; usa cluster descartável somente loopback, sem serviço permanente, com contrato Auth mínimo emulado. Testa migrações, RLS/isolamento, quota/refill e pg_dump/pg_restore em outro banco, incluindo dado sintético, RLS e privilégios. Remove cluster e dump ao terminar. Relatório sanitizado em artifacts/security/database-tests.json. Não comprova recuperação do Supabase Auth real ou backup de produção.
