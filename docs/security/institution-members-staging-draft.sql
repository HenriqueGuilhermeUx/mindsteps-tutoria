-- STAGING REVIEW DRAFT ONLY. NOT APPLIED.
-- Inspected on mindsteps.org 2026-11-12:
-- public.mindsteps_institutions.id is UUID; parent_institution_id is missing;
-- public.mindsteps_institution_members is missing.
-- Verified: student_profiles.user_id references public.users(id); do not use auth.users here.
-- Run only on a disposable staging clone after reviewing privileges and rollback.
begin;

alter table public.mindsteps_institutions
  add column if not exists parent_institution_id uuid
  references public.mindsteps_institutions(id) on delete restrict;

create index if not exists mindsteps_institutions_parent_idx
  on public.mindsteps_institutions(parent_institution_id);

create table if not exists public.mindsteps_institution_members (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete restrict,
  role text not null check (role in ('owner','admin','coordinator','teacher')),
  status text not null default 'active' check (status in ('active','inactive','revoked')),
  created_at timestamptz not null default now(),
  unique (institution_id,user_id)
);

create index if not exists mindsteps_institution_members_user_active_idx
  on public.mindsteps_institution_members(user_id,institution_id,status);

alter table public.mindsteps_institution_members enable row level security;
revoke all on public.mindsteps_institution_members from anon,authenticated;
grant select,insert,update,delete on public.mindsteps_institution_members to service_role;

-- No client-access RLS policies: server-side membership checks remain mandatory.
-- IMPORTANT: table creation alone does not grant anyone a membership.
-- Do not seed owners automatically or infer ownership from existing student links.
commit;
