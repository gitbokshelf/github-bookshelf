# Registro obrigatório de execução e revisão

Este arquivo acompanha tarefas e sessões de trabalho do GitHub Bookshelf. Não armazena credenciais nem conteúdo privado de usuários. As regras estão em [AGENTS.md](../AGENTS.md) e a estrutura vigente em [ARQUITETURA.md](ARQUITETURA.md).

## Modelo para próximas tarefas

```text
Data:
Pedido:
Responsável:
Estado: em execução | em revisão | concluída | parcial | bloqueada
Escopo e áreas afetadas:
Estado inicial e alterações preexistentes preservadas:
Validação prevista:
Execução e decisões:
Verificações realizadas e resultados:
Revisão: responsável, evidências conferidas e conclusão
Pendências e próximo passo:
Publicação: local | enviada | publicada, com referência se existir
```

## 17/10/2026: organização por responsabilidade de produto

Pedido: corrigir a organização, deixar frontend e backend explícitos, adotar nível de engenharia profissional e tornar obrigatório o registro de execução e revisão.

Responsável: Codex, agente executor desta sessão. Não há revisor humano ou agente independente nesta tarefa.

Estado: concluída para a reorganização e para a regra obrigatória de execução/revisão.

Escopo: estrutura de pastas, paths das ferramentas, build, testes, CI, documentação, integrações e regra de trabalho do projeto. Não inclui contratação de serviços, mudança no schema remoto nem publicação pública.

Estado inicial: havia modificações locais anteriores de temas, tipografia, autenticação, curadoria e traduções parciais. Foram preservadas. A primeira reorganização concentrou conteúdo demais em `frontend/` e foi corrigida nesta tarefa.

Validação prevista: integridade dos arquivos movidos; seis testes existentes; TypeScript/build e HTML independente; links internos; caminhos antigos; exclusão de segredos/saídas do Git; login e estado da estante na interface.

Execução até este registro:

- Backend Supabase movido para `backend/supabase/`, com migrações, teste SQL e configuração local.
- GitHub, Outlook e Vercel agrupados em `integrations/`.
- Documentação de produto movida para `docs/`.
- Curadoria e atualização do catálogo movidas para `tools/catalog/`; testes correspondentes em `tools/tests/`; cache local em `tools/research/`.
- HTML independente movido para `artifacts/`. Build hospedado permanece em `frontend/dist/`.
- O empacotador específico do frontend permanece junto de suas dependências, em `frontend/scripts/`.
- Antes de editar referências, 333 arquivos movidos foram conferidos por SHA-256, sem divergência. A comparação inclui os arquivos locais de conexão, sem imprimir seu conteúdo.
- Paths do Vite, testes, atualização do catálogo e workflow foram ajustados.
- `AGENTS.md` tornou obrigatórias a leitura da arquitetura e a atualização deste registro antes/depois da execução e na revisão.
- Acrescentado orçamento verificável de build: até 500 KB sem compressão por módulo JavaScript e 350 KB gzip para o conjunto gerado. O relatório fica em `artifacts/build-report.json`, ignorado pelo Git.

Verificações realizadas e resultados:

- `npm --prefix frontend test`: seis testes aprovados.
- `npm --prefix frontend run build`: TypeScript, Vite, HTML independente e orçamento aprovados. Quatro módulos JavaScript, total 255,5 KB gzip; maior módulo aproximadamente 359,5 KB sem compressão. Isso não mede latência, carga ou Core Web Vitals.
- Checagem negativa de orçamento: um arquivo temporário acima de 500 KB foi rejeitado. Somente esse arquivo foi removido; o orçamento do build real voltou a passar e o relatório final foi regenerado.
- `npm ci --dry-run --ignore-scripts` em `frontend/`: manifesto e lockfile compatíveis. Não foi uma reinstalação completa nem uma execução do GitHub Actions.
- `node --check tools/catalog/refresh-catalog.mjs`: sintaxe aprovada. A coleta não foi executada, preservando o retrato de metadados.
- Links relativos da documentação conferidos sem destino ausente.
- Caminhos antigos ausentes na árvore ativa, salvo referências históricas identificadas na documentação.
- Arquivos privados e gerados conferidos como ignorados; os seis arquivos de conexão mantêm permissão 600. A verificação dos candidatos ao Git não encontrou padrões de chave administrativa ou chave privada.
- `npm run dev -- --port 5173 --strictPort` em `frontend/`: servidor reiniciado e mantido ativo para o uso local durante a continuidade do projeto.
- Chrome foi reaberto para a conferência. O portal em `127.0.0.1:5173` exibiu 150 projetos e Minha conta. A estante autenticada abriu com a indicação Estante salva na sua conta. Nenhum projeto ou nota foi alterado nesta conferência final.
- `git diff --check`: sem erros de whitespace.

