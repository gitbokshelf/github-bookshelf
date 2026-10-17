// Ensaio de transferência HTTP local. Não executa React nem consulta contas/banco.
import http from 'k6/http';
import { check, sleep } from 'k6';
const target = __ENV.TARGET || 'http://127.0.0.1:4173';
if (!/^http:\/\/(127\.0\.0\.1|localhost):4173$/.test(target)) {
  throw new Error('Este ensaio permite somente preview local na porta 4173.');
}
export const options = {
  scenarios: { catalog: { executor: 'constant-vus', vus: 10, duration: '30s', gracefulStop: '5s' } },
  thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<500'], checks: ['rate>0.99'] },
  maxRedirects: 0,
};
export default function () {
  const page = http.get(`${target}/`, {timeout: '3s'});
  check(page, { 'HTML 200': r => r.status === 200, 'CSP presente': r => !!r.headers['Content-Security-Policy'] });
  const paths = [...page.body.matchAll(/(?:src|href)="(\.\/assets\/[^" ]+\.(?:js|css))"/g)].map(m => `${target}/${m[1].slice(2)}`);
  const responses = http.batch([...new Set(paths)].map(url => ['GET', url, null, {timeout:'3s'}]));
  for (const r of responses) check(r, { 'recurso 200': response => response.status === 200 });
  sleep(1);
}
