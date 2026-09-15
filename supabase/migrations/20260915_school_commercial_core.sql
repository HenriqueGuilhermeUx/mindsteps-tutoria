-- MindSteps School Commercial Core
-- B2B onboarding, classes, guardians, seats and audit trail.

alter table public.mindsteps_institutions
  add column if not exists legal_name text,
  add column if not exists document text,
  add column if not exists logo_url text,
  add column if not exists status text not null default 'active',
  add column if not exists onboarding_status text not null default 'setup',
  add column if not exists seat_limit integer,
  add column if not exists plan_code text not null default 'pilot',
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.mindsteps_school_classes (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  name text not null,
  grade text,
  school_year integer,
  shift text,
  status text not null default 'active' check (status in ('active','archived')),
  created_by uuid,
  created_at timestamptz not null default now(),
  unique(institution_id,name,school_year)
);
create index if not exists mindsteps_school_classes_institution_idx on public.mindsteps_school_classes(institution_id);

alter table public.mindsteps_student_links
  add column if not exists class_id uuid references public.mindsteps_school_classes(id) on delete set null,
  add column if not exists external_id text;
create index if not exists mindsteps_student_links_class_idx on public.mindsteps_student_links(class_id);

create table if not exists public.mindsteps_guardian_links (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  student_user_id uuid not null,
  guardian_user_id uuid not null,
  relationship text,
  status text not null default 'active' check (status in ('pending','active','revoked')),
  created_by uuid,
  created_at timestamptz not null default now(),
  unique(institution_id,student_user_id,guardian_user_id)
);
create index if not exists mindsteps_guardian_links_guardian_idx on public.mindsteps_guardian_links(guardian_user_id);
create index if not exists mindsteps_guardian_links_student_idx on public.mindsteps_guardian_links(student_user_id);

create table if not exists public.mindsteps_school_invites (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin','coordinator','teacher','guardian','student')),
  class_id uuid references public.mindsteps_school_classes(id) on delete set null,
  student_user_id uuid,
  token_hash text not null unique,
  status text not null default 'pending' check (status in ('pending','accepted','revoked','expired')),
  expires_at timestamptz not null,
  created_by uuid not null,
  accepted_by uuid,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists mindsteps_school_invites_institution_idx on public.mindsteps_school_invites(institution_id);
create index if not exists mindsteps_school_invites_email_idx on public.mindsteps_school_invites(lower(email));

create table if not exists public.mindsteps_school_licenses (
  institution_id uuid primary key references public.mindsteps_institutions(id) on delete cascade,
  plan_code text not null default 'pilot',
  seat_limit integer not null default 100,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  status text not null default 'trial' check (status in ('trial','active','past_due','suspended','cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.mindsteps_school_audit_log (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  actor_user_id uuid,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists mindsteps_school_audit_log_institution_idx on public.mindsteps_school_audit_log(institution_id,created_at desc);

alter table public.mindsteps_school_classes enable row level security;
alter table public.mindsteps_guardian_links enable row level security;
alter table public.mindsteps_school_invites enable row level security;
alter table public.mindsteps_school_licenses enable row level security;
alter table public.mindsteps_school_audit_log enable row level security;

comment on table public.mindsteps_school_classes is 'Turmas provisionadas pela escola para operação B2B.';
comment on table public.mindsteps_guardian_links is 'Vínculos explícitos entre responsáveis e estudantes no contexto institucional.';
comment on table public.mindsteps_school_licenses is 'Licenciamento e limite de assentos da instituição.';
comment on table public.mindsteps_school_audit_log is 'Trilha de auditoria administrativa da operação escolar.';