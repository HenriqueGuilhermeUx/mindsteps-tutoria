alter table public.mindsteps_institutions
  add column if not exists parent_institution_id uuid references public.mindsteps_institutions(id) on delete cascade;

create index if not exists mindsteps_institutions_parent_idx
  on public.mindsteps_institutions(parent_institution_id);

create table if not exists public.mindsteps_institution_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  role text not null check (role in ('owner','admin','coordinator','teacher')),
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  unique(user_id, institution_id)
);

create index if not exists mindsteps_institution_members_user_idx
  on public.mindsteps_institution_members(user_id);
create index if not exists mindsteps_institution_members_institution_idx
  on public.mindsteps_institution_members(institution_id);

alter table public.mindsteps_institution_members enable row level security;

alter table public.mindsteps_institution_invites
  add column if not exists created_by uuid,
  add column if not exists max_uses integer,
  add column if not exists uses_count integer not null default 0;

comment on table public.mindsteps_institution_members is 'Gestores e educadores autorizados a administrar uma instituição MindSteps.';
comment on column public.mindsteps_institutions.parent_institution_id is 'Permite modelar turma/curso/programa dentro de uma escola ou rede.';
