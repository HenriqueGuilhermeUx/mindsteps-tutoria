create table if not exists public.mindsteps_institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'school' check (type in ('school','class','program','network','course')),
  city text,
  state text,
  created_at timestamptz not null default now()
);

create table if not exists public.mindsteps_institution_invites (
  code text primary key,
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  label text,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.mindsteps_student_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  role text not null default 'student',
  status text not null default 'active' check (status in ('active','pending','inactive')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique(user_id, institution_id)
);

create index if not exists mindsteps_student_links_user_idx on public.mindsteps_student_links(user_id);
create index if not exists mindsteps_student_links_institution_idx on public.mindsteps_student_links(institution_id);

alter table public.mindsteps_institutions enable row level security;
alter table public.mindsteps_institution_invites enable row level security;
alter table public.mindsteps_student_links enable row level security;

comment on table public.mindsteps_student_links is 'Vincula a identidade individual do estudante a escolas, turmas, programas ou redes sem substituir seu histórico pessoal.';
comment on table public.mindsteps_institution_invites is 'Códigos de convite emitidos por instituições para vincular estudantes existentes.';
