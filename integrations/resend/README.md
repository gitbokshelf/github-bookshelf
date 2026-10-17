# Resend

Conta técnica: githubbokshelf@gmail.com. Finalidade: e-mails transacionais do Supabase Auth e alertas operacionais autorizados para o mesmo endereço técnico. Domínio verificado em 17/10/2026 às 11:39, conforme painel. SMTP ativo; teste de entrega e monitoramento em validação.

Domínio exclusivo: `auth.githubbokshelf.hubdetrabalho.com.br`, região São Paulo. Recebimento de e-mails permanece desligado; apenas envio. O domínio raiz e seus serviços de e-mail não devem ser substituídos.

Após autorização expressa do proprietário, foram adicionados na Locaweb um TXT em `resend._domainkey.auth.githubbokshelf` e dois CNAMEs em `rsend.auth.githubbokshelf` e `send.auth.githubbokshelf`, com os destinos apresentados pelo painel do Resend. TTL 3600. A zona passou de 20 para 23 entradas. Os valores anteriores foram preservados; o SOA teve somente avanço automático de serial e a apresentação dos dois TXT da raiz mudou de ordem.

As chaves devem ter somente permissão de envio, limitada a este domínio. Usar chaves distintas para Supabase SMTP e GitHub Actions. Não inserir chaves no frontend, Markdown, Git ou relatórios. Registrar aqui somente o nome e o local de armazenamento seguro quando configuradas.

Remetente configurado: `acesso@auth.githubbokshelf.hubdetrabalho.com.br`, nome GitHub Bookshelf. Remetente de alertas: `alertas@auth.githubbokshelf.hubdetrabalho.com.br`. O destinatário técnico foi confirmado pelo proprietário.

Validação necessária: domínio verificado; SMTP salvo no Supabase; teste controlado de entrega; cadastro/confirmação/recuperação pela interface com o proprietário definindo sua senha; alertas por chave independente. Não declarar concluída apenas pela adição dos registros DNS.

[Mapa de integrações](../README.md) · [Operação](../../security/OPERACAO.md)

## Configuração aplicada

- `bookshelf-auth-smtp`: Sending access somente no domínio de autenticação. Valor transferido diretamente para o campo privado do Supabase, sem arquivo local ou saída de ferramenta. Host `smtp.resend.com`, porta 465, usuário `resend`, remetente/nome acima. SMTP persistiu após recarga do painel. Limite inicial informado pelo Supabase: 30 e-mails/h.
- `bookshelf-alerts`: Sending access somente no mesmo domínio. Valor transferido diretamente para o secret `BOOKSHELF_ALERTS_RESEND_KEY` em gitbokshelf/github-bookshelf. GitHub confirmou Repository secret added. Nenhum valor foi registrado no Markdown/Git.
- A cópia temporária da segunda chave no clipboard foi substituída pelo URL público do painel. Não foi salva no gerenciador de senhas do navegador.

Fonte dos parâmetros: [SMTP oficial do Resend](https://resend.com/changelog/smtp-service). Rotacionar cada chave no provedor e substituir somente seu destino correspondente; não reutilizar entre serviços.
