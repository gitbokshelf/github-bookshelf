# Locaweb: DNS do subdomínio

Domínio do proprietário: `hubdetrabalho.com.br`. A zona permanece na Locaweb, com servidores autoritativos `ns1.locaweb.com.br`, `ns2.locaweb.com.br` e `ns3.locaweb.com.br`.

Subdomínio solicitado: `githubbokshelf.hubdetrabalho.com.br`. A grafia segue o pedido do proprietário.

## Configuração aplicada, 17/10/2026

| Tipo | Nome na zona | Destino | TTL |
| --- | --- | --- | --- |
| CNAME | `githubbokshelf` | `2bebc356914c41bf.vercel-dns-017.com` | 3600 |

O destino foi obtido no painel do projeto Vercel `githubbokshelf/github-bookshelf`, sem reutilizar o endereço de outros projetos. O CNAME foi salvo na Locaweb. O DNS autoritativo e o resolvedor público 1.1.1.1 retornaram o destino esperado; a Vercel exibiu Valid Configuration e HTTPS respondeu 200 com certificado validado.

A Vercel solicitou também um TXT em `_vercel.hubdetrabalho.com.br` para comprovar a posse do subdomínio, pois o domínio já está vinculado a outra conta Vercel. O proprietário confirmou a publicação do TXT; ele foi salvo e conferido no DNS autoritativo e público. Não substituir eventuais outros valores TXT nesse nome. O desafio não é uma senha do usuário; seu valor deve vir do painel vigente da Vercel, sem reaproveitar desafios antigos.

Não mudar nameservers, registros do domínio raiz, MX, SPF, DKIM, DMARC ou subdomínios dos demais produtos nesta tarefa.

## Manutenção

Para trocar a hospedagem, atualizar primeiro o vínculo e o destino indicado pelo provedor. Para adotar outro endereço principal, conferir HTTPS, canonical/OG, links do repositório e retornos exatos no Supabase. O DNS do site não configura o envio transacional de e-mails do portal.

Não foram coletadas credenciais da Locaweb. Arquivos locais futuros devem usar `*.local.*` ou `private/`, ignorados pelo Git.

[Hospedagem Vercel](../vercel/README.md) · [Mapa das integrações](../README.md) · [Registro da execução](../../docs/REGISTRO-DE-EXECUCAO.md)

## Preservação da zona

A zona tinha 18 registros. Após adicionar CNAME e TXT, passou a 20. Os 17 registros anteriores de serviços permaneceram iguais. O único registro existente com diferença foi o SOA, cujo serial passou de `2026073001` para `2026101702`, atualização automática esperada ao salvar a zona. Os demais campos do SOA permaneceram iguais. Não foram alterados manualmente registros do domínio raiz ou dos outros produtos.
