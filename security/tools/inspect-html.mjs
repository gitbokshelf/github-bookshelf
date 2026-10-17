import assert from 'node:assert/strict';
// Validador conservador da saída gerada por Vite; não sanitiza HTML arbitrário.
export function hostedScripts(html) {
  const opening = [...html.matchAll(/<script\b/gi)];
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  assert.equal(scripts.length, opening.length, 'Tag de script fora do formato esperado no build');
  assert.ok(scripts.length >= 2, 'Inicialização e aplicação devem ter scripts próprios');
  return scripts.map(([,attrs,body]) => {
    const sources = [...attrs.matchAll(/(?:^|\s)src\s*=\s*(["'])([^"']+)\1/gi)];
    assert.ok(sources.length === 1 && !body.trim(), 'Script inline ou atributo duplicado não é permitido na versão hospedada');
    const source = sources[0];
    assert.ok(/^\.\/[A-Za-z0-9_./-]+\.js$/i.test(source[2]) && !source[2].includes('..'), 'Script fora da distribuição própria');
    return source[2];
  });
}
