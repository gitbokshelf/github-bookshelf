# Capacidade, abuso e disponibilidade

## Arquitetura

A descoberta usa catálogo estático/CDN, sem uma consulta por card ao GitHub. Autenticação e gravações usam Supabase. Índice por usuário, limite de payload e revisão otimista reduzem custo e preservam dados. Debounce de 500 ms melhora a experiência; ele pode ser contornado e não limita abuso na API.

A Vercel documenta [mitigação de DDoS na plataforma](https://vercel.com/docs/vercel-firewall/ddos-mitigation). Não foi realizado ataque ou certificação do provedor. Proteção do frontend não cobre requisições diretas ao Supabase. Regras personalizadas, capacidade/custos contratados e alertas precisam de configuração própria.

## Ensaio executado em 17/10/2026

Ferramenta k6 2.3.0, Mac local, Vite preview com build de produção e política CSP. Cenário: 10 VUs por 30 segundos, pausa de 1 segundo por iteração; HTML e módulos/CSS referenciados. Sem sessão de conta e sem chamadas de banco. Resultado:

| Métrica | Observado |
| --- | --- |
| Iterações completas | 300 |
| Requisições HTTP | 1.800 |
| Falhas HTTP | 0 |
| Verificações | 2.100, todas aprovadas |
| Latência HTTP p95 | 10,78 ms |
| Transferência recebida | aproximadamente 293 MB, exclusivamente local |

Relatórios ignorados em `artifacts/security/load-local.json` e `load-local.log`. Limiares do cenário: erro <1%, p95 <500 ms e checks >99%. O script rejeitou explicitamente um alvo HTTPS de produção durante `k6 inspect`, antes de executar requisições.

Esse resultado não mede capacidade de usuários reais da Vercel/Supabase. Não mede renderização, cache de navegador, fontes externas, sessão, gravação, locks, mobile ou Web Vitals. O preview local não é o servidor de produção.

## Limites Auth observados no painel

17/10/2026, leitura sem mudanças: cadastro/login 30 requisições por 5 minutos/IP; verificação de token 30 por 5 minutos/IP; refresh 150 por 5 minutos/IP. E-mails: 2/h com SMTP próprio ainda desligado. Encaminhamento de IP via secret key desligado. Conferir a [documentação de rate limits](https://supabase.com/docs/guides/auth/rate-limits) antes de qualquer alteração.

Esses limites são de Auth. A migração 002 agora impõe quota por conta na RPC: rajada de 10 escritas aceitas e reposição de um crédito/2s, sem acesso direto às tabelas. Escritas inválidas/conflitantes não consomem crédito, então não é um limite global de requisições. A proteção de automação no Auth está em implantação com Turnstile. Não aumentar quotas simplesmente para ocultar falhas ou sem avaliar abuso/custos.

## Plano para ensaio de escala

Usar projeto Supabase e implantação Vercel separados, dados sintéticos, limites/custos conhecidos e backup do ambiente. Começar com poucos usuários autenticados e aumentar gradualmente; separar leituras, gravações e login. Observar p95/p99, erros, revisões conflitantes, conexões, CPU/I/O/locks, quotas e custos. Parar diante de saturação, custo excedido, dados cruzados ou falha persistente. Não ensaiar SMTP real em volume.

Definir cenário de pico esperado, duração, número de contas, orçamento e margem antes do teste. Negociar testes maiores com os provedores conforme plano/documentação. Somente o ensaio poderá justificar capacidade ou mudança de plano.

Atualização: SMTP Resend ativo com limite inicial de 30 e-mails/h; o valor 2/h acima registra a conferência histórica anterior. Não elevar sem medir abuso e orçamento. Monitor ativo para disponibilidade/controles públicos, sem medição de carga autenticada.
