# E-mails de autenticação

Fontes de confirmação e recuperação usadas pelo Supabase Auth, com assunto em subjects.json. Aplicação pelo painel Auth → Emails, sem chaves administrativas em arquivos públicos. O backend gerenciado não lê estes arquivos automaticamente; mudanças exigem aplicação e conferência no painel.

Idioma: user_metadata.language gravado no cadastro. Valores en/es escolhem inglês/espanhol; ausência, outro idioma ou tipo inesperado retornam português. Recuperação usa a preferência registrada na conta, pois o fluxo anônimo não pode modificar seus metadados. Mudar somente o seletor do navegador não modifica essa preferência do servidor. Nomes de marca e URLs são preservados; não há imagem com texto nem rastreador externo.

Go Templates são usados em assunto e corpo. A URL de ação é fornecida por ConfirmationURL, com escape do motor html/template; nunca concatenar link, sessão, token ou destinatário vindo de conteúdo externo. O teste usa somente dados sintéticos e endereços example.invalid:

```sh
go run backend/supabase/tools/check-email-templates.go
```

O teste renderiza os três idiomas, ausência de metadados, tipos inesperados e texto hostil, verifica assunto/corpo e escape da URL, sem acessar rede ou enviar mensagens. Executado também pela CI em Ubuntu. A entrega e aparência em clientes reais dependem da validação SMTP com o proprietário. O preview do painel apenas mostra HTML e não resolve condicionais Go; não é prova de renderização do servidor.

[Documentação oficial dos modelos Supabase](https://supabase.com/docs/guides/auth/auth-email-templates) · [Configuração local e evidências](../CONFIGURACAO.md)

Estado em 18/10/2026: os dois modelos e assuntos foram salvos com confirmação do painel. A versão local acrescenta uma proteção para Data completamente ausente; essa pequena revisão ainda precisa ser reaplicada quando o Safari voltar a responder. Vinte renderizações locais passaram com Go 1.27.2, instalado pelo Homebrew oficial. Não houve envio de e-mail pelo teste. Entrega SMTP e recuperação continuam pendentes.
