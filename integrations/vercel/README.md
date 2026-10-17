# Vercel

Conta dedicada confirmada no Safari, equipe `githubbokshelf` e perfil `githubbokshelf-5039`. O e-mail fica no cadastro privado da integração. A conexão GitHub foi concluída e a primeira implantação ficou Ready em 17/10/2026.

Portal público principal: [githubbokshelf.hubdetrabalho.com.br](https://githubbokshelf.hubdetrabalho.com.br/). Alias técnico preservado: [github-bookshelf.vercel.app](https://github-bookshelf.vercel.app/). Painel: [projeto Vercel](https://vercel.com/githubbokshelf/github-bookshelf). Primeira implantação: `dpl_FEcyMRNByxeThiqEGzwofFiXeRVj`, código `9f61adb`. O endereço público respondeu HTTP 200 sem autenticação.

## Build do monorepositório

Usar Root Directory na raiz do repositório, sem selecionar `frontend`. O arquivo [vercel.json](../../vercel.json) define framework Vite, instalação `npm --prefix frontend ci`, build `npm --prefix frontend run build` e saída `frontend/dist`. Usar Node.js 24.

Essa decisão mantém disponíveis no build os diretórios irmãos `backend/supabase`, `tools` e `artifacts`. Não é necessário enviar arquivos privados nem habilitar acesso a arquivos externos a uma raiz de aplicação reduzida.

Configurar no painel as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` com os valores da configuração local do backend. Apenas a chave publicável pode entrar no build do navegador. Nunca usar secret/service_role.

Conectar somente `gitbokshelf/github-bookshelf` na instalação GitHub quando a plataforma oferecer seleção por repositório. A conexão requer revisão das permissões na tela de autorização.

A Site URL do Supabase foi atualizada para `https://githubbokshelf.hubdetrabalho.com.br/`, também incluída como retorno exato. Os retornos locais e do portal anterior foram preservados, sem curingas. Canonical e OG apontam para a URL de produção. O SMTP transacional de produção e a recuperação completa continuam pendentes; criar as contas dos provedores não configura esse envio.

Credenciais e metadados locais devem usar `*.local.*` ou `private/`. O diretório `.vercel/` também é ignorado pelo Git.

[Voltar ao projeto](../../README.md)

## Domínio próprio, 17/10/2026

O subdomínio foi adicionado à produção deste projeto. A Vercel indicou CNAME `githubbokshelf` para `2bebc356914c41bf.vercel-dns-017.com`. Como o domínio já estava vinculado a outra conta, o proprietário autorizou o TXT de comprovação específico deste subdomínio na Locaweb. O painel passou a exibir Valid Configuration e o novo endereço respondeu HTTPS 200 com validação normal de certificado.

A inclusão neste projeto ficou restrita ao subdomínio solicitado. Não foram mudados os nameservers nem contratado outro domínio. Os registros e a preservação da zona estão em [Locaweb](../locaweb/README.md).