Revisão: realizada pelo próprio Codex executor, com nova conferência da estrutura, dos links, dos caminhos de CI, dos arquivos ignorados, do orçamento e da interface. Não houve revisão independente. A estrutura e o registro obrigatório foram entregues; as pendências abaixo continuam explícitas.

Pendências e próximo passo: traduções completas, SMTP de produção, recuperação de senha, dois dispositivos, concorrência pela interface e publicação em conta exclusiva continuam fora desta reorganização. A migração e o teste SQL foram movidos sem alteração de conteúdo, não reaplicados no banco. A próxima tarefa deve abrir novo registro e seguir a arquitetura vigente.

Publicação: alterações locais. A versão pública anterior permanece ativa.

## 17/10/2026: contas exclusivas GitHub e Vercel

Pedido: configurar pelo Safari a conta GitHub `gitbokshelf` e a Vercel com o e-mail exclusivo informado pelo proprietário.

Responsável: Codex, executor e revisor desta sessão.

Estado: concluída para configuração e publicação na conta exclusiva.

Escopo: repositório público, integração e configuração de hospedagem, links do produto, CI e documentação. Supabase permanece no projeto exclusivo já configurado; a conta Outlook não será substituída pela conta Gmail do GitHub/Vercel.

Estado inicial: repositório local com histórico de `thiagoebias/github-bookshelf`, alterações anteriores de frontend, backend, estrutura e traduções parciais ainda não publicadas. Preservar essas alterações e todos os arquivos locais de conexão. CLI autenticada na conta pessoal; sessão da conta exclusiva informada no Safari.

Validação prevista: identidade e destino reais; exclusão de segredos e arquivos gerados; testes e build; repositório e implantação efetivamente criados; URL publicada e retornos de autenticação quando disponíveis. Registrar impedimentos de acesso sem afirmar publicação antes de confirmar.

Execução, revisão e resultado: documentados abaixo.

Preparação confirmada:

- Repositório público `gitbokshelf/github-bookshelf` criado pelo Safari e conferido pela API como público e vazio antes do envio.
- Autenticação da GitHub CLI concluída com autorização do proprietário; identidade `gitbokshelf` conferida pela API. Nenhum token foi copiado para o projeto.
- `origin` aponta para o novo repositório. O remoto anterior foi preservado como `legacy-personal`; o histórico de commits não foi reescrito.
- Link superior e link de código do portal apontam para o perfil/repositório exclusivos. A atribuição de criação continua em nome de Thiago Ebias.
- Workflow alterado para CI em `ci.yml`, com testes e build, sem exigir Pages no novo repositório.
- `vercel.json` mantém o build na raiz do monorepositório, com comandos direcionados a `frontend` e saída `frontend/dist`. Arquitetura e orientação da integração foram atualizadas.
- A Vercel mostrou a conta GitHub conectada e o repositório disponível para importação. Não houve contratação de plano nem domínio.
- Seis testes passaram, TypeScript/build/HTML independente e orçamento passaram: quatro módulos e 255,5 KB gzip de JavaScript.
- Interface local no Chrome mostrou 150 projetos, sessão preservada, link superior para `github.com/gitbokshelf` e rodapé para o novo repositório. Não foram alterados dados de estante nesta conferência.
- Revisão dos 76 arquivos candidatos ao Git: nenhum arquivo privado de conexão, cache, dependência, build ou padrão de chave administrativa/privada encontrado.

Revisão pré-envio: realizada pelo próprio Codex executor. Foram conferidos os destinos, preservação do histórico, mudanças de CI/build e exclusão de arquivos privados. Publicação e retornos de autenticação continuam em execução e serão registrados após conferência real.

Publicação conferida nesta etapa:

