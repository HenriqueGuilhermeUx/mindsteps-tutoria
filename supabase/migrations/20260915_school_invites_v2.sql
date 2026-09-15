alter table public.mindsteps_school_invites
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists idx_school_invites_student_email
  on public.mindsteps_school_invites (institution_id, lower((metadata->>'studentEmail')))
  where status = 'pending' and role = 'guardian';

comment on column public.mindsteps_school_invites.metadata is
  'Provisioning context carried until invite acceptance, e.g. subject, studentEmail, relationship, externalId and name.';
