create table if not exists public.mindsteps_enem_state (
  user_id uuid primary key,
  profile jsonb,
  diagnostic jsonb,
  attempts jsonb not null default '[]'::jsonb,
  simulations jsonb not null default '[]'::jsonb,
  daily_completed jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists mindsteps_enem_state_updated_idx on public.mindsteps_enem_state(updated_at desc);
alter table public.mindsteps_enem_state enable row level security;

comment on table public.mindsteps_enem_state is 'Snapshot portátil do estado ENEM do estudante, sincronizado entre web e app pela API autenticada.';
