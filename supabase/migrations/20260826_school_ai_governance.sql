create table if not exists public.mindsteps_ai_school_policies (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null unique references public.mindsteps_institutions(id) on delete cascade,
  title text not null default 'Política de IA da instituição',
  status text not null default 'draft' check (status in ('draft','active','archived')),
  allowed_systems jsonb not null default '[]'::jsonb,
  prohibited_uses jsonb not null default '[]'::jsonb,
  age_rules jsonb not null default '{}'::jsonb,
  data_rules jsonb not null default '{}'::jsonb,
  human_review_rules jsonb not null default '{}'::jsonb,
  incident_contact text,
  updated_by uuid,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists mindsteps_ai_school_policies_institution_idx on public.mindsteps_ai_school_policies(institution_id);
alter table public.mindsteps_ai_school_policies enable row level security;

create table if not exists public.mindsteps_ai_incidents (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  reported_by uuid not null,
  system_key text,
  severity text not null default 'low' check (severity in ('low','medium','high','critical')),
  category text not null,
  description text not null,
  status text not null default 'open' check (status in ('open','reviewing','mitigated','closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists mindsteps_ai_incidents_institution_idx on public.mindsteps_ai_incidents(institution_id,created_at desc);
alter table public.mindsteps_ai_incidents enable row level security;

comment on table public.mindsteps_ai_school_policies is 'Política institucional explícita para uso pedagógico e governança de sistemas de IA.';
comment on table public.mindsteps_ai_incidents is 'Registro de incidentes e efeitos adversos relacionados a sistemas de IA na instituição.';
