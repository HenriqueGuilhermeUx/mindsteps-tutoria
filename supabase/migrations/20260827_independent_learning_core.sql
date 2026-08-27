create table if not exists public.mindsteps_transfer_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subject text,
  skill text,
  source text not null default 'tutor',
  assisted_score numeric,
  independent_score numeric,
  help_level integer not null default 0,
  attempt_before_help boolean not null default false,
  completed boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_mindsteps_transfer_checks_user_created on public.mindsteps_transfer_checks(user_id, created_at desc);
create index if not exists idx_mindsteps_transfer_checks_user_skill on public.mindsteps_transfer_checks(user_id, skill);

alter table public.mindsteps_transfer_checks enable row level security;
