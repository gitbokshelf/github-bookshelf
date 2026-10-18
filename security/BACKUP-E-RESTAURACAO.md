# Backup e restauração

Responsável: Thiago Ebias. Procedimento operacional do Bookshelf e referência para outros projetos. Revisão de 18/10/2026. [Operação](OPERACAO.md) e [backend](../backend/supabase/CONFIGURACAO.md).

## Estado comprovado

O ensaio `node backend/supabase/tools/test-database.mjs` aplicou as migrações, executou isolamento e quota, gerou um dump e o restaurou em outro banco descartável. Conferiu dado sintético, RLS e privilégios. Rodou localmente e na CI; removeu cluster e dump ao terminar. Auth foi emulado: isso não prova recuperação de contas reais.

Não há backup de produção gerado nesta entrega. A conexão do banco ainda depende do preenchimento local de SUPABASE_DB_PASSWORD no arquivo privado existente. Também faltam destinatário de criptografia/cofre da chave, destino autorizado de restauração e política de retenção. Nenhuma senha deve ser enviada no chat.

## Escopo do backup real

A documentação recomenda exportações regulares e cópia fora do provedor para o plano Free; backups do banco não incluem os objetos do Storage. Não tratar backup gerenciado pago como contratado neste projeto. [Supabase Backups](https://supabase.com/docs/guides/platform/backups).

Inventariar antes da execução: dados das estantes, schemas public e bookshelf_private, funções, grants, RLS, usuários/identidades Auth, migrações e configuração dos serviços. SMTP, CAPTCHA, URLs permitidas, secrets, arquivos de Storage e código publicado exigem recuperação própria. Registrar somente referências privadas aos segredos.

O procedimento oficial diferencia roles, esquema e dados, com tratamento de componentes gerenciados. Usá-lo após conferir versões e o destino Supabase; o bootstrap mínimo dos testes não deve ser usado para restaurar produção. [Backup/restore pela CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore).

## Execução e conferência

1. Registrar origem, destino separado, autorização, versão do servidor/cliente e tamanho estimado. Preservar produção durante o ensaio.
2. Validar conexão TLS e acesso somente de leitura para a exportação. Limitar espera por conexão/locks e observar impacto.
3. Cifrar a saída antes de persistir. Guardar a chave de recuperação em cofre do proprietário, separado do arquivo cifrado; Git e OneDrive não substituem esse cofre. Um candidato é [age](https://github.com/FiloSottile/age), ainda não configurado nesta entrega.
4. Registrar horário, versão, checksum do arquivo cifrado e resultado da exportação, sem dados de usuários. Verificar outra cópia e possibilidade de recuperar a chave.
5. Restaurar somente no destino separado conferido. Impedir envio de e-mails e integrações reais durante o ensaio.
6. Comparar contagens e integridade, revisar funções/RLS/grants e testar acesso entre identidades sintéticas. O proprietário valida login sem compartilhar senha. Conferir também quota e compatibilidade do frontend.
7. Medir perda possível de dados desde o último backup válido e tempo real de recuperação. Só então definir RPO/RTO comprovados e frequência de ensaios.

## Evidência de conclusão

Exigir arquivo cifrado recuperável, restauração isolada concluída, controles e acesso testados, retenção definida e responsável registrado. Exportar JSON de uma estante ou executar pg_dump sem testar recuperação não atende esse critério. Uma restauração sobre produção exige plano específico de indisponibilidade e perda de dados, fora deste ensaio.
