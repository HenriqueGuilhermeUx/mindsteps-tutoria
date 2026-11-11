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
-- Append-only decisions: the trigger records both initial approvals and revocations
-- in the same database transaction as the mutable current-state upsert.
create table if not exists public.mindsteps_ai_student_approval_events (
  id uuid primary key default gen_random_uuid(),
  approval_id uuid not null references public.mindsteps_ai_student_approvals(id),
  institution_id uuid not null,
  student_user_id uuid not null,
  system_key text not null,
  decision text not null check (decision in ('approved','revoked')),
  actor_user_id uuid not null,
  reason text not null,
  expires_at timestamptz not null,
  recorded_at timestamptz not null default now()
);
create index if not exists mindsteps_ai_student_approval_events_scope
  on public.mindsteps_ai_student_approval_events(institution_id,student_user_id,recorded_at desc);
alter table public.mindsteps_ai_student_approval_events enable row level security;
revoke all on public.mindsteps_ai_student_approval_events from anon,authenticated;
-- Even backend service credentials should not directly rewrite past decisions.
-- Review table ownership, role grants and privileged access before deployment.
create or replace function public.mindsteps_capture_student_ai_approval()
returns trigger language plpgsql security invoker set search_path = '' as $
begin
  insert into public.mindsteps_ai_student_approval_events
    (approval_id,institution_id,student_user_id,system_key,decision,actor_user_id,reason,expires_at)
  values
    (new.id,new.institution_id,new.student_user_id,new.system_key,new.status,new.approved_by,new.reason,new.expires_at);
  return new;
end;
$;
drop trigger if exists mindsteps_student_ai_approval_audit on public.mindsteps_ai_student_approvals;
create trigger mindsteps_student_ai_approval_audit
after insert or update on public.mindsteps_ai_student_approvals
for each row execute function public.mindsteps_capture_student_ai_approval();
-- Deploy only after confirming service-role trigger execution privileges and
-- verifying INSERT/UPDATE rollback if audit insertion fails.

