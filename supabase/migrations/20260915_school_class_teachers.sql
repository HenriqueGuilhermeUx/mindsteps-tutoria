create table if not exists public.mindsteps_school_class_teachers (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.mindsteps_institutions(id) on delete cascade,
  class_id uuid not null references public.mindsteps_school_classes(id) on delete cascade,
  teacher_user_id uuid not null,
  subject text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_by uuid,
  created_at timestamptz not null default now(),
  unique(institution_id,class_id,teacher_user_id,subject)
);
create index if not exists mindsteps_school_class_teachers_institution_idx on public.mindsteps_school_class_teachers(institution_id);
create index if not exists mindsteps_school_class_teachers_class_idx on public.mindsteps_school_class_teachers(class_id);
create index if not exists mindsteps_school_class_teachers_teacher_idx on public.mindsteps_school_class_teachers(teacher_user_id);
alter table public.mindsteps_school_class_teachers enable row level security;
comment on table public.mindsteps_school_class_teachers is 'Escopo pedagógico de professores por turma e componente curricular no produto B2B escolar.';
