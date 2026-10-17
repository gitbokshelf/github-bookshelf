# Aplicar em outro projeto

Esta pasta reúne a engenharia, mas os testes do Bookshelf não devem ser copiados e declarados aprovados para outro sistema. A arquitetura e a superfície de ataque mudam por produto.

1. Copiar `templates/` para a área de segurança do novo repositório. Preencher produto, responsável, ambientes, integrações e dados tratados. Não copiar arquivos locais, relatórios ou credenciais do Bookshelf.
2. Construir mapa de ativos/fronteiras e registro de riscos. Identificar se existe API própria, upload, pagamento, LLM, agentes, webhook, execução de código ou dados sensíveis.
3. Adaptar headers e CSP aos destinos exatos do novo produto. Não reutilizar o project ref do Supabase, domínio ou permissões do Bookshelf. Verificar login, estilos, fontes, retornos e scripts no navegador.
4. Adaptar `tools/check-build.mjs` à saída do novo build e aos padrões de segredo pertinentes. O auxiliar `inspect-html.mjs` usa parse5 como dependência de desenvolvimento no frontend; instalar e conferir essa dependência no novo produto. Ele usa caminhos relativos ao Bookshelf e não é um scanner universal.
5. Reutilizar Gitleaks, CodeQL e Dependabot com versões/SHA conferidos, linguagem e diretório corretos, permissões mínimas e sem segredos de produção. Regras específicas da aplicação exigem testes próprios.
6. Adaptar `load/catalog.k6.js` primeiro para um ambiente descartável autorizado. Manter bloqueio de produção, limites de VUs/duração, orçamento de transferência, critérios de parada e limpeza. O ensaio atual só verifica o preview estático.
7. Criar testes negativos de autorização e dados por usuário/tenant, de preferência com banco descartável. Credencial administrativa fica no ambiente de teste, nunca no navegador ou no relatório.
8. Definir responsáveis, triagem semanal, atendimento de incidente, backup/restauração e critérios de publicação. Registrar resultados reais e a revisão.

## Engenharia reutilizável

- [Ficha do produto e superfície de ataque](templates/PRODUTO.md)
- [Registro de riscos](templates/RISCOS.md)
- [Revisão de publicação](templates/REVISAO.md)
- [Plano de ensaio](templates/ENSAIO.md)

Não transferir uma conclusão de segurança entre projetos. Cada adoção exige execução, evidência e riscos próprios. As referências metodológicas OWASP pertencem aos autores e devem continuar vinculadas, sem alegar certificação.
