import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire(new URL('../../frontend/package.json', import.meta.url));
const { parse } = await import(pathToFileURL(require.resolve('parse5')).href);
// AST HTML5 da saída de build. Não é um sanitizador de conteúdo de usuário.
function scriptsIn(html) {
  const errors = [];
  const document = parse(html, {onParseError: error => errors.push(error.code)});
  assert.ok(errors.every(code => code === 'missing-doctype'), 'HTML de build malformado');
  const scripts = [];
  function visit(node) {
    if (node.tagName === 'script') scripts.push(node);
    for (const child of node.childNodes ?? []) visit(child);
    if (node.content) visit(node.content);
  }
  visit(document);
  return scripts;
}
export function externalScriptSources(html) {
  return scriptsIn(html).flatMap(node => node.attrs.filter(attr=>attr.name==='src').map(attr=>attr.value));
}
export function hostedScripts(html) {
  const scripts = scriptsIn(html);
  assert.ok(scripts.length >= 2, 'Inicialização e aplicação devem ter scripts próprios');
  return scripts.map(node => {
    const source = node.attrs.find(attr=>attr.name==='src')?.value;
    const body = (node.childNodes ?? []).map(child=>child.value ?? '').join('');
    assert.ok(source && !body.trim(), 'Script inline não é permitido na versão hospedada');
    assert.ok(/^\.\/[A-Za-z0-9_./-]+\.js$/i.test(source) && !source.includes('..'), 'Script fora da distribuição própria');
    return source;
  });
}
