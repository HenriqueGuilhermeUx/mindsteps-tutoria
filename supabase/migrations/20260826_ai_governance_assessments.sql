create table if not exists public.mindsteps_ai_governance_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  system_key text not null,
  input jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  risk_level text not null check (risk_level in ('low','medium','high')),
  score integer not null check (score between 0 and 100),
  status text not null,
  created_at timestamptz not null default now()
);
create index if not exists mindsteps_ai_governance_assessments_user_idx on public.mindsteps_ai_governance_assessments(user_id,created_at desc);
create index if not exists mindsteps_ai_governance_assessments_system_idx on public.mindsteps_ai_governance_assessments(system_key,created_at desc);
alter table public.mindsteps_ai_governance_assessments enable row level security;
comment on table public.mindsteps_ai_governance_assessments is 'Avaliações estruturadas de impacto/governança de sistemas de IA educacional segundo princípios do Responsible AI Core.';
