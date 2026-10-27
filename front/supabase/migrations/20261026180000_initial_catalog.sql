create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sport text not null,
  level text not null,
  city text not null,
  state text not null check (char_length(state) = 2),
  distance_km numeric(7, 2) not null default 0 check (distance_km >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('campeonato', 'evento')),
  sport text not null,
  level text not null,
  starts_on date not null,
  ends_on date,
  city text not null,
  state text not null check (char_length(state) = 2),
  open_slots integer not null default 0 check (open_slots >= 0),
  created_at timestamptz not null default now(),
  check (ends_on is null or ends_on >= starts_on)
);

create table if not exists public.team_openings (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  position text not null,
  tags text[] not null default '{}',
  open_positions integer not null default 1 check (open_positions > 0),
  applicants_count integer not null default 0 check (applicants_count >= 0),
  published_at date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.teams enable row level security;
alter table public.events enable row level security;
alter table public.team_openings enable row level security;

grant select on public.teams, public.events, public.team_openings to anon, authenticated;

create policy "Anyone can view teams"
  on public.teams for select
  to anon, authenticated
  using (true);

create policy "Anyone can view events"
  on public.events for select
  to anon, authenticated
  using (true);

create policy "Anyone can view team openings"
  on public.team_openings for select
  to anon, authenticated
  using (true);
