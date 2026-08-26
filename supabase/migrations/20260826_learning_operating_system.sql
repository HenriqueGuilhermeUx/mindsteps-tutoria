create table if not exists public.mindsteps_learning_os_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  actor text not null default 'student',
  intent text not null default 'learn',
  subject text,
  skill text,
  message_excerpt text,
  intervention text not null,
  system_key text not null,
  stage text not null,
  assistance_mode text not null,
  confidence numeric(4,3) not null default 0.5,
  explanation text not null,
  safeguards jsonb not null default '{}'::jsonb,
  next_action jsonb not null default '{}'::jsonb,
  decision_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists mindsteps_learning_os_runs_user_created_idx on public.mindsteps_learning_os_runs(user_id,created_at desc);
create index if not exists mindsteps_learning_os_runs_system_idx on public.mindsteps_learning_os_runs(system_key,created_at desc);

alter table public.mindsteps_learning_os_runs enable row level security;

drop policy if exists "service role manages learning os runs" on public.mindsteps_learning_os_runs;
create policy "service role manages learning os runs" on public.mindsteps_learning_os_runs
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
