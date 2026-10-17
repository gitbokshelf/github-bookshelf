import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../frontend/', import.meta.url));
const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const ts = require('typescript');
const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const reachable = new Set();
function visit(file) {
  file = path.resolve(file);
  if (reachable.has(file)) return;
  reachable.add(file);
  const text = fs.readFileSync(file, 'utf8');
  const imports = file.endsWith('.css')
    ? [...text.matchAll(/@import\s+["']([^"']+)["']/g)].map(match => match[1])
    : file.endsWith('.json') ? [] : ts.preProcessFile(text, true, true).importedFiles.map(item => item.fileName);
  for (const specifier of imports) {
    if (!specifier.startsWith('.')) continue;
    const asset = path.resolve(path.dirname(file), specifier);
    const resolved = fs.existsSync(asset) && fs.statSync(asset).isFile() ? asset
      : ts.resolveModuleName(specifier, file, options, ts.sys).resolvedModule?.resolvedFileName;
    if (!resolved) throw new Error(`Import local sem destino: ${path.relative(root,file)} → ${specifier}`);
    visit(resolved);
  }
}
visit(path.join(root, 'src/main.tsx'));
// Declaração ambiente incluída pelo tsconfig, sem import de runtime.
visit(path.join(root, 'src/vite-env.d.ts'));
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(path.join(dir,entry.name)) : [path.join(dir,entry.name)]);
const source = walk(path.join(root,'src')).filter(file => /\.(?:tsx?|css|json)$/.test(file));
const unused = source.filter(file => !reachable.has(file));
if (unused.length) throw new Error(`Arquivos sem vínculo com a aplicação: ${unused.map(file=>path.relative(root,file)).join(', ')}`);
console.log(`Grafo conferido: ${source.length} arquivos de fonte vinculados à aplicação, sem import local ausente.`);
