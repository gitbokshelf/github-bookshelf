import fs from 'node:fs';
import { parse } from '../../frontend/node_modules/parse5/dist/index.js';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { hostedScripts, externalScriptSources } from './inspect-html.mjs';
const dist = fileURLToPath(new URL('../../frontend/dist/', import.meta.url));
const walk = (dir) => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const files = walk(dist);
const html = fs.readFileSync(path.join(dist,'index.html'),'utf8');
for (const source of hostedScripts(html)) {
  assert.ok(fs.existsSync(path.resolve(dist, source)), 'Script ausente');
}
for (const file of files) {
  assert.ok(!/\.map$|(?:^|\/)\.env|\.local\./.test(file), 'Arquivo privado ou sourcemap na distribuição');
  if (!/\.(?:js|html|css|json)$/.test(file)) continue;
  const text = fs.readFileSync(file,'utf8');
  assert.ok(!/sb_secret_[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text), 'Possível segredo administrativo na distribuição');
  for (const token of text.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g) ?? []) {
    try { assert.notEqual(JSON.parse(Buffer.from(token.split('.')[1], 'base64url')).role, 'service_role', 'JWT administrativo na distribuição'); }
    catch (error) { if (error.code === 'ERR_ASSERTION') throw error; }
  }
}
const standalone = fs.readFileSync(new URL('../../artifacts/GitHub Bookshelf.html',import.meta.url),'utf8');
assert.equal(externalScriptSources(standalone).length, 0, 'HTML independente ainda depende de script externo');
console.log(`Distribuição conferida: ${files.length} arquivos, scripts próprios e sem os padrões administrativos examinados.`);

const jsonBlocks=[];
function inspectEmbedded(node) {
  if (node.nodeName === 'script' && node.attrs?.some(attr=>attr.name==='id' && attr.value==='bookshelf-locales')) jsonBlocks.push(node);
  for (const child of node.childNodes ?? []) inspectEmbedded(child);
}
inspectEmbedded(parse(standalone));
assert.equal(jsonBlocks.length,1,'HTML independente exige um bloco de traduções');
assert.ok(jsonBlocks[0].attrs.some(attr=>attr.name==='type'&&attr.value==='application/json'));
const embedded=JSON.parse(jsonBlocks[0].childNodes.map(node=>node.value??'').join(''));
for (const language of ['en','es']) assert.deepEqual(embedded[language],JSON.parse(fs.readFileSync(path.join(dist,'locales',`${language}.json`),'utf8')),'Tradução mudou ao embutir no HTML');
console.log('Traduções do HTML independente conferidas por round-trip JSON, incluindo textos com caracteres HTML.');
