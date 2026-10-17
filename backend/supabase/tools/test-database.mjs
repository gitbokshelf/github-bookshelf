import fs from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
const run = promisify(execFile);
const root = fileURLToPath(new URL('../../../',import.meta.url));
const bin = process.env.BOOKSHELF_PG_BIN || (process.platform==='darwin' ? '/opt/homebrew/opt/postgresql@17/bin' : (await run('pg_config',['--bindir'])).stdout.trim());
const area = path.join(root,'artifacts/security');await fs.mkdir(area,{recursive:true});
const dir = await fs.mkdtemp(path.join(area,'postgres-test-'));
const server = net.createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const port=server.address().port;await new Promise(resolve=>server.close(resolve));
const common=['-h','127.0.0.1','-p',String(port),'-U','bookshelf_test','-d','postgres'];
const sql = file => run(path.join(bin,'psql'),[...common,'-X','-q','-v','ON_ERROR_STOP=1','-f',file],{maxBuffer:1024*1024});
let started=false;
try {
  await run(path.join(bin,'initdb'),['-D',dir,'-U','bookshelf_test','-A','trust','--no-locale','-E','UTF8']);
  await run(path.join(bin,'pg_ctl'),['-D',dir,'-l',path.join(dir,'postgres.log'),'-o',`-h 127.0.0.1 -p ${port} -k '' -c fsync=off -c log_statement=none`,'-w','start']);started=true;
  await sql(path.join(root,'backend/supabase/tests/bootstrap.sql'));
  for(const file of (await fs.readdir(path.join(root,'backend/supabase/migrations'))).filter(f=>f.endsWith('.sql')).sort()) await sql(path.join(root,'backend/supabase/migrations',file));
  const results=[];
  for(const file of ['isolation.sql','write-quota.sql']){
    const {stdout}=await sql(path.join(root,'backend/supabase/tests',file));
    if(!stdout.includes('PASS:'))throw new Error(`Sem confirmação em ${file}`);
    results.push({test:file,passed:true});
  }
  await run(path.join(bin,'psql'),[...common,'-X','-q','-v','ON_ERROR_STOP=1','-c',`
    INSERT INTO auth.users(id) VALUES ('d0000000-0000-4000-8000-000000000001');
    SET ROLE authenticated;
    SELECT set_config('request.jwt.claims','{"sub":"d0000000-0000-4000-8000-000000000001","role":"authenticated"}',false);
    SELECT public.save_my_shelf('{"test/restore":{"status":"using","note":"Synthetic restore rehearsal","savedAt":"2026-10-17T12:00:00Z"}}',0);
  `]);
  // Restore lógico em outro banco descartável, nunca no banco de origem.
  await run(path.join(bin,'psql'),[...common,'-X','-q','-v','ON_ERROR_STOP=1','-c','CREATE DATABASE bookshelf_restore']);
  const dump=path.join(dir,'rehearsal.dump');
  await run(path.join(bin,'pg_dump'),[...common,'--format=custom','--file',dump]);
  await run(path.join(bin,'pg_restore'),['-h','127.0.0.1','-p',String(port),'-U','bookshelf_test','--dbname=bookshelf_restore','--exit-on-error',dump]);
  const {stdout}=await run(path.join(bin,'psql'),[...common.slice(0,-1),'bookshelf_restore','-X','-q','-v','ON_ERROR_STOP=1','-c',"SELECT (relrowsecurity AND (SELECT count(*)=1 FROM public.user_shelves WHERE entries->'test/restore'->>'note'='Synthetic restore rehearsal') AND has_function_privilege('authenticated','public.save_my_shelf(jsonb,bigint)','execute') AND NOT has_table_privilege('authenticated','public.user_shelves','update')) AS restored FROM pg_class WHERE oid='public.user_shelves'::regclass"]);
  if(!/^\s*t\s*$/m.test(stdout))throw new Error('Restore não preservou os controles esperados');
  results.push({test:'logical-restore-isolated',passed:true});
  await fs.writeFile(path.join(area,'database-tests.json'),JSON.stringify({at:new Date().toISOString(),engine:(await run(path.join(bin,'psql'),['--version'])).stdout.trim(),scope:'isolated synthetic database; Auth contract emulated',results},null,2)+'\n');
  console.log(JSON.stringify(results));
} finally {
  if(started)await run(path.join(bin,'pg_ctl'),['-D',dir,'-m','immediate','-w','stop']);
  await fs.rm(dir,{recursive:true,force:true});
}
