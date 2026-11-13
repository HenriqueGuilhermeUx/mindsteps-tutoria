\set ON_ERROR_STOP on
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role NOLOGIN; END IF;
END $$;
CREATE TABLE public.users(id uuid PRIMARY KEY);
CREATE TABLE public.mindsteps_institutions(id uuid PRIMARY KEY);
INSERT INTO public.users(id) VALUES
 ('00000000-0000-4000-8000-000000000001'),
 ('00000000-0000-4000-8000-000000000002'),
 ('00000000-0000-4000-8000-000000000003');
INSERT INTO public.mindsteps_institutions(id) VALUES
 ('10000000-0000-4000-8000-000000000001'),
 ('10000000-0000-4000-8000-000000000002');
\i docs/security/institution-members-staging-draft.sql
\i docs/security/individual-ai-approvals-staging-draft.sql
INSERT INTO public.mindsteps_institution_members(institution_id,user_id,role,status) VALUES
 ('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','coordinator','active'),
 ('10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000003','teacher','active');
INSERT INTO public.mindsteps_ai_student_approvals(institution_id,student_user_id,system_key,status,approved_by,expires_at,reason)
VALUES ('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002','socratic_tutor','approved','00000000-0000-4000-8000-000000000001',now()+interval '1 day','Autorizacao controlada');
DO $$
DECLARE v_approval_id uuid; event_count int;
BEGIN
 SELECT id INTO v_approval_id FROM public.mindsteps_ai_student_approvals LIMIT 1;
 SELECT count(*) INTO event_count FROM public.mindsteps_ai_student_approval_events;
 IF event_count <> 1 THEN RAISE EXCEPTION 'Initial audit missing'; END IF;
 BEGIN
  UPDATE public.mindsteps_ai_student_approvals SET system_key='independent_assessment' WHERE id=v_approval_id;
  RAISE EXCEPTION 'Identity update unexpectedly succeeded';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'AI approval identity and creation timestamp are immutable' THEN RAISE; END IF;
 END;
 BEGIN
  INSERT INTO public.mindsteps_ai_student_approvals(institution_id,student_user_id,system_key,status,approved_by,expires_at,reason)
  VALUES ('10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002','socratic_tutor','approved','00000000-0000-4000-8000-000000000003',now()+interval '1 day','Professor sem permissao');
  RAISE EXCEPTION 'Teacher approval unexpectedly succeeded';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Approval actor is not an active manager of this institution' THEN RAISE; END IF;
 END;
 -- Verify every immutable field, not only the system key.
 BEGIN
  UPDATE public.mindsteps_ai_student_approvals SET id='00000000-0000-4000-8000-000000000003' WHERE id=v_approval_id;
  RAISE EXCEPTION 'ID update unexpectedly succeeded';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'AI approval identity and creation timestamp are immutable' THEN RAISE; END IF;
 END;
 BEGIN
  UPDATE public.mindsteps_ai_student_approvals SET institution_id='10000000-0000-4000-8000-000000000002' WHERE id=v_approval_id;
  RAISE EXCEPTION 'School update unexpectedly succeeded';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'AI approval identity and creation timestamp are immutable' THEN RAISE; END IF;
 END;
 BEGIN
  UPDATE public.mindsteps_ai_student_approvals SET student_user_id='00000000-0000-4000-8000-000000000003' WHERE id=v_approval_id;
  RAISE EXCEPTION 'Student update unexpectedly succeeded';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'AI approval identity and creation timestamp are immutable' THEN RAISE; END IF;
 END;
 BEGIN
  UPDATE public.mindsteps_ai_student_approvals SET created_at=now()+interval '1 day' WHERE id=v_approval_id;
  RAISE EXCEPTION 'Created-at update unexpectedly succeeded';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'AI approval identity and creation timestamp are immutable' THEN RAISE; END IF;
 END;
 BEGIN
  INSERT INTO public.mindsteps_ai_student_approvals(institution_id,student_user_id,system_key,status,approved_by,expires_at,reason)
  VALUES ('10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002','socratic_tutor','approved','00000000-0000-4000-8000-000000000001',now()+interval '1 day','Gestor de outra escola');
  RAISE EXCEPTION 'Cross-school approval unexpectedly succeeded';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Approval actor is not an active manager of this institution' THEN RAISE; END IF;
 END;
 BEGIN
  INSERT INTO public.mindsteps_ai_student_approvals(institution_id,student_user_id,system_key,status,approved_by,expires_at,reason)
  VALUES ('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002','independent_assessment','approved','00000000-0000-4000-8000-000000000001',now()+interval '1 day','     ');
  RAISE EXCEPTION 'Whitespace-only reason unexpectedly succeeded';
 EXCEPTION WHEN check_violation THEN NULL;
 END;
 SELECT count(*) INTO event_count FROM public.mindsteps_ai_student_approval_events;
 IF event_count <> 1 THEN RAISE EXCEPTION 'Denied operations changed audit history'; END IF;
 UPDATE public.mindsteps_ai_student_approvals SET status='revoked',reason='Revogacao auditada' WHERE id=v_approval_id;
 SELECT count(*) INTO event_count FROM public.mindsteps_ai_student_approval_events;
 IF event_count <> 2 THEN RAISE EXCEPTION 'Revocation audit missing'; END IF;
 BEGIN
  DELETE FROM public.mindsteps_ai_student_approval_events WHERE approval_id=v_approval_id;
  RAISE EXCEPTION 'Audit deletion unexpectedly succeeded';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'AI approval audit events are append-only' THEN RAISE; END IF;
 END;
END $$;
-- Assert the SQL drafts deny direct anonymous/authenticated table access.
DO $$
DECLARE rel text;
BEGIN
 FOREACH rel IN ARRAY ARRAY['mindsteps_institution_members','mindsteps_ai_student_approvals','mindsteps_ai_student_approval_events'] LOOP
  IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid=('public.'||rel)::regclass) THEN
    RAISE EXCEPTION 'RLS disabled on %',rel;
  END IF;
  IF has_table_privilege('anon',('public.'||rel)::regclass,'SELECT')
    OR has_table_privilege('anon',('public.'||rel)::regclass,'INSERT')
    OR has_table_privilege('authenticated',('public.'||rel)::regclass,'SELECT')
    OR has_table_privilege('authenticated',('public.'||rel)::regclass,'INSERT') THEN
    RAISE EXCEPTION 'Client role unexpectedly has access to %',rel;
  END IF;
  IF NOT has_table_privilege('service_role',('public.'||rel)::regclass,'SELECT') THEN
    RAISE EXCEPTION 'Service role missing SELECT on %',rel;
  END IF;
 END LOOP;
 IF has_table_privilege('service_role','public.mindsteps_ai_student_approval_events','UPDATE')
   OR has_table_privilege('service_role','public.mindsteps_ai_student_approval_events','DELETE') THEN
   RAISE EXCEPTION 'Service role can rewrite audit history';
 END IF;
END $$;
SELECT 'SQL staging migration smoke test passed' AS result;
