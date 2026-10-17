// Verificação negativa de baixo volume: duas requisições, sem credencial administrativa.
import fs from 'node:fs';
import assert from 'node:assert/strict';
if (!process.argv.includes('--live')) throw new Error('Use --live para confirmar duas verificações no backend configurado.');
// Usa apenas a chave já pública no aplicativo publicado. Não lê .env nem sessão.
const app = 'https://githubbokshelf.hubdetrabalho.com.br/';
const page = await fetch(app, {signal:AbortSignal.timeout(10000)});
assert.equal(page.status, 200);
const assetName = (await page.text()).match(/src="\.\/assets\/(index-[A-Za-z0-9_-]+\.js)"/)?.[1];
assert.ok(assetName, 'Módulo principal não encontrado');
const asset = await fetch(`${app}assets/${assetName}`, {signal:AbortSignal.timeout(10000)});
assert.equal(asset.status, 200);
const keys = [...new Set((await asset.text()).match(/sb_publishable_[A-Za-z0-9_-]{20,}/g) ?? [])];
assert.equal(keys.length, 1, 'Exige uma única chave publicável na distribuição');
const key = keys[0];
const base = 'https://dxnfhzgxdkhdggqoogft.supabase.co';
const results = [];
for (const [route, method, body] of [
  ['/rest/v1/user_shelves?select=revision&limit=1', 'GET', undefined],
  ['/rest/v1/rpc/save_my_shelf', 'POST', JSON.stringify({p_entries:{},p_expected_revision:0})],
]) {
  const response = await fetch(base+route, {method, headers:{apikey:key,'Content-Type':'application/json'}, body, signal:AbortSignal.timeout(10000)});
  assert.ok([401,403].includes(response.status), `Acesso anônimo inesperado: HTTP ${response.status}`);
  results.push({operation:method==='GET'?'anonymous-read':'anonymous-rpc-write',status:response.status,denied:true});
  await response.body?.cancel();
}
fs.mkdirSync(new URL('../../artifacts/security/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('../../artifacts/security/anonymous-access.json',import.meta.url), JSON.stringify({at:new Date().toISOString(),results},null,2)+'\n');
console.log(JSON.stringify(results));
