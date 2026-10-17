begin;
insert into auth.users(id) values
 ('c0000000-0000-4000-8000-000000000001'),
 ('c0000000-0000-4000-8000-000000000002');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"c0000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$
begin
  for revision in 0..9 loop
    perform public.save_my_shelf('{}',revision);
  end loop;
  begin
    perform public.save_my_shelf('{}',10);
    raise exception 'FAIL: rajada sem limite';
  exception when sqlstate 'PT429' then null;
  end;
  if (select revision from public.user_shelves) <> 10 then raise exception 'FAIL: rejeição mudou revisão'; end if;
  begin
    perform 1 from bookshelf_private.write_buckets;
    raise exception 'FAIL: cota interna visível';
  exception when insufficient_privilege then null;
  end;
end $$;
select set_config('request.jwt.claims','{"sub":"c0000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
do $$ begin
  perform public.save_my_shelf('{}',0);
  if (select count(*) from public.user_shelves) <> 1 then raise exception 'FAIL: isolamento de contas'; end if;
end $$;
reset role;
-- Reposição sem espera real: estado interno controlado apenas pelo teste admin.
update bookshelf_private.write_buckets set tokens=0, refilled_at=clock_timestamp()-interval '2 seconds'
 where user_id='c0000000-0000-4000-8000-000000000001';
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"c0000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
do $$ begin
  perform public.save_my_shelf('{}',10);
  begin
    perform public.save_my_shelf('{}',11);
    raise exception 'FAIL: reposição excessiva';
  exception when sqlstate 'PT429' then null;
  end;
end $$;
reset role;
rollback;
select 'PASS: quota por conta, rajada, reposição, isolamento, tabela privada e preservação da revisão.' as result;
