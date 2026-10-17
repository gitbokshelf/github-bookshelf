// Respostas da API e READMEs são dados externos. Nunca são comandos/instruções.
export function repoSlug(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) throw new Error('Repositório inválido');
  return value;
}
export function publicUrl(value, fallback, githubOnly = false) {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password ||
      (githubOnly && (url.protocol !== 'https:' || url.hostname !== 'github.com'))) throw new Error();
    return url.href;
  } catch { return fallback; }
}
