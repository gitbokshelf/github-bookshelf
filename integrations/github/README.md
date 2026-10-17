# GitHub

Repositório público exclusivo: [gitbokshelf/github-bookshelf](https://github.com/gitbokshelf/github-bookshelf).

Criado pelo Safari em 17/10/2026 na conta `gitbokshelf`. O código foi enviado em `9f61adb`, com o histórico anterior e a autoria de Thiago Ebias preservados. A CI remota passou na [execução 39020086487](https://github.com/gitbokshelf/github-bookshelf/actions/runs/39020086487).

O remoto `origin` usa a conta exclusiva. O remoto anterior permanece como `legacy-personal`. Novos commits locais usam o e-mail noreply da conta `gitbokshelf`, mantendo o nome do criador. Isso vincula as próximas publicações à conta dedicada; commits anteriores não foram reescritos.

A CI em `.github/workflows/ci.yml` valida testes, TypeScript e orçamento de build em pushes e pull requests. A hospedagem principal é a Vercel; o novo repositório não depende de GitHub Pages.

Credenciais locais usam `*.local.*` ou `private/`, ignorados pelo Git. A autenticação da CLI é gerenciada pelo próprio `gh`; nenhum token deve ser copiado para esta pasta. O vínculo da conta Gmail informado pelo proprietário permanece no cadastro privado da integração.

[Voltar ao projeto](../../README.md)

## Pendência solicitada: excluir o repositório pessoal

O proprietário solicitou em 17/10/2026 a exclusão posterior de `thiagoebias/github-bookshelf`. Esta é uma etapa futura, ainda não executada. A conta pessoal `thiagoebias` deve permanecer existente; o alvo é somente o repositório antigo.

Antes de executar:

1. Conferir novamente o repositório exclusivo, a publicação Vercel e sua independência do repositório antigo.
2. Inventariar e preservar histórico, tags, releases, anexos e outros itens que ainda existirem somente no repositório antigo.
3. Confirmar acesso administrativo como `thiagoebias` e conferir o destino exato na ferramenta usada. A CLI estava autenticada como `gitbokshelf` ao registrar esta pendência.
4. Cumprir a confirmação exigida pela ferramenta no momento da exclusão, se aplicável.
5. Após excluir, revisar o remoto `legacy-personal`, os links e o retorno antigo do GitHub Pages no Supabase. Registrar o resultado real e a indisponibilidade esperada da publicação antiga.

Nenhuma exclusão foi feita ao registrar este pedido.

## Segurança, revisão de 17/10/2026

API confirmou secret scanning e push protection ativos. Habilitados relatos privados de vulnerabilidade e correções automáticas de segurança do Dependabot. Workflows de detecção de segredos e CodeQL são versionados em `.github/workflows/security.yml`; propostas semanais em `.github/dependabot.yml`. Actions fixadas por SHA e permissão por job. Triar alertas além de conferir o resultado do workflow. Ver [engenharia de segurança](../../security/README.md).
