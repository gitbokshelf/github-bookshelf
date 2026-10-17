# Vercel

Conta dedicada confirmada no Safari, equipe `githubbokshelf` e perfil `githubbokshelf-5039`. O e-mail fica no cadastro privado da integração. A conexão GitHub e a implantação ainda não foram concluídas.

## Build do monorepositório

Usar Root Directory na raiz do repositório, sem selecionar `frontend`. O arquivo [vercel.json](../../vercel.json) define framework Vite, instalação `npm --prefix frontend ci`, build `npm --prefix frontend run build` e saída `frontend/dist`. Usar Node.js 24.

Essa decisão mantém disponíveis no build os diretórios irmãos `backend/supabase`, `tools` e `artifacts`. Não é necessário enviar arquivos privados nem habilitar acesso a arquivos externos a uma raiz de aplicação reduzida.

Configurar no painel as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` com os valores da configuração local do backend. Apenas a chave publicável pode entrar no build do navegador. Nunca usar secret/service_role.

Conectar somente `gitbokshelf/github-bookshelf` na instalação GitHub quando a plataforma oferecer seleção por repositório. A conexão requer revisão das permissões na tela de autorização.

Após a implantação, registrar a URL real, atualizar canonical/OG e adicionar essa origem aos retornos exatos e à Site URL no Supabase. Validar o endereço público e a autenticação antes de declarar a publicação concluída.

Credenciais e metadados locais devem usar `*.local.*` ou `private/`. O diretório `.vercel/` também é ignorado pelo Git.

[Voltar ao projeto](../../README.md)
