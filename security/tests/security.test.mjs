import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseLibraryBackup, validLibrary, MAX_BACKUP_BYTES } from '../../frontend/src/utils/library-validation.ts';
const entry = { status: 'saved', note: 'Minha nota', savedAt: '2026-10-17T12:00:00Z' };
const known = new Set(['owner/repo', 'owner/other']);
const backup = (library) => JSON.stringify({ version: 1, library });

test('Importação mescla sem mutar a estante e copia apenas os campos aceitos', () => {
  const existing = { 'owner/other': { ...entry, note: 'Preservar' } };
  const result = parseLibraryBackup(backup({ 'owner/repo': { ...entry, admin: true } }), existing, known);
  assert.deepEqual(result, { ...existing, 'owner/repo': entry });
  assert.equal(Object.keys(existing).length, 1);
  assert.ok(!('admin' in result['owner/repo']));
});
test('Importação rejeita integralmente JSON, formato, identidade e registros inválidos', () => {
  const existing = { 'owner/other': { ...entry } };
  const original = structuredClone(existing);
  const bad = [null, [], {version: 2, library: {}}, {version: 1, library: []},
    {version: 1, library: {'unknown/repo': entry}},
    ...[null, [], {...entry, status: 'admin'}, {...entry, savedAt: 'invalid'},
      {...entry, note: 'a'.repeat(10001)}, {...entry, note: {}},
      {...entry, savedAt: 'a'.repeat(65)}].map(value => ({version: 1, library: {'owner/repo': value}}))];
  for (const input of bad) assert.throws(() => parseLibraryBackup(JSON.stringify(input), existing, known));
  assert.throws(() => parseLibraryBackup('{', existing, known));
  assert.deepEqual(existing, original);
});
test('Limite de importação considera bytes UTF-8 e tamanho depois da mescla', () => {
  const text = backup({'owner/repo': {...entry, note: 'é'.repeat(MAX_BACKUP_BYTES/2)}});
  assert.ok(text.length < MAX_BACKUP_BYTES);
  assert.throws(() => parseLibraryBackup(text, {}, known));
  const large = Object.fromEntries(Array.from({length: 209}, (_, i) => [`old/${i}`, {...entry, note: 'a'.repeat(10000)}]));
  assert.throws(() => parseLibraryBackup(backup({'owner/repo': {...entry, note:'a'.repeat(10000)}}), large, known));
});
test('Chaves de protótipo são rejeitadas e cache não promove campos arbitrários', () => {
  const text = '{"version":1,"library":{"__proto__":{"polluted":true}}}';
  assert.throws(() => parseLibraryBackup(text, {}, known));
  assert.deepEqual(validLibrary(JSON.parse('{"__proto__":{"polluted":true}}')), {});
  assert.equal({}.polluted, undefined);
  assert.deepEqual(validLibrary({'owner/repo': {...entry, role: 'admin'}, 'bad': entry}), {'owner/repo': entry});
});
test('Texto com aparência de HTML permanece texto no contrato de dados', () => {
  const hostile = '<img src=x onerror=alert(1)><script>alert(2)</script>';
  const result = parseLibraryBackup(backup({'owner/repo': {...entry, note: hostile}}), {}, known);
  assert.equal(result['owner/repo'].note, hostile);
  // A renderização deve continuar escapada pelo React, sem interpretar notas como HTML.
  const panel = fs.readFileSync(new URL('../../frontend/src/components/project-details.tsx', import.meta.url), 'utf8');
  assert.ok(!panel.includes('dangerouslySetInnerHTML'));
});
test('Política HTTP restringe scripts, conexões, frames e recursos de alto risco', () => {
  const config = JSON.parse(fs.readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
  const headers = Object.fromEntries(config.headers.find(h => h.source === '/(.*)').headers.map(h => [h.key.toLowerCase(), h.value]));
  const directives = Object.fromEntries(headers['content-security-policy'].split(';').map(v => {const [k,...values] = v.trim().split(/\s+/);return [k, values]}));
  assert.deepEqual(directives['script-src'], ["'self'"]);
  for (const key of ['script-src-attr', 'object-src', 'base-uri', 'frame-ancestors']) assert.deepEqual(directives[key], ["'none'"]);
  assert.deepEqual(directives['connect-src'], ["'self'", 'https://dxnfhzgxdkhdggqoogft.supabase.co']);
  assert.equal(headers['x-content-type-options'], 'nosniff');
  assert.equal(headers['x-frame-options'], 'DENY');
  assert.equal(headers['referrer-policy'], 'no-referrer');
  assert.ok(headers['strict-transport-security'].includes('max-age=63072000'));
});

import { publicUrl, repoSlug } from '../../tools/catalog/untrusted-metadata.mjs';
test('Metadados externos não podem trocar protocolo ou origem dos links oficiais', () => {
  const fallback = 'https://github.com/owner/repo';
  for (const value of ['javascript:alert(1)', 'data:text/html,hi', 'https://user:pass@evil.example/', 'https://github.com.evil.example/', 'http://github.com/owner/repo'])
    assert.equal(publicUrl(value, fallback, true), fallback);
  assert.equal(publicUrl('https://github.com/owner/repo/releases', fallback, true), `${fallback}/releases`);
  assert.throws(() => repoSlug('../../.env'));
  assert.throws(() => repoSlug('owner/repo; curl attacker'));
  assert.equal(repoSlug('owner/repo'), 'owner/repo');
});
test('Componente 21st.dev usa CSS próprio compatível com a CSP', () => {
  const component = fs.readFileSync(new URL('../../frontend/src/components/ui/glass-folder-cards.tsx', import.meta.url), 'utf8');
  assert.ok(!/<style\b/.test(component));
  assert.ok(component.includes('import "./glass-folder-cards.css"'));
  assert.ok(fs.readFileSync(new URL('../../frontend/src/components/ui/glass-folder-cards.css',import.meta.url),'utf8').includes('.gf-root'));
});

import { hostedScripts, externalScriptSources } from '../tools/inspect-html.mjs';
test('Inspeção de scripts rejeita inline, origem externa e variações de caixa', () => {
  const own = '<script src="./theme-init.js"></script><script type="module" src="./assets/index-app.js"></script>';
  assert.deepEqual(hostedScripts(own), ['./theme-init.js', './assets/index-app.js']);
  assert.deepEqual(hostedScripts(own.toUpperCase()), ['./THEME-INIT.JS', './ASSETS/INDEX-APP.JS']);
  for (const injection of ['<SCRIPT>alert(1)</SCRIPT>', '<script src="https://evil.example/code.js"></script>', '<ScRiPt src="./ok.js">alert(1)</sCrIpT>', '<script src="./ok.js"/>', '<script src="./ok.js"></script\t\n bar>', '<script data-src="./ok.js" src="https://evil.example/code.js"></script>', '<script src="./ok.js" src="./other.js"></script>'])
    assert.throws(() => hostedScripts(own+injection));
});

import { inlineScriptText } from '../../frontend/scripts/html-text.mjs';
test('HTML independente escapa fechamento de script em qualquer caixa e controles', () => {
  const payload = 'const note = "</ScRiPt><script src=\'https://evil.example/code.js\'>"; const separator="\u001f";';
  const safe = inlineScriptText(payload);
  assert.ok(safe.includes('<\\/ScRiPt>'));
  assert.ok(safe.includes('\\u001f'));
  assert.ok(!safe.includes(String.fromCharCode(31)));
  assert.equal(externalScriptSources(`<script>${safe}</script>`).length, 0);
});
