-- Nova migração: quota de escrita por conta, sem alterar a migração aplicada.
-- Rajada de 10 escritas; repõe 1 crédito a cada 2s (30/min em média).
begin;
create schema bookshelf_private;
revoke all on schema bookshelf_private from public, anon, authenticated;
create table bookshelf_private.write_buckets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tokens double precision not null default 10 check (tokens >= 0 and tokens <= 10),
  refilled_at timestamptz not null default clock_timestamp()
);
alter table bookshelf_private.write_buckets enable row level security;
revoke all on bookshelf_private.write_buckets from public, anon, authenticated;

create or replace function public.save_my_shelf(p_entries jsonb, p_expected_revision bigint)
returns public.user_shelves
language plpgsql security definer set search_path = '' as $$
declare
  owner_id uuid := auth.uid();
  saved public.user_shelves;
  bucket bookshelf_private.write_buckets;
  checked_at timestamptz;
  available double precision;
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
  -- Cota compartilhada por todas as abas/dispositivos da conta.
  -- Escritas inválidas ou conflitantes não consomem cota, pois sofrem rollback.
  insert into bookshelf_private.write_buckets(user_id) values(owner_id)
    on conflict (user_id) do nothing;
  select * into bucket from bookshelf_private.write_buckets
    where user_id = owner_id for update;
  checked_at := clock_timestamp();
  available := least(10.0, bucket.tokens + greatest(0.0,
    extract(epoch from checked_at - bucket.refilled_at)) / 2.0);
  if available < 1.0 then
    raise sqlstate 'PT429' using message = 'Shelf write rate limit reached',
      detail = 'Retry after 2 seconds. Local changes must be preserved.';
  end if;
  update bookshelf_private.write_buckets
    set tokens = available - 1.0, refilled_at = checked_at
    where user_id = owner_id;
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
comment on table bookshelf_private.write_buckets is 'Cota interna por conta. Sem acesso direto pela API pública.';
commit;
