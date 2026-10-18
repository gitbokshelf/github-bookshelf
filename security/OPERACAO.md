# Operação e resposta a incidentes

Responsável pelo produto: Thiago Ebias. Estas rotinas precisam de execução e registro. Há monitor público agendado no GitHub Actions, descrito abaixo, com limites e sem SLA.

## A cada mudança

Revisar superfícies alteradas e permissões; testes negativos, build e inspeção da distribuição; audit de dependências, Gitleaks e CodeQL; conferir publicação HTTP e fluxos afetados. Mudança de banco exige nova migração e teste isolado. Relatórios de ferramentas não substituem revisão de autorização.

## Rotina semanal

- Triar Security/Code scanning, Dependabot, secret scanning e falhas dos workflows no GitHub.
- Conferir erros HTTP, uso/custos, tráfego anômalo e eventos de segurança na Vercel; erros Auth/API, conexões e consumo no Supabase.
- Revisar advisories dos fornecedores e dependências usadas. Confirmar versão afetada e exposição antes de agir.
- Revisar acessos administrativos e integrações após entrada/saída de colaborador; conferir MFA e recuperação com o proprietário, sem registrar códigos.
- Registrar risco, responsável, prazo e reteste. Conferir o monitor agendado e a entrega ao e-mail técnico autorizado; alertas de consumo e atividade interna ainda precisam de configuração.

## Incidente

1. Classificar impacto e recurso afetado. Registrar horário/ambiente/evidência mínima, sem segredos ou notas privadas no repositório.
2. Conter proporcionalmente: bloquear rota/tráfego abusivo no provedor, suspender uma integração comprometida ou reverter publicação. Uma falha na API do Supabase requer contenção no backend; bloquear só a Vercel não basta.
3. Se houver credencial exposta, revogar/rotacionar no serviço de origem, invalidar sessões afetadas conforme o caso e revisar logs. Remover do commit não invalida a credencial. O proprietário executa a entrada de novas credenciais na UI.
4. Preservar evidências em armazenamento privado com acesso restrito e retenção definida. Não copiar dump de produção para Git, issue pública ou contexto de IA.
5. Corrigir causa, adicionar regressão e testar em ambiente isolado. Restaurar acesso gradualmente e verificar isolamento, latência e erros.
6. Registrar impacto confirmado, dados eventualmente afetados, decisões, responsável e prevenção. Avaliar obrigações de comunicação com orientação jurídica quando aplicável, sem inventar diagnóstico de vazamento.

## Backup, restauração e continuidade

Procedimento e critérios em [BACKUP-E-RESTAURACAO.md](BACKUP-E-RESTAURACAO.md).

Hoje há exportação individual de estante. Isso não substitui backup do backend nem recuperação de contas. Não foi comprovado restore de produção nesta revisão.

Próxima implantação operacional: definir RPO/RTO e retenção; verificar recursos disponíveis no plano Supabase; gerar backup criptografado com acesso restrito fora do repositório/OneDrive compartilhado; restaurar em projeto separado; testar autenticação, RLS, funções e consistência sem disparar e-mails reais. Registrar duração, contagens sanitizadas e responsável. Só então afirmar capacidade de recuperação.

Rollback do frontend: selecionar uma implantação anterior comprovada na Vercel e conferir suas rotas/API. Migrações não são revertidas pela Vercel. Para banco, preferir correção progressiva; restauração exige plano e avaliação de perda de dados.

## Arquivos e contas

Credenciais administrativas não devem ser arquivadas em Markdown. Os arquivos reais ignorados das integrações não foram movidos nesta tarefa. Estar ignorado pelo Git não protege contra malware, usuário local ou sincronização OneDrive. Preferir cofre de senhas e armazenamento secreto do provedor. Auditar compartilhamento e permissões locais com o proprietário, sem imprimir conteúdo.

## Implementação de monitoramento e restore, 17/10/2026

`Monitorar produção` em `.github/workflows/monitor.yml`: cron nominal de 15 minutos e disparo manual. Executa `security/tools/monitor.mjs` somente em main, com timeout e recursos fixos. Confere HTTP, módulo, CSP/HSTS/nosniff e negação de leitura/escrita anônima. Não lê notas, sessões, senhas ou dados de usuários.

Avisos via `BOOKSHELF_ALERTS_RESEND_KEY`, remetente/destinatário fixos conforme [Resend](../integrations/resend/README.md). Falha inicial, lembrete após seis horas e recuperação; teste explícito não altera o estado de incidente. Se o envio falhar, o estado não consome a notificação e o job falha. Cache perdido pode produzir aviso repetido. Actions atrasado, desativado ou indisponível pode impedir o próprio aviso; acompanhar falhas do workflow também. Ainda não cobre métricas/alertas de consumo, exaustão de plano ou atividade interna autenticada.

Teste sem envio: `node security/tools/monitor.mjs --dry-run`. Relatório sanitizado em artifacts/security/monitor-report.json. Envio real somente via workflow com secret, sem gravar chave em arquivo local.

O ensaio de restauração roda na CI em banco descartável: `node backend/supabase/tools/test-database.mjs`. pg_dump/pg_restore preservaram um dado sintético, RLS e privilégios. O contrato Auth é emulado; produção não foi exportada, não há backup criptografado real ainda e não há RPO/RTO comprovado. Para isso faltam conexão de backup autorizada, destino seguro e restauração em projeto separado.
