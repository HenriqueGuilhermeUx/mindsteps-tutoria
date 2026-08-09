-- MindSteps ENEM Writing Learning Engine
-- Longitudinal portfolio: projects -> versions -> drills -> measured effects

create extension if not exists pgcrypto;

create table if not exists public.writing_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  theme text not null,
  area text not null,
  focus text not null default 'argumentacao' check (focus in ('tese','argumentacao','repertorio','coesao','intervencao','clareza')),
  status text not null default 'draft' check (status in ('draft','review','complete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.writing_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.writing_projects(id) on delete cascade,
  user_id uuid not null,
  version_number integer not null,
  body text not null,
  word_count integer not null default 0,
  signals jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(project_id, version_number)
);

create table if not exists public.writing_drill_results (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.writing_projects(id) on delete cascade,
  source_version_id uuid references public.writing_versions(id) on delete set null,
  user_id uuid not null,
  skill text not null check (skill in ('tese','argumentacao','repertorio','coesao','intervencao','clareza')),
  drill_type text not null,
  answer text not null,
  completed boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.writing_intervention_effects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  project_id uuid not null references public.writing_projects(id) on delete cascade,
  drill_result_id uuid not null references public.writing_drill_results(id) on delete cascade,
  before_version_id uuid not null references public.writing_versions(id) on delete cascade,
  after_version_id uuid not null references public.writing_versions(id) on delete cascade,
  skill text not null check (skill in ('tese','argumentacao','repertorio','coesao','intervencao','clareza')),
  before_score numeric not null,
  after_score numeric not null,
  delta numeric generated always as (after_score - before_score) stored,
  measurement_method text not null default 'heuristic-v1',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(drill_result_id, after_version_id)
);

create index if not exists writing_projects_user_idx on public.writing_projects(user_id, updated_at desc);
create index if not exists writing_versions_project_idx on public.writing_versions(project_id, version_number desc);
create index if not exists writing_drills_user_skill_idx on public.writing_drill_results(user_id, skill, created_at desc);
create index if not exists writing_effects_user_skill_idx on public.writing_intervention_effects(user_id, skill, created_at desc);

-- These tables are designed to be accessed by the MindSteps backend using the
-- authenticated application user id. Do not expose service-role credentials to the app.
alter table public.writing_projects enable row level security;
alter table public.writing_versions enable row level security;
alter table public.writing_drill_results enable row level security;
alter table public.writing_intervention_effects enable row level security;

-- No permissive anon policies are intentionally created here.
-- The backend/service layer owns writes until application auth is unified with Supabase Auth.
