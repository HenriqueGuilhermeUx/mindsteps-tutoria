-- DRAFT FOR STAGING REVIEW ONLY. Not applied to any database.
-- Requires verification of existing users / institutions key types before execution.
create table if not exists public.mindsteps_ai_student_approvals (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null,
  student_user_id uuid not null,
  system_key text not null check (system_key in ('socratic_tutor','independent_assessment')),
  status text not null check (status in ('approved','revoked')),
  approved_by uuid not null,
  expires_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (institution_id,student_user_id,system_key)
);
create index if not exists mindsteps_ai_student_approvals_lookup
  on public.mindsteps_ai_student_approvals(student_user_id,system_key,status,expires_at);
alter table public.mindsteps_ai_student_approvals enable row level security;
-- No anon/authenticated policies. Backend-only service-role access after server
-- authorization; no direct student or public mutation via the Data API.
revoke all on public.mindsteps_ai_student_approvals from anon,authenticated;
-- IMPORTANT: upsert updates destroy prior status unless a separate append-only
-- audit trail is persisted. Review audit strategy before applying this draft.
