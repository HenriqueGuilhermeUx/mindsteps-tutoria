create table if not exists public.mindsteps_learning_os_policies (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  enabled boolean not null default true,
  allowed_systems jsonb not null default '[]'::jsonb,
  blocked_systems jsonb not null default '[]'::jsonb,
  force_human_review_for jsonb not null default '[]'::jsonb,
  max_confidence_for_autonomy numeric not null default 0.85,
  require_source_reminder boolean not null default false,
  require_offline_balance boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(institution_id)
);

create table if not exists public.mindsteps_learning_os_outcomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  run_id uuid not null references public.mindsteps_learning_os_runs(id) on delete cascade,
  before_score numeric,
  after_score numeric,
  delta numeric,
  completed boolean not null default false,
  student_feedback text check (student_feedback in ('helped','neutral','did_not_help')),
  teacher_feedback text check (teacher_feedback in ('confirmed','adjusted','rejected')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.mindsteps_learning_os_escalations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  institution_id uuid references public.mindsteps_institutions(id) on delete set null,
  run_id uuid references public.mindsteps_learning_os_runs(id) on delete set null,
  system_key text not null,
  level text not null check (level in ('normal','human_review','incident','blocked')),
  reasons jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  resolved boolean not null default false,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_learning_os_outcomes_user on public.mindsteps_learning_os_outcomes(user_id, created_at desc);
create index if not exists idx_learning_os_escalations_user on public.mindsteps_learning_os_escalations(user_id, created_at desc);
create index if not exists idx_learning_os_escalations_institution on public.mindsteps_learning_os_escalations(institution_id, created_at desc);

alter table public.mindsteps_learning_os_policies enable row level security;
alter table public.mindsteps_learning_os_outcomes enable row level security;
alter table public.mindsteps_learning_os_escalations enable row level security;
