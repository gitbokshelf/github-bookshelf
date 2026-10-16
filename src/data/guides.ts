export const guideList = [
  {
    id: "github",
    title: "O GitHub sem o labirinto",
    sub: "Um roteiro para escolher o que vale seu tempo.",
    icon: "compass",
    time: "4 min",
    steps: [
      [
        "Comece pelo problema",
        "Escreva em uma frase o que você quer resolver. Um projeto popular só é útil se servir ao seu objetivo.",
      ],
      [
        "Leia o README",
        "Procure uma demonstração, os requisitos, a instalação e as limitações. Estrelas indicam interesse, não qualidade garantida.",
      ],
      [
        "Confira a saúde do projeto",
        "Observe releases, atividade recente, issues e se o repositório foi arquivado. Uma biblioteca estável pode precisar de poucas mudanças.",
      ],
      [
        "Entenda licença e custo",
        "Confira o arquivo de licença. Código disponível não significa uso irrestrito. Serviços, modelos e versões comerciais podem ter condições próprias.",
      ],
      [
        "Experimente em pequena escala",
        "Teste com arquivos e dados de exemplo. Guarde na sua estante, anote o resultado e decida se o projeto entra no seu fluxo.",
      ],
    ],
    sources: [
      ["Documentação do GitHub", "https://docs.github.com/pt/repositories"],
      ["Licenças open source", "https://choosealicense.com/"],
    ],
  },
  {
    id: "structure",
    title: "Uma casa para cada projeto",
    sub: "Pastas claras, decisões registradas, menos retrabalho.",
    icon: "folder",
    time: "5 min",
    steps: [
      [
        "Uma pasta raiz, uma responsabilidade",
        "Mantenha README, configuração do projeto e código versionado juntos. Separe documentação, código e arquivos públicos conforme a stack.",
      ],
      [
        "Organize pelo que existe",
        "Em um frontend React, components guarda peças reutilizáveis; pages, telas; hooks, comportamento; data, conteúdo; services, integrações; assets, recursos importados. Crie pastas quando elas tiverem uma função real.",
      ],
      [
        "Documente as decisões",
        "Explique no README como iniciar, como gerar a versão final e onde os dados são mantidos. Registre pendências e o próximo passo confirmado.",
      ],
      [
        "Separe segredos e saídas geradas",
        "Configure .gitignore. Use variáveis de ambiente para credenciais; mantenha dependências, builds e dados privados fora do versionamento.",
      ],
      [
        "Prefira padrões pequenos",
        "Adote nomes consistentes e responsabilidades fáceis de explicar. Use uma referência como Bulletproof React para comparar escolhas, adaptando ao tamanho do projeto.",
      ],
    ],
    sources: [
      ["Bulletproof React", "https://github.com/alan2207/bulletproof-react"],
      [
        "Convenções de pastas",
        "https://github.com/kriasoft/Folder-Structure-Conventions",
      ],
    ],
  },
  {
    id: "skills",
    title: "Skills com propósito",
    sub: "Transforme uma tarefa repetida em uma habilidade clara.",
    icon: "sparkles",
    time: "5 min",
    steps: [
      [
        "Escolha uma tarefa delimitada",
        "Defina o resultado esperado, as entradas e os limites. Uma habilidade para revisar um README tem um escopo mais claro que uma habilidade para fazer tudo.",
      ],
      [
        "Explique quando usar",
        "Escreva uma descrição que permita identificar a tarefa e quando a habilidade não se aplica. Siga a estrutura e os metadados exigidos pelo agente escolhido.",
      ],
      [
        "Escreva instruções que possam ser seguidas",
        "Organize o procedimento, os critérios de conclusão e como lidar com falhas. Consulte o skill-creator oficial para o formato e os recursos de apoio.",
      ],
      [
        "Mantenha o material enxuto",
        "Separe instruções centrais, referências, exemplos e scripts quando necessário. Nunca inclua credenciais ou informações pessoais.",
      ],
      [
        "Teste e revise",
        "Use casos reais, um caso fora do escopo e entradas incompletas. Confira o resultado e os efeitos dos comandos antes de confiar a habilidade ao seu fluxo.",
      ],
    ],
    sources: [
      [
        "Criar plugins e skills no Codex",
        "https://developers.openai.com/plugins/build/skills",
      ],
      ["Exemplos da Anthropic", "https://github.com/anthropics/skills"],
    ],
  },
  {
    id: "mac",
    title: "Seu Mac, com menos atrito",
    sub: "Um pequeno conjunto de melhorias que você pode avaliar.",
    icon: "monitor",
    time: "3 min",
    steps: [
      [
        "Descubra o que incomoda",
        "Janelas, calendário, arquivos ou desempenho? Escolha uma melhoria por vez para entender se faz diferença.",
      ],
      [
        "Conheça as ferramentas",
        "Rectangle organiza janelas; Itsycal traz calendário à barra de menus; Stats mostra informações do sistema. Cada projeto tem requisitos próprios.",
      ],
      [
        "Confira a compatibilidade",
        "Antes de baixar, leia a versão mínima de macOS e o suporte ao seu processador na documentação oficial.",
      ],
      [
        "Use a distribuição oficial",
        "Prefira o site e as releases vinculados pelo próprio projeto. Entenda as permissões pedidas e evite instalar vários utilitários ao mesmo tempo.",
      ],
    ],
    sources: [
      ["Rectangle", "https://github.com/rxhanson/Rectangle"],
      ["Stats", "https://github.com/exelban/stats"],
      ["Itsycal", "https://github.com/sfsam/Itsycal"],
    ],
  },
];
export type Guide = (typeof guideList)[number];
