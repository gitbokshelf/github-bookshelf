import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {translator,validateDictionary,isLanguage} from '../../frontend/src/utils/localization.ts';
const dictionary=lang=>validateDictionary(JSON.parse(fs.readFileSync(new URL(`../../frontend/public/locales/${lang}.json`,import.meta.url))));
test('idiomas traduzem conteúdo e rótulos mantendo nomes, busca e dados do usuário',()=>{
 for(const lang of ['en','es']){
  const t=translator(dictionary(lang));
  assert.notEqual(t('Entrar'),'Entrar');
  assert.notEqual(t('Detalhes de freeCodeCamp'),'Detalhes de freeCodeCamp');
  assert.ok(t('Resultados para “Minha conta <script>”').includes('Minha conta <script>'));
  assert.notEqual(t(' · Intermediário'),' · Intermediário');
  assert.notEqual(t(' em Finanças pessoais'),' em Finanças pessoais');
  assert.notEqual(t(' · Licença: MIT'),' · Licença: MIT');
  assert.ok(t(' · Licença: MIT').endsWith('MIT'));
  assert.equal(t('freeCodeCamp'),'freeCodeCamp');
  assert.equal(t('Meu texto pessoal que não pertence ao dicionário'),'Meu texto pessoal que não pertence ao dicionário');
  assert.equal(t(150),150);assert.equal(t(null),null);
  const object={note:'Entrar'};assert.equal(t(object),object);
  assert.equal(t('a de '.repeat(10000)), 'a de '.repeat(10000));
 }
});
test('dicionários rejeitam formatos, protótipos e valores não textuais',()=>{
 for(const input of [null,[],{text:{}},JSON.parse('{"__proto__":"unsafe"}'),{text:'x'.repeat(15001)}])assert.throws(()=>validateDictionary(input));
 for(const input of ['fr','../../secret',null,'EN'])assert.equal(isLanguage(input),false);
 for(const input of ['pt-BR','en','es'])assert.equal(isLanguage(input),true);
 const t=translator({'Nome (literal) {name}':'Name {name}'});
 assert.equal(t('Nome (literal) x'),'Name x');
 assert.equal(t('Nome literal x'),'Nome literal x');
});
test('traduções cobrem cada projeto e todos os parágrafos dos guias', async()=>{
 const catalog=JSON.parse(fs.readFileSync(new URL('../../frontend/src/data/catalog.json',import.meta.url)));
 const {guideList}=await import('../../frontend/src/data/guides.ts');
 for(const lang of ['en','es']){
  const d=dictionary(lang);
  for(const p of catalog.projects) for(const key of ['tagline','description','start','caveat'])assert.ok(Object.hasOwn(d,p[key]),`${lang}: ${p.name}/${key}`);
  for(const guide of guideList)for(const source of [guide.title,guide.sub,...guide.steps.flat()])assert.ok(Object.hasOwn(d,source),`${lang}: ${source}`);
 }
});
