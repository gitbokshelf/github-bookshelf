# Curadoria e rastreabilidade

O objetivo é facilitar a descoberta e o primeiro contato com projetos do GitHub. A seleção inicial tem 30 projetos em 8 categorias e foi revisada em 16/10/2026.

## Fontes

Cada registro contém a URL do repositório, README, data da consulta, estrelas, forks, linguagem principal, licença identificada, data de criação, último push e release quando disponível. Os dados foram coletados pela API oficial do GitHub, com GitHub CLI.

O script consulta as cinco releases mais recentes e seleciona a primeira que não seja draft ou prerelease. Se não encontrar uma, consulta `/releases/latest`. Em monorepos, a release pode corresponder a um pacote específico; a tag é preservada. Ausência de release não significa ausência de manutenção. Último push é atividade do repositório, não lançamento.

O README foi lido para contextualizar cada ferramenta. O cache de leitura não faz parte do repositório ou do portal publicado. Cada projeto mantém seus direitos, licença e regras de distribuição.

## Avaliação editorial

A nota é a média simples de três critérios, cada um entre 1 e 5:

- Utilidade para o objetivo descrito.
- Clareza das orientações públicas.
- Facilidade para começar, considerando o público proposto.

Esses critérios são subjetivos. As notas não são votos de usuários, auditorias ou resultados de instalação. Estrelas ficam separadas porque popularidade não demonstra adequação nem qualidade.

## Plataformas e níveis

Web indica acesso pelo navegador. macOS, Windows e Linux indicam uso ou execução nesses ambientes, incluindo dependências e contêineres quando aplicável. Não representam certificação de todas as versões do sistema ou de todos os processadores. O README oficial é a fonte para os requisitos exatos.

Os níveis descrevem a dificuldade editorial do primeiro uso: Iniciante, Intermediário ou Avançado. Podem mudar conforme a opção de instalação.

## Referências atualizadas nesta entrega

O README de `openai/skills` informa depreciação e aponta para `openai/plugins`. A coleção usa a referência atual e o [guia oficial de skills](https://developers.openai.com/plugins/build/skills).

O README de Magic MCP informa a migração para 21st MCP. O cartão usa o nome atual e aponta para o setup oficial.

O n8n usa fair-code, com condições próprias. A descrição preserva essa distinção. A licença identificada pela API pode exigir consulta direta ao arquivo original, especialmente em repositórios com múltiplas licenças.

## Atualização e privacidade

A atualização é manual por `npm run refresh`. Os tokens permanecem sob gestão do GitHub CLI. O bundle não contém autenticação, acesso a repositórios privados ou dados pessoais. A estante usa armazenamento local e oferece backup explícito.

Relacionado: [[github-bookshelf/README|Guia do projeto]] e [[github-bookshelf/docs/VALIDACAO|Validação]].

[Voltar ao README](../README.md)
