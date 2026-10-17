# Backend

O backend do GitHub Bookshelf é executado no Supabase. Esta pasta guarda sua estrutura versionável: migrações, funções de banco, políticas de acesso e testes SQL.

- [Supabase e registro de configuração](supabase/CONFIGURACAO.md).
- [Migração da estante por usuário](supabase/migrations/202610170001_user_shelves.sql).
- [Teste transacional de isolamento](supabase/tests/isolation.sql).

O frontend chama a API do Supabase com a chave publicável e a sessão do usuário. Senhas de usuários são tratadas pelo Supabase Auth. A escrita da estante usa a função `save_my_shelf`, que determina o proprietário pela sessão e confere a revisão antes de salvar.

Não existe processo Node/Express para iniciar nesta pasta. As funções SQL e as políticas RLS são o código de backend atual, não apenas arquivos de conexão. O teste de isolamento foi executado no banco, com rollback dos registros temporários; ainda não há execução desse teste SQL no GitHub Actions.

Alterações futuras no banco devem criar uma nova migração. Não alterar uma migração já aplicada para representar uma mudança nova.

[Arquitetura do produto](../docs/ARQUITETURA.md) · [Mapa geral](../README.md)
