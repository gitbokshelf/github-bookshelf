-- GitHub Bookshelf. Acesso privado por usuário e gravação com revisão otimista.
begin;

create function public.bookshelf_valid_entries(payload jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select case
    when jsonb_typeof(payload) is distinct from 'object' then false
    when octet_length(payload::text) > 2097152 then false
    else not exists (
      select 1 from jsonb_each(payload) as entry(repo, value)
      where repo !~ '^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$'
        or jsonb_typeof(value) is distinct from 'object'
        or jsonb_typeof(value->'note') is distinct from 'string'
        or char_length(value->>'note') > 10000
        or jsonb_typeof(value->'savedAt') is distinct from 'string'
        or char_length(value->>'savedAt') > 64
        or coalesce(value->>'status', '') not in ('saved', 'using', 'done')
    )
  end;
$$;

create table public.user_shelves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  entries jsonb not null default '{}'::jsonb,
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  constraint valid_shelf_entries check (public.bookshelf_valid_entries(entries))
);

alter table public.user_shelves enable row level security;
create policy "Read own shelf" on public.user_shelves
  for select to authenticated using ((select auth.uid()) = user_id);

revoke all on public.user_shelves from anon, authenticated;
grant select on public.user_shelves to authenticated;
revoke all on function public.bookshelf_valid_entries(jsonb) from public;
grant execute on function public.bookshelf_valid_entries(jsonb) to authenticated;

-- Não aceita user_id do cliente. O proprietário vem exclusivamente da sessão.
-- A revisão evita sobrescrever silenciosamente uma edição feita em outra aba.
create function public.save_my_shelf(p_entries jsonb, p_expected_revision bigint)
returns public.user_shelves
language plpgsql security definer set search_path = '' as $$
declare
  owner_id uuid := auth.uid();
  saved public.user_shelves;
begin
  if owner_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if p_expected_revision is null or p_expected_revision < 0 then
    raise exception 'Invalid revision' using errcode = '22023';
  end if;
  if not public.bookshelf_valid_entries(p_entries) then
    raise exception 'Invalid shelf entries' using errcode = '22023';
  end if;
  if p_expected_revision = 0 then
    insert into public.user_shelves(user_id, entries) values(owner_id, p_entries)
    on conflict (user_id) do nothing returning * into saved;
  else
    update public.user_shelves
      set entries = p_entries, revision = revision + 1, updated_at = now()
      where user_id = owner_id and revision = p_expected_revision
      returning * into saved;
  end if;
  if saved.user_id is null then
    raise exception 'Shelf changed on another device; reload before saving'
      using errcode = '40001';
  end if;
  return saved;
end;
$$;
revoke all on function public.save_my_shelf(jsonb,bigint) from public, anon;
grant execute on function public.save_my_shelf(jsonb,bigint) to authenticated;

comment on table public.user_shelves is 'Estantes privadas. RLS permite ler apenas a própria linha; escrita passa por save_my_shelf.';
commit;
