// Verificação negativa de baixo volume: duas requisições, sem credencial administrativa.
import fs from 'node:fs';
import assert from 'node:assert/strict';
if (!process.argv.includes('--live')) throw new Error('Use --live para confirmar duas verificações no backend configurado.');
const env = fs.readFileSync(new URL('../../backend/supabase/.env.local',import.meta.url),'utf8');
const value = name => {
  const line = env.split(/\r?\n/).find(line => line.startsWith(`${name}=`));
  return line?.slice(name.length+1).trim().replace(/^(['"])(.*)\1$/, '$2');
};
const base = value('VITE_SUPABASE_URL');
const key = value('VITE_SUPABASE_PUBLISHABLE_KEY');
assert.equal(base, 'https://dxnfhzgxdkhdggqoogft.supabase.co');
assert.ok(key?.startsWith('sb_publishable_'), 'Usar somente chave publicável');
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
