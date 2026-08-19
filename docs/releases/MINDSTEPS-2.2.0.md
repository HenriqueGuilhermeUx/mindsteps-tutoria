# MindSteps 2.2.0 — Release Runbook

## Android identity
- package: `br.com.alternativeventures.mindsteps`
- versionName: `2.2.0`
- versionCode: `6`
- artifact: `MindSteps-2.2.0-vc6-Android-AAB`
- test APK: `MindSteps-2.2.0-vc6-Teste-APK`

## Product scope
### Core app
- mobile-first Today experience
- Socratic Tutor
- missions, learning map, mastery, passport, profile
- portable learning connections (`/vinculos`)

### ENEM
- ENEM setup + target
- adaptive diagnostic
- Meu Dia ENEM
- skill map
- adaptive questions
- strategic simulation
- Strategy Coach
- Writing Studio
- Writing Coach
- Writing DNA
- theme engine
- repertoire lab
- version comparison
- Minha Semana ENEM
- Caderno de Erros
- cloud synchronization of ENEM state

## Database migrations required before exposing 2.2.0
Run in Supabase SQL Editor, in order:
1. `supabase/migrations/20260819_student_institution_links.sql`
2. `supabase/migrations/20260819_enem_cloud_state.sql`

The existing ENEM writing migration must already be applied where Writing Sync is enabled.

## Backend deploy
The backend must deploy the current `server` package after the migrations. New authenticated endpoints:
- `GET /api/institutions/me/links`
- `POST /api/institutions/me/links/join`
- `DELETE /api/institutions/me/links/:linkId`
- `GET /api/enem/state`
- `PUT /api/enem/state`

## Creating an institution + invite code
Example for Supabase SQL Editor:

```sql
with new_institution as (
  insert into public.mindsteps_institutions (name, type, city, state)
  values ('Escola Piloto MindSteps', 'school', 'São Paulo', 'SP')
  returning id
)
insert into public.mindsteps_institution_invites (code, institution_id, label)
select 'MIND2026', id, 'Convite inicial' from new_institution;
```

Students can then open **Meus vínculos** and enter `MIND2026`.

## GitHub Actions release gate
`.github/workflows/android-aab.yml` must pass:
1. frontend dependency install
2. frontend TypeScript validation
3. backend dependency install
4. backend TypeScript build
5. Vite production build with ENEM enabled
6. Capacitor Android generation
7. versionCode/versionName assertion
8. Android assets + sync
9. Gradle APK/AAB build
10. AAB signing and signature verification
11. upload APK and AAB artifacts

## Play Console flow
1. Download `MindSteps-2.2.0-vc6-Android-AAB` from GitHub Actions.
2. Upload to Internal testing first.
3. Install from Google Play and smoke-test login, Today, ENEM, Writing, Meus vínculos.
4. Promote the tested release to Production.
5. Keep the permanent Google Play review credential accurate.

## Smoke test
- clean login
- create/login normal account
- Today loads
- Tutor session opens
- ENEM setup + diagnostic
- answer question and confirm map changes
- create writing version
- run short simulation
- open Semana and Caderno de Erros
- close/reopen app and confirm state persists
- login on a second surface and confirm ENEM cloud state restores
- open Meus vínculos
- validate one real invite code after creating a pilot institution

## Rollback
- Web ENEM kill switch: `VITE_ENEM_V2_ENABLED=false`
- Android rollback requires a new versionCode; do not reuse a consumed Play Console versionCode.