- Código enviado em `9f61adb`, com igualdade entre o HEAD local e main remoto. A CI remota passou na execução 39020086487.
- Vercel criou `github-bookshelf` na equipe `githubbokshelf`; implantação `dpl_FEcyMRNByxeThiqEGzwofFiXeRVj` ficou Ready.
- Endereço estável confirmado no painel e por HTTP sem sessão: https://github-bookshelf.vercel.app/ (200).
- Somente URL e chave publicável do Supabase configuradas em Production e Preview. O tipo da chave foi conferido sem registrar o valor; nenhuma chave administrativa foi usada.
- Supabase Site URL e retorno exato da produção salvos. A interface mostrou seis retornos: produção, portal anterior e quatro origens locais. Nenhum curinga adicionado.
- Portal publicado abriu no Safari com 150 projetos, links da conta exclusiva e formulário de acesso disponível. O tema Claro foi acionado e conferido visualmente no endereço público.
- Canonical, OG e metadados de repositório foram ajustados para a publicação real. Os links históricos permanecem identificados como versão anterior.
- Autoria dos próximos commits locais vinculada ao noreply da conta exclusiva, preservando o nome do criador e todos os commits anteriores.
- Validação de acesso na produção solicitada ao proprietário; pendente neste registro. SMTP público, domínio próprio, recuperação e traduções completas não foram concluídos nesta etapa.

Validação autenticada de produção:

- O proprietário informou que entrou na produção. A sessão foi conferida pela interface do Safari e a estante exibiu sincronização concluída.
- A estante começou vazia. Um Maccy temporário foi salvo com nota de teste e status Em uso. A interface confirmou gravação e a contagem permaneceu após recarregar a produção.
- No Chrome já autenticado na mesma conta, em origem local, uma recarga trouxe do backend o projeto, a nota temporária e o status Em uso. Isso confere dois navegadores e duas origens no mesmo Mac; não equivale a dois dispositivos físicos.
- Foi removido somente o Maccy temporário. A confirmação final da remoção está em revisão.
- Na revisão, o texto de notas ainda dizia que eram salvas neste navegador, inclusive para contas sincronizadas. Foi corrigido para Salvas automaticamente na sua estante, mantendo a indicação de sincronização na página da estante. Os dicionários parciais correspondentes foram ajustados, sem afirmar que o seletor de idiomas está ativo.
- A publicação automática do commit `69187e3` passou na Vercel e a CI passou na execução 39020312215. HTTP 200 nos quatro módulos JavaScript e CSS; canonical/OG de produção presentes; URL e chave publicável do backend presentes no código distribuído, sem padrão de chave administrativa.

Conferência final dos dados: a produção confirmou gravação concluída e contagem zero após remover o teste. Recarregar Safari e Chrome manteve a estante vazia. Nenhuma senha foi preenchida ou recebida pelo agente. Metadados privados das integrações foram atualizados com o repositório e a URL reais; arquivos continuam ignorados e com permissão 600.

Revisão de encerramento, realizada pelo próprio Codex executor:

- Configuração de GitHub e Vercel concluída, código e histórico publicados, ligação automática de main conferida por implantação posterior.
- Commit de código `bb625d4` com CI aprovada na execução 39020509989 e implantação Vercel aprovada. A correção do texto das notas foi conferida no JavaScript público e o endereço continua com HTTP 200.
- Revisados 76 arquivos versionados, 74 links relativos existentes, ausência de caminhos privados proibidos e ausência dos padrões de segredos examinados. Os seis arquivos locais de conexão continuam ignorados e com permissão 600.
- Os testes e o build da última alteração de frontend passaram, com quatro módulos e 255,5 KB gzip no orçamento. Não houve teste de carga ou medição de Core Web Vitals.
- Autenticação de produção, persistência e sincronização entre Safari de produção e Chrome local conferidas. Teste temporário removido; estado inicial e final preservados.
- README, arquitetura, orientações das integrações e configuração do Supabase atualizados. A conta Gmail atende GitHub/Vercel; Supabase e conta de teste do portal permanecem na conta Outlook.

Conclusão desta tarefa: repositório público e publicação Vercel configurados e revisados. O projeto continua na pasta original escolhida pelo proprietário, com responsabilidades e registro obrigatórios.

