# Operação e resposta a incidentes

Responsável pelo produto: Thiago Ebias. Estas rotinas precisam de execução e registro; o documento não constitui serviço de monitoramento ativo.

## A cada mudança

Revisar superfícies alteradas e permissões; testes negativos, build e inspeção da distribuição; audit de dependências, Gitleaks e CodeQL; conferir publicação HTTP e fluxos afetados. Mudança de banco exige nova migração e teste isolado. Relatórios de ferramentas não substituem revisão de autorização.

## Rotina semanal

- Triar Security/Code scanning, Dependabot, secret scanning e falhas dos workflows no GitHub.
- Conferir erros HTTP, uso/custos, tráfego anômalo e eventos de segurança na Vercel; erros Auth/API, conexões e consumo no Supabase.
- Revisar advisories dos fornecedores e dependências usadas. Confirmar versão afetada e exposição antes de agir.
- Revisar acessos administrativos e integrações após entrada/saída de colaborador; conferir MFA e recuperação com o proprietário, sem registrar códigos.
- Registrar risco, responsável, prazo e reteste. Automatizar alerta para um canal escolhido pelo responsável numa próxima etapa; nenhum alerta externo foi contratado nesta revisão.

## Incidente

1. Classificar impacto e recurso afetado. Registrar horário/ambiente/evidência mínima, sem segredos ou notas privadas no repositório.
2. Conter proporcionalmente: bloquear rota/tráfego abusivo no provedor, suspender uma integração comprometida ou reverter publicação. Uma falha na API do Supabase requer contenção no backend; bloquear só a Vercel não basta.
3. Se houver credencial exposta, revogar/rotacionar no serviço de origem, invalidar sessões afetadas conforme o caso e revisar logs. Remover do commit não invalida a credencial. O proprietário executa a entrada de novas credenciais na UI.
4. Preservar evidências em armazenamento privado com acesso restrito e retenção definida. Não copiar dump de produção para Git, issue pública ou contexto de IA.
5. Corrigir causa, adicionar regressão e testar em ambiente isolado. Restaurar acesso gradualmente e verificar isolamento, latência e erros.
6. Registrar impacto confirmado, dados eventualmente afetados, decisões, responsável e prevenção. Avaliar obrigações de comunicação com orientação jurídica quando aplicável, sem inventar diagnóstico de vazamento.

## Backup, restauração e continuidade

Hoje há exportação individual de estante. Isso não substitui backup do backend nem recuperação de contas. Não foi comprovado restore de produção nesta revisão.

Próxima implantação operacional: definir RPO/RTO e retenção; verificar recursos disponíveis no plano Supabase; gerar backup criptografado com acesso restrito fora do repositório/OneDrive compartilhado; restaurar em projeto separado; testar autenticação, RLS, funções e consistência sem disparar e-mails reais. Registrar duração, contagens sanitizadas e responsável. Só então afirmar capacidade de recuperação.

Rollback do frontend: selecionar uma implantação anterior comprovada na Vercel e conferir suas rotas/API. Migrações não são revertidas pela Vercel. Para banco, preferir correção progressiva; restauração exige plano e avaliação de perda de dados.

## Arquivos e contas

Credenciais administrativas não devem ser arquivadas em Markdown. Os arquivos reais ignorados das integrações não foram movidos nesta tarefa. Estar ignorado pelo Git não protege contra malware, usuário local ou sincronização OneDrive. Preferir cofre de senhas e armazenamento secreto do provedor. Auditar compartilhamento e permissões locais com o proprietário, sem imprimir conteúdo.
