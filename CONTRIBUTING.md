# Contribuir com a estante

Sugestões de projetos, melhorias de acessibilidade e correções de conteúdo são bem-vindas.

## Sugerir um projeto

Abra uma issue com o link público do repositório, o problema que resolve, o público indicado e a documentação oficial. Informe plataformas, requisitos relevantes e eventuais custos ou restrições conhecidos. Evite incluir dados pessoais ou credenciais.

Antes de iniciar qualquer tarefa, consulte [AGENTS.md](AGENTS.md), [a arquitetura](docs/ARQUITETURA.md) e [o registro obrigatório](docs/REGISTRO-DE-EXECUCAO.md). Registre a execução e a revisão na mesma entrega.

## Alterar código ou conteúdo

1. Faça um fork e crie uma branch para uma mudança delimitada.
2. Mantenha textos em português claro e preserve as atribuições de terceiros.
3. Edite a curadoria em `tools/catalog/curation.mjs`; não invente estrelas, releases ou datas.
4. Entre em `frontend/` e rode `npm test` e `npm run build`.
5. Confira visualmente a tela afetada e descreva o que validou no pull request.

Mudanças de plataforma, hospedagem ou persistência devem explicar como preservam as estantes existentes. Não versione arquivos de ambiente, backups pessoais ou relatórios privados. As integrações ficam em `integrations/` e o backend em `backend/supabase/`; os dados privados de conexão continuam ignorados pelo Git.

Mudanças em segurança devem seguir [security/README.md](security/README.md). Testes ativos fazem parte da entrega. O build também rejeita fontes sem vínculo com a aplicação e declarações locais sem uso.
