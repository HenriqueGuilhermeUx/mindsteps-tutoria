create extension if not exists pgcrypto;

create table if not exists public.mindsteps_learning_decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  system_key text not null,
  decision_type text not null,
  recommendation_id text,
  subject text,
  skill text,
  evidence jsonb not null default '{}'::jsonb,
  confidence numeric not null default 0 check (confidence >= 0 and confidence <= 1),
  explanation text not null,
  human_review_required boolean not null default false,
  human_override_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists mindsteps_learning_decisions_user_idx on public.mindsteps_learning_decisions(user_id, created_at desc);
create index if not exists mindsteps_learning_decisions_system_idx on public.mindsteps_learning_decisions(system_key, created_at desc);

create table if not exists public.mindsteps_ai_fairness_observations (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.mindsteps_institutions(id) on delete cascade,
  system_key text not null,
  metric_key text not null,
  cohort_key text not null,
  cohort_value text not null,
  sample_size integer not null default 0,
  metric_value numeric not null,
  baseline_value numeric,
  disparity numeric,
  severity text not null default 'info' check (severity in ('info','watch','review')),
  metadata jsonb not null default '{}'::jsonb,
  observed_at timestamptz not null default now()
);
create index if not exists mindsteps_ai_fairness_institution_idx on public.mindsteps_ai_fairness_observations(institution_id, observed_at desc);

create table if not exists public.mindsteps_child_rights_preferences (
  user_id uuid primary key,
  guardian_user_id uuid,
  data_processing_notice_version text not null default '2026-08',
  ai_personalization_allowed boolean not null default true,
  institution_sharing_allowed boolean not null default false,
  research_use_allowed boolean not null default false,
  product_improvement_allowed boolean not null default true,
  marketing_allowed boolean not null default false,
  retention_mode text not null default 'minimum' check (retention_mode in ('minimum','standard')),
  updated_at timestamptz not null default now()
);

create table if not exists public.mindsteps_teacher_intelligence_events (
  id uuid primary key default gen_random_uuid(),
  teacher_user_id uuid not null,
  institution_id uuid references public.mindsteps_institutions(id) on delete cascade,
  student_user_id uuid,
  event_type text not null,
  evidence jsonb not null default '{}'::jsonb,
  recommendation jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open','accepted','adjusted','dismissed','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists mindsteps_teacher_intelligence_teacher_idx on public.mindsteps_teacher_intelligence_events(teacher_user_id, created_at desc);
create index if not exists mindsteps_teacher_intelligence_institution_idx on public.mindsteps_teacher_intelligence_events(institution_id, created_at desc);

alter table public.mindsteps_learning_decisions enable row level security;
alter table public.mindsteps_ai_fairness_observations enable row level security;
alter table public.mindsteps_child_rights_preferences enable row level security;
alter table public.mindsteps_teacher_intelligence_events enable row level security;

comment on table public.mindsteps_learning_decisions is 'Ledger explicável das recomendações pedagógicas relevantes produzidas por sistemas MindSteps.';
comment on table public.mindsteps_ai_fairness_observations is 'Observações agregadas de equidade; não devem ser usadas para rotular estudantes individuais.';
comment on table public.mindsteps_child_rights_preferences is 'Preferências e salvaguardas de dados e IA centradas nos direitos da criança e do adolescente.';
comment on table public.mindsteps_teacher_intelligence_events is 'Recomendações assistivas para docentes, sempre sujeitas a revisão humana.';
