# Cloudflare Turnstile

Conta técnica: githubbokshelf@gmail.com. Conta Cloudflare criada pelo proprietário. Integração autorizada expressamente para proteção dos formulários de acesso do Bookshelf.

Widget: GitHub Bookshelf Auth. Modo Managed. Hostnames exatos: githubbokshelf.hubdetrabalho.com.br e github-bookshelf.vercel.app. Pre-clearance desligado. O DNS continua na Locaweb; não foi solicitada troca de nameservers.

Sitekey público: `0x4AAAAAAFaOViXpRakWBC6k`. Configuração de build: VITE_TURNSTILE_SITE_KEY na Vercel e no ambiente local ignorado do backend. Secret deve permanecer somente no painel privado do Supabase Auth, nunca nesta pasta, frontend, Git ou relatório.

Estado: widget criado em 18/10/2026. Integração do cliente preparada; sitekey público salvo como Config, escopo Production na Vercel, com confirmação de sucesso. Publicação e ativação do backend em execução. Não declarar proteção ativa até confirmar a exigência de token no Supabase e funcionamento do formulário publicado.

O componente carrega o script oficial somente ao abrir os formulários protegidos, controla expiração/erro/repetição e envia o token ao Supabase. O Supabase valida o token no servidor. Tokens não entram em logs, armazenamento local ou notas. O bloqueio de bots não substitui quotas e monitoramento.

Fontes oficiais: [renderização](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), [CSP](https://developers.cloudflare.com/turnstile/reference/content-security-policy/), [integração Supabase](https://supabase.com/docs/guides/auth/auth-captcha).