Pendências do produto, sem declaração de conclusão: SMTP para cadastro público e recuperação por e-mail, domínio próprio, traduções completas com seletor e teste em dois dispositivos físicos. Próxima prioridade de infraestrutura: definir remetente/domínio e provedor transacional antes de divulgar cadastros abertos. A criação de e-mails e contas de hospedagem não fornece essas credenciais automaticamente.

Publicação: https://github-bookshelf.vercel.app/ e https://github.com/gitbokshelf/github-bookshelf. A publicação antiga da conta pessoal foi preservada. Não foram contratados plano pago, domínio nem envio de e-mails.

## 17/10/2026: registrar exclusão futura do repositório pessoal

Pedido: lembrar de excluir posteriormente `thiagoebias/github-bookshelf`, conferindo o acesso à conta pessoal antes da ação.

Responsável: Codex, executor e revisor desta anotação.

Estado inicial: árvore de trabalho limpa; CLI autenticada como `gitbokshelf`. A publicação exclusiva está documentada na tarefa anterior.

Escopo e validação prevista: registrar a pendência na integração GitHub, conferir o destino exato e revisar o diff. Nenhuma exclusão, troca de conta ou alteração de acesso integra esta anotação.

Estado: registro concluído; exclusão futura pendente.

Execução: pendência registrada em `integrations/github/README.md`, com alvo limitado ao repositório antigo, preservação prévia de itens exclusivos, conferência de acesso e revisão das referências após a futura exclusão.

Revisão: realizada pelo próprio Codex. Conferidos o pedido de execução futura, o nome das duas contas, o destino e a ausência de comandos de exclusão. Alteração somente documental; testes de aplicação não são necessários para esta anotação.

Conclusão: registro concluído. A exclusão continua pendente; nenhuma conta foi alternada e nenhum repositório foi excluído.

## 17/10/2026: subdomínio githubbokshelf.hubdetrabalho.com.br

Pedido: criar e configurar o subdomínio do proprietário para o GitHub Bookshelf.

Responsável: Codex, executor e revisor desta sessão.

Estado: configuração do domínio e conferência do login nessa origem concluídas.

Estado inicial: Git limpo; portal ativo na Vercel; DNS autoritativo de hubdetrabalho.com.br na Locaweb. Consulta inicial não retornou registro A ou CNAME para o novo nome. Sessões da Locaweb, Vercel e Supabase disponíveis no Safari. O inventário genérico do OpenClaw não está no caminho indicado pela skill; o contexto foi obtido do README, arquitetura e registros locais deste projeto, sem varrer o disco.

Escopo: adicionar somente o subdomínio solicitado, vinculá-lo ao projeto correto na Vercel, ajustar URL principal e retornos do Supabase, metadados e documentação. Preservar DNS do domínio raiz, demais serviços e repositório pessoal antigo.

Validação prevista: destino DNS indicado pelo painel da Vercel; registro autoritativo e resolução pública; certificado HTTPS válido; HTTP e arquivos do portal; canonical/OG; configuração de autenticação; testes/build quando o frontend for alterado; CI e publicação; revisão final documentada.

Execução e evidências desta etapa:

- Subdomínio adicionado ao ambiente Production do projeto Vercel `githubbokshelf/github-bookshelf`.
- Vercel indicou CNAME para `2bebc356914c41bf.vercel-dns-017.com` e solicitou TXT de posse porque o domínio já estava ligado a outra conta.
- CNAME salvo na Locaweb com host `githubbokshelf` e TTL 3600. O proprietário confirmou a verificação; TXT específico do subdomínio foi salvo em `_vercel`.
- Zona comparada antes e depois: 18 registros iniciais, 20 finais. Os 17 registros de serviços anteriores permaneceram iguais. O SOA teve somente atualização automática de serial, de 2026073001 para 2026101702; seus demais campos permaneceram iguais. Nenhum outro registro foi editado ou excluído.
- Consultas ao DNS autoritativo ns1.locaweb.com.br e ao resolvedor público 1.1.1.1 retornaram CNAME e TXT esperados.
- Vercel passou a exibir Valid Configuration. `curl` com validação normal de certificado retornou HTTPS 200. Nenhuma exceção de certificado foi usada.
- Supabase Site URL alterada para o domínio próprio; retorno exato adicionado. Painel mostrou sete retornos, preservando alias Vercel, Pages anterior e quatro origens locais, sem curingas.
- Portal abriu no Safari pelo domínio próprio, com 150 projetos e formulário de entrada disponível. O login foi solicitado ao proprietário porque a sessão é separada por origem; nenhum acesso a senha pelo agente.
- Criada integração `integrations/locaweb/`, separando orientação pública de metadados locais ignorados. Canonical/OG, links principais e arquitetura foram preparados para o domínio próprio. Credenciais e variáveis do backend não foram alteradas.

