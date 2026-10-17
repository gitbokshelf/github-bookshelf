import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const dist = fileURLToPath(new URL('../../frontend/dist/', import.meta.url));
const walk = (dir) => fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const files = walk(dist);
const html = fs.readFileSync(path.join(dist,'index.html'),'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)];
assert.ok(scripts.length >= 2, 'Aplicação e inicialização de tema precisam de scripts externos');
for (const [,attrs,body] of scripts) {
  const source = attrs.match(/\bsrc="([^"]+)"/);
  assert.ok(source && !body.trim(), 'Script inline não é permitido na versão hospedada');
  assert.ok(!/^(?:https?:)?\/\//.test(source[1]), 'Script de terceiro não é permitido');
  assert.ok(fs.existsSync(path.resolve(dist, source[1].replace(/^\//,''))), 'Script ausente');
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
assert.ok(!/<script[^>]*\bsrc=/.test(standalone), 'HTML independente ainda depende de script externo');
console.log(`Distribuição conferida: ${files.length} arquivos, scripts próprios e sem os padrões administrativos examinados.`);
