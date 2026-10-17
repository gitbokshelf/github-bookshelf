-- Teste transacional. Não envia e-mail, não cria senhas e desfaz os registros.
begin;
insert into auth.users(id) values
  ('b0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000002');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"b0000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select public.save_my_shelf('{"test/project":{"status":"saved","note":"A","savedAt":"2026-10-17T00:00:00Z"}}', 0);
select set_config('request.jwt.claims', '{"sub":"b0000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
do $$ begin
  if (select count(*) from public.user_shelves) <> 0 then raise exception 'FAIL: outra estante visível'; end if;
end $$;
select public.save_my_shelf('{"test/project":{"status":"done","note":"B","savedAt":"2026-10-17T00:00:00Z"}}', 0);
do $$ begin
  if (select count(*) from public.user_shelves) <> 1 then raise exception 'FAIL: leitura própria'; end if;
  if (select entries->'test/project'->>'note' from public.user_shelves) <> 'B' then raise exception 'FAIL: isolamento'; end if;
  begin
    perform public.save_my_shelf('{}',0);
    raise exception 'FAIL: conflito aceito';
  exception when serialization_failure then null;
  end;
  begin
    perform public.save_my_shelf('{"invalid":{"status":"other"}}',1);
    raise exception 'FAIL: JSON inválido aceito';
  exception when invalid_parameter_value then null;
  end;
  begin
    update public.user_shelves set entries = '{}';
    raise exception 'FAIL: update direto aceito';
  exception when insufficient_privilege then null;
  end;
end $$;
select public.save_my_shelf('{}',1);
select set_config('request.jwt.claims', '{"sub":"b0000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
do $$ begin
  if (select entries->'test/project'->>'note' from public.user_shelves) <> 'A' then raise exception 'FAIL: A foi alterado'; end if;
end $$;
reset role;
rollback;
select 'PASS: isolamento de dois usuários, validação, controle de revisão e bloqueio de escrita direta. Fixtures desfeitas.' as result;
