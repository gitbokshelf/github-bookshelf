import catalog from "./catalog.json";
export const projects = catalog.projects;
export type Project = (typeof projects)[number];
export const fetchedAt = catalog.fetchedAt;
export const categories = [
  {
    id: "all",
    label: "Todos os projetos",
    icon: "compass",
    hint: "Um universo de possibilidades",
  },
  {
    id: "mac",
    label: "Mac & produtividade",
    icon: "monitor",
    hint: "Pequenas melhorias, todos os dias",
  },
  {
    id: "ai",
    label: "IA & agentes",
    icon: "sparkles",
    hint: "Novas habilidades para suas ideias",
  },
  {
    id: "web",
    label: "Web & interfaces",
    icon: "code",
    hint: "Da primeira linha ao último pixel",
  },
  {
    id: "files",
    label: "Arquivos & documentos",
    icon: "folder",
    hint: "Tudo encontra seu lugar",
  },
  {
    id: "finance",
    label: "Finanças pessoais",
    icon: "chart",
    hint: "Mais clareza para o seu dinheiro",
  },
  {
    id: "tools",
    label: "Ferramentas dev",
    icon: "terminal",
    hint: "Seu ambiente, do seu jeito",
  },
  {
    id: "study",
    label: "Aprender & evoluir",
    icon: "graduation",
    hint: "Seu próximo capítulo começa aqui",
  },
  {
    id: "structure",
    label: "Organizar projetos",
    icon: "layers",
    hint: "Uma boa base faz diferença",
  },
];
export const score = (p: Project) =>
  p.scores.reduce((a, b) => a + b, 0) / p.scores.length;
export const compact = (n: number) =>
  new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
export const date = (s: string) =>
  new Date(s).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
