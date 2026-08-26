create extension if not exists pgcrypto;

create table if not exists public.mindsteps_responsible_ai_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  session_id uuid,
  system_key text not null,
  action text not null,
  education_stage text,
  assistance_mode text,
  intent text,
  confidence text,
  explanation text,
  policy jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists mindsteps_responsible_ai_events_user_idx on public.mindsteps_responsible_ai_events(user_id, created_at desc);
create index if not exists mindsteps_responsible_ai_events_system_idx on public.mindsteps_responsible_ai_events(system_key, created_at desc);

create table if not exists public.mindsteps_ai_human_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  system_key text not null,
  recommendation_id text,
  decision text not null check (decision in ('accepted','adjusted','rejected')),
  reason text,
  original_payload jsonb not null default '{}'::jsonb,
  replacement_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists mindsteps_ai_human_overrides_user_idx on public.mindsteps_ai_human_overrides(user_id, created_at desc);
create index if not exists mindsteps_ai_human_overrides_system_idx on public.mindsteps_ai_human_overrides(system_key, created_at desc);

create table if not exists public.mindsteps_ai_literacy_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  learning_id integer not null check (learning_id between 1 and 12),
  mission_id text not null,
  status text not null default 'started' check (status in ('started','completed')),
  evidence text,
  reflection text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, mission_id)
);
create index if not exists mindsteps_ai_literacy_progress_user_idx on public.mindsteps_ai_literacy_progress(user_id, updated_at desc);

alter table public.mindsteps_responsible_ai_events enable row level security;
alter table public.mindsteps_ai_human_overrides enable row level security;
alter table public.mindsteps_ai_literacy_progress enable row level security;

comment on table public.mindsteps_responsible_ai_events is 'Trilha de auditoria do Responsible AI Core: política aplicada, explicação, intenção e contexto de cada intervenção relevante.';
comment on table public.mindsteps_ai_human_overrides is 'Registra aceitação, ajuste ou rejeição humana de recomendações de IA para garantir supervisão e reversibilidade.';
comment on table public.mindsteps_ai_literacy_progress is 'Progresso do estudante nas 12 aprendizagens de letramento em IA organizadas pelo MindSteps.';
