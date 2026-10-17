import fs from 'node:fs';
import {notificationKind, readState, stateAfterNotification} from './monitor-policy.mjs';

const app = 'https://githubbokshelf.hubdetrabalho.com.br/';
const backend = 'https://dxnfhzgxdkhdggqoogft.supabase.co';
const stateFile = new URL('../../artifacts/security/monitor-state.json', import.meta.url);
const results = [];
const check = (name, passed) => results.push({name, passed: Boolean(passed)});
async function response(url, options = {}) {
  return fetch(url, {...options, redirect:'error', signal:AbortSignal.timeout(12000)});
}
async function boundedText(res, limit) {
  let size=0; const chunks=[];
  for await (const chunk of res.body ?? []) {
    size += chunk.byteLength;
    if (size > limit) throw new Error('Response exceeds monitor budget');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}
try {
  const page = await response(app);
  check('portal-http-200', page.status === 200);
  check('hsts', Number((page.headers.get('strict-transport-security') ?? '').match(/max-age=(\d+)/)?.[1] ?? 0) >= 31536000);
  check('nosniff', page.headers.get('x-content-type-options') === 'nosniff');
  const csp = page.headers.get('content-security-policy') ?? '';
  check('csp', csp.includes("object-src 'none'") && csp.includes("frame-ancestors 'none'") && csp.includes(backend) && !/script-src[^;]*(?:unsafe-inline|unsafe-eval|\*)/.test(csp));
  const html = await boundedText(page, 128000);
  const asset = html.match(/src="\.\/assets\/(index-[A-Za-z0-9_-]+\.js)"/)?.[1];
  check('application-module', asset);
  if (asset) {
    const module = await response(`${app}assets/${asset}`);
    check('module-http-200', module.status === 200);
    const source = await boundedText(module, 3000000);
    const keys = [...new Set(source.match(/sb_publishable_[A-Za-z0-9_-]{20,}/g) ?? [])];
    check('public-backend-configuration', keys.length === 1);
    if (keys.length === 1) {
      for (const [name, route, method, body] of [
        ['anonymous-read-denied','/rest/v1/user_shelves?select=revision&limit=1','GET'],
        ['anonymous-write-denied','/rest/v1/rpc/save_my_shelf','POST',JSON.stringify({p_entries:{},p_expected_revision:0})],
      ]) {
        const res = await response(backend + route, {method,headers:{apikey:keys[0],'Content-Type':'application/json'},body});
        check(name, [401,403].includes(res.status));
        await res.body?.cancel();
      }
    }
  }
} catch {
  // Não registrar corpos HTTP, URLs privadas, credenciais ou detalhes de sessão.
  check('request-completed-within-budget', false);
}
const healthy = results.length > 0 && results.every(result => result.passed);
let state = readState(null);
try {state = readState(JSON.parse(fs.readFileSync(stateFile, 'utf8')));} catch {}
const now = Date.now();
const kind = notificationKind(healthy, state, now, process.argv.includes('--test-email'));
const key = process.env.BOOKSHELF_ALERTS_RESEND_KEY;
let notified = false;
let notificationError = false;
if (kind && !process.argv.includes('--dry-run')) {
  if (!key) notificationError = true;
  else {
    const titles = {test:'Teste dos alertas',failure:'Falha detectada',reminder:'Falha ainda presente',recovery:'Serviço recuperado'};
    const text = `GitHub Bookshelf\n${titles[kind]}\nData UTC: ${new Date(now).toISOString()}\nPortal: ${app}\n${results.map(r => `${r.passed ? 'OK' : 'FALHA'}: ${r.name}`).join('\n')}\n\nVerifique o workflow Monitorar produção no GitHub. Este aviso não contém dados de usuários. A execução agendada pode sofrer atraso no GitHub Actions.`;
    try {
      const sent = await response('https://api.resend.com/emails', {method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`bookshelf-${process.env.GITHUB_RUN_ID || now}-${kind}`},body:JSON.stringify({from:'GitHub Bookshelf <alertas@auth.githubbokshelf.hubdetrabalho.com.br>',to:['githubbokshelf@gmail.com'],subject:`[GitHub Bookshelf] ${titles[kind]}`,text})});
      notified = sent.ok;
      notificationError = !sent.ok;
      await sent.body?.cancel();
    } catch {notificationError = true;}
    if (notified) state = stateAfterNotification(state, kind, now);
  }
}
fs.mkdirSync(new URL('../../artifacts/security/',import.meta.url), {recursive:true});
if (!process.argv.includes('--dry-run')) fs.writeFileSync(stateFile, JSON.stringify(state)+'\n');
const report = {at:new Date(now).toISOString(),healthy,results,notification:{kind, sent:notified,failed:notificationError,dryRun:process.argv.includes('--dry-run')}};
fs.writeFileSync(new URL('../../artifacts/security/monitor-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
if (!healthy || notificationError || (!key && !process.argv.includes('--dry-run'))) process.exitCode=1;
