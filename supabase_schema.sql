-- ============================================================
--  PORTFOLIO COMMAND — Supabase schema
--  Paste this whole file into the Supabase SQL Editor and run it.
--  Safe to run once on a fresh project.
-- ============================================================

-- ---- Tables ------------------------------------------------

create table if not exists portfolios (
  id          text primary key,
  name        text not null,
  accent      int  not null default 0,
  sort_order  int  not null default 0,
  owner_id    uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table if not exists tasks (
  id           text primary key,
  title        text not null,
  portfolio_id text references portfolios(id) on delete cascade,
  for_whom     text,
  priority     text not null default 'medium',
  effort       text,
  due          date,
  note         text,
  status       text not null default 'active',
  owner_id     uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now()
);

create table if not exists events (
  id         text primary key,
  title      text not null,
  date       date not null,
  away       boolean not null default true,
  all_day    boolean not null default false,
  start_time text,
  end_time   text,
  note       text,
  owner_id   uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_tasks_owner   on tasks(owner_id);
create index if not exists idx_events_owner  on events(owner_id);
create index if not exists idx_events_date   on events(date);
create index if not exists idx_portf_owner   on portfolios(owner_id);

-- ============================================================
--  Row Level Security
--  - The owner (authenticated user) can do everything on their rows.
--  - Anonymous visitors can READ events only (for the read-only
--    schedule page your wife uses). They cannot read tasks/portfolios.
-- ============================================================

alter table portfolios enable row level security;
alter table tasks      enable row level security;
alter table events     enable row level security;

-- Portfolios: owner full access
drop policy if exists "owner_all_portfolios" on portfolios;
create policy "owner_all_portfolios" on portfolios
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Tasks: owner full access
drop policy if exists "owner_all_tasks" on tasks;
create policy "owner_all_tasks" on tasks
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Events: owner full access
drop policy if exists "owner_all_events" on events;
create policy "owner_all_events" on events
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Events: anyone (incl. anonymous) can READ.
-- This is what powers the public, read-only /schedule page.
-- Only non-sensitive schedule data lives in this table.
drop policy if exists "public_read_events" on events;
create policy "public_read_events" on events
  for select using (true);

-- ============================================================
--  NOTE on the read-only schedule:
--  Because "public_read_events" allows SELECT for everyone, the
--  /schedule route can load your away-days without a login.
--  If you ever want to lock that down to a secret link instead,
--  tell me and I'll switch it to a token-based approach.
-- ============================================================
