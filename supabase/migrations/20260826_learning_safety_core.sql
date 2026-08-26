create table if not exists public.mindsteps_authorship_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  work_id text not null,
  event_type text not null check (event_type in ('student_original','ai_feedback','ai_suggestion','student_revision','teacher_feedback','final_submission')),
  content text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists mindsteps_authorship_user_work_idx on public.mindsteps_authorship_events(user_id,work_id,created_at);
alter table public.mindsteps_authorship_events enable row level security;

create table if not exists public.mindsteps_intervention_evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  intervention_id text not null,
  skill text not null,
  before_score numeric,
  after_score numeric,
  completed boolean not null default false,
  minutes numeric,
  context text,
  updated_at timestamptz not null default now(),
  unique(user_id, intervention_id)
);
create index if not exists mindsteps_intervention_evidence_user_idx on public.mindsteps_intervention_evidence(user_id,updated_at desc);
alter table public.mindsteps_intervention_evidence enable row level security;

comment on table public.mindsteps_authorship_events is 'Trilha de proveniência pedagógica: separa autoria do estudante, apoio de IA e revisão humana.';
comment on table public.mindsteps_intervention_evidence is 'Evidências antes/depois para avaliar se intervenções pedagógicas realmente ajudam.';
