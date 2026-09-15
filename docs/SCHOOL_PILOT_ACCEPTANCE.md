# MindSteps para Escolas — Gate do primeiro piloto

Este documento define o critério operacional para aceitar a primeira escola em piloto assistido. O objetivo é validar o circuito comercial e técnico ponta a ponta sem depender de implantação self-service.

## Cenário de referência

- 1 instituição ativa
- licença `trial` ou `active`, dentro da vigência e com seats disponíveis
- 1 owner/diretor
- 1 coordenador
- 1 professor
- 1 turma ativa
- 2 estudantes
- 1 responsável vinculado a um estudante

## Fluxo obrigatório

1. **Instituição e licença**
   - instituição criada e ativa;
   - owner ativo;
   - licença configurada;
   - `school_access`, `learning_access` e `management_access` coerentes;
   - `invite_students` disponível somente enquanto houver seat.

2. **Turma e equipe**
   - turma criada;
   - professor convidado e aceito pelo mesmo e-mail autenticado;
   - professor vinculado à turma;
   - vínculo sem disciplina não pode duplicar;
   - coordenador consegue operar onboarding sem poder promover admin/owner indevidamente.

3. **Estudantes**
   - provisioning valida lote antes da execução;
   - aluno recebe contexto de turma, série, ano e external ID;
   - aceite cria/reativa matrícula;
   - perfil recebe nome/série quando informados;
   - seat é consumido por matrícula ativa;
   - novo aluno é bloqueado quando a capacidade for atingida.

4. **Responsável**
   - convite preserva `studentEmail` e relacionamento;
   - responsável não ativa vínculo antes de o estudante estar ativo;
   - após aceite, vê somente estudantes com guardian link ativo;
   - métricas pedagógicas permanecem ocultas sem consentimento de compartilhamento;
   - com consentimento, resumo de independência é apresentado como tendência, nunca diagnóstico.

5. **Isolamento pedagógico**
   - owner/admin/coordenador acessam alunos vinculados à instituição conforme papel;
   - professor lista somente estudantes das próprias turmas;
   - professor não acessa autonomia de estudante fora de seu teaching scope;
   - professor não cria convite institucional genérico de estudante;
   - nenhuma consulta escolar pode atravessar `institution_id`.

6. **Direção e operação**
   - dashboard retorna students, activity, staff, teachers, guardian coverage, seats e alertas;
   - readiness identifica ausência de licença, turma, staff, teaching scope e estudantes;
   - staff roster mostra e-mail e escopo de ensino;
   - turmas com alunos/professores ativos não podem ser arquivadas;
   - mudanças críticas geram audit log.

7. **Convites**
   - token é armazenado somente como hash;
   - aceite exige e-mail autenticado correspondente;
   - convite expirado não é aceito;
   - resend revoga o anterior e preserva metadata de provisioning;
   - aceite só muda `pending -> accepted` após o vínculo de domínio ter sido criado.

## Gate técnico antes do piloto

- `Validate MindSteps Release` verde, incluindo frontend TypeScript e backend TypeScript.
- Migração `20260915_school_invites_v2.sql` aplicada no Supabase de produção antes de usar provisioning V2.
- Render com `SUPABASE_SERVICE_KEY` configurada antes de endurecer grants/RLS de `public.users`.
- Não executar migração destrutiva de segurança em `public.users` sem validar o service role no Render.

## Critério GO

O piloto assistido pode começar quando os sete blocos acima estiverem validados e não houver falha P0/P1 no circuito instituição → licença → turma → professor → estudante → responsável → consentimento → dashboard.

Itens como billing automatizado, onboarding 100% self-service, white-label avançado, PDF executivo e integrações SIS/LMS não bloqueiam o primeiro piloto assistido.