Revisão antes do envio, pelo próprio Codex:

- Seis testes aprovados; TypeScript, Vite, HTML independente e orçamento de build aprovados. Quatro módulos JavaScript, 255,5 KB gzip no conjunto; não é teste de carga.
- Conferidos 77 arquivos candidatos e 81 links relativos, sem destino ausente, arquivo privado proibido ou padrão de segredo examinado.
- CNAME conferido nos três nameservers da Locaweb. HTTP redirecionou por 308 para HTTPS no mesmo hostname.
- Verificação TLS independente com SNI e rejeição de certificado inválido aprovada: SAN corresponde exatamente ao subdomínio e cadeia emitida por Let's Encrypt. Evidência técnica sanitizada em `artifacts/validation/custom-domain-tls.json`, ignorada pelo Git.
- Alterações de fonte limitadas a metadados e documentação do domínio. Login autenticado no novo domínio e publicação final continuam em conferência.

Revisão final, pelo próprio Codex executor:

- Commit de configuração `3ca7d5c` enviado à conta exclusiva. CI aprovada na execução 39036667674 e implantação Vercel aprovada.
- Nova consulta à publicação confirmou HTTP 200, canonical/OG corretos e sete recursos com HTTP 200: quatro módulos JavaScript, CSS, favicon e imagem de compartilhamento. O alias Vercel permanece acessível com canonical do domínio próprio.
- Homepage do repositório GitHub atualizada e conferida pela API.
- A zona anterior, a identidade do projeto, a grafia solicitada, os sete retornos do Supabase e a exclusão dos metadados locais do Git foram revisados. A anotação anterior da exclusão futura teve seu estado ajustado para registro concluído, sem executar exclusão.
- Relatórios sanitizados em `artifacts/validation/custom-domain-tls.json` e `custom-domain-http.json`, ignorados pelo Git. Documentação atualizada nas integrações Locaweb/Vercel, frontend, arquitetura e backend.

Conclusão: DNS, verificação de posse autorizada, vínculo de produção, HTTPS, metadados, retorno de autenticação e publicação do domínio próprio concluídos. Nenhum registro anterior de serviço foi alterado.

Limite registrado na primeira conferência: o login no novo domínio ainda aguardava o proprietário. Essa pendência foi resolvida na continuidade documentada abaixo. Não foi validado envio de confirmação/recuperação nem configurado SMTP nesta tarefa. A exclusão do repositório pessoal permanece futura.

Publicação: https://githubbokshelf.hubdetrabalho.com.br/. Continuidade: https://github-bookshelf.vercel.app/ preservado como alias. O portal permanece aberto no Safari para a conferência do proprietário.

Continuidade da validação após o retorno do proprietário, 17/10/2026:

Pedido: conferir o acesso informado pelo proprietário no domínio próprio. Escopo previsto: observar a sessão, abrir a estante e recarregar para conferir sua continuidade; preservar projetos, notas e progresso. Estado inicial do Git limpo.

Execução e revisão pelo próprio Codex: Safari mostrou Minha conta em `https://githubbokshelf.hubdetrabalho.com.br/`. A estante abriu com a indicação Estante salva na sua conta. Após recarregar, Minha conta permaneceu disponível e abrir a estante voltou a mostrar sincronização concluída. Nenhum projeto, nota ou progresso foi alterado nesta conferência; nenhuma senha foi recebida ou preenchida pelo agente.

Conclusão: sessão e leitura da estante autenticada conferidas no domínio próprio, inclusive após recarregar. Atualizada a orientação do Supabase. Alteração somente documental; não há mudança de aplicação que exija repetir testes/build. Conferidos o diff e a ausência de dados privados na anotação. Recuperação por e-mail, SMTP e demais limites anteriores continuam pendentes. Documentação enviada ao repositório exclusivo nesta continuidade.
