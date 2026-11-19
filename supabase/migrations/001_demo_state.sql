-- ARTANAYA — penyimpanan bersama data demo (prototipe lomba)
-- Jalankan sekali di Supabase Dashboard → SQL Editor → New query → Run.
--
-- Desain kilat: seluruh state demo disimpan sebagai satu dokumen JSON yang
-- disinkronkan real-time ke semua perangkat. Hash chain ledger tetap dihitung
-- dan diverifikasi di browser. Skema per-tabel + RLS per peran = rencana pasca-lomba.

create table if not exists public.demo_state (
  id          text primary key default 'main',
  data        jsonb not null,
  version     bigint not null default 1,
  updated_at  timestamptz not null default now()
);

alter table public.demo_state enable row level security;

-- Prototipe: akun demo tanpa login sungguhan, jadi kunci anon boleh baca & tulis
-- HANYA tabel ini. Jangan simpan data pribadi asli di sini.
drop policy if exists "demo read" on public.demo_state;
drop policy if exists "demo write" on public.demo_state;
drop policy if exists "demo update" on public.demo_state;
create policy "demo read"   on public.demo_state for select to anon using (true);
create policy "demo write"  on public.demo_state for insert to anon with check (id = 'main');
create policy "demo update" on public.demo_state for update to anon using (id = 'main') with check (id = 'main');

-- Kirim perubahan ke semua perangkat secara real-time.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'demo_state'
  ) then
    alter publication supabase_realtime add table public.demo_state;
  end if;
end $$;
