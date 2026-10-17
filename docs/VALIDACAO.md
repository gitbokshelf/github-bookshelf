# Validação vigente

Estado de 17/10/2026. Este documento resume o que foi verificado e seus limites. O histórico das etapas está no [registro obrigatório](REGISTRO-DE-EXECUCAO.md); o mapa vigente está na [arquitetura](ARQUITETURA.md).

## Produto e publicação

Portal: [githubbokshelf.hubdetrabalho.com.br](https://githubbokshelf.hubdetrabalho.com.br/). Código: [gitbokshelf/github-bookshelf](https://github.com/gitbokshelf/github-bookshelf). Vercel hospeda o frontend; Supabase fornece autenticação e estantes por conta; Locaweb mantém o DNS. O endereço vercel.app permanece como alias. O repositório pessoal anterior ainda aguarda exclusão futura específica, conforme a integração GitHub.

Catálogo com 150 projetos únicos em oito categorias. Metadados são um retrato datado da API oficial, sem contagens simuladas. Avaliações são editoriais. Os aplicativos catalogados não foram instalados ou certificados por esta curadoria.

## Verificações atuais

- Quinze testes aprovados: catálogo, contratos de backup, tamanho UTF-8, entradas malformadas, chaves hostis, URLs, headers, CSS do componente e inspeção de scripts.
- TypeScript, grafo de 30 fontes, Vite, HTML independente, orçamento e inspeção da distribuição aprovados. Aproximadamente 251,8 KB gzip de JavaScript em quatro módulos. Nenhum import local ausente, fonte sem vínculo ou declaração local sem uso identificada pelo conjunto de verificações.
- Auditoria npm completa: zero vulnerabilidades conhecidas reportadas. Gitleaks verificou histórico e diff preparado sem achados nos padrões examinados. Isso não prova ausência de falhas inéditas ou de todo tipo de segredo.
- Primeira execução CodeQL encontrou três alertas nas ferramentas de verificação. Correções e regressão foram implementadas; o resultado da nova análise e da publicação fica no registro de execução.
- Publicação conferida com HTTP 200, sete headers esperados e sete recursos próprios com HTTP 200. Assets com hash usam cache imutável; script de tema permanece revalidável.
- Safari de produção: sessão e leitura de estante mantidas após implantação da CSP, sem edição de dados da conta.
- Safari local: modo claro preservado após recarregar, busca por Maccy, detalhes, coleções 21st.dev e abertura de pasta. Backup sintético válido importado; nota hostil exibida como texto; backup inválido rejeitado sem apagar a estante. Item e arquivos sintéticos removidos ao terminar.
- Supabase: leitura e RPC anônimos negados por HTTP 401. Os testes transacionais anteriores de isolamento entre duas identidades não foram reaplicados nesta rodada.
- k6 exclusivamente local: 10 VUs por 30s, 1.800 requisições, zero falhas HTTP e p95 10,78 ms. Não mede banco, renderização, tráfego real ou capacidade da Vercel.

A [revisão de segurança](../security/REVISAO.md) registra controles, fontes e riscos. Os resultados mais recentes de CI/CodeQL e publicação devem ser conferidos no registro, sem interpretar conclusão do job como ausência de alertas.

## Evidências anteriores ainda relevantes

Em 16/10 foram conferidos Chrome emulado em 1366×600, 390×844 e 844×390, navegação por teclado, busca, carregamento de todos os cards e leitura do HTML independente. Não substitui aparelhos físicos, e essas dimensões não foram todas repetidas nesta rodada.

Em 17/10 foram conferidos salvar projeto, nota/progresso, recarregar, sincronizar a mesma conta entre Chrome local e Safari de produção e remover o registro temporário. Ainda no mesmo Mac; dois dispositivos físicos e concorrência real permanecem pendentes. Nenhuma senha foi recebida ou preenchida pelo agente.

## Pendências

SMTP e ciclo completo de cadastro/confirmação/recuperação para usuários externos; idiomas e seletor; privacidade/exclusão de conta; testes de troca de identidade/offline/concorrência; CAPTCHA; quota de escrita no backend; alertas operacionais; backup e restauração; revisão administrativa de MFA/escopos; carga autenticada em staging, acessibilidade e aparelhos físicos.

A limpeza removeu rascunhos e cache sem consumidor, fixtures temporárias e snapshots obsoletos. Testes ativos, migração aplicada, credenciais locais e dados de usuários foram preservados. Build e organização não equivalem a certificação de segurança ou desempenho.

[Guia da aplicação](../frontend/README.md) · [Curadoria](CURADORIA.md) · [Engenharia de segurança](../security/README.md)
