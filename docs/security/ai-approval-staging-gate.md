# MindSteps — Gate de homologação de aprovações individuais de IA

Estado em 2026-11-12: **Supabase de produção ACTIVE_HEALTHY** (ref `mhyfmacqufllszkaixar`). Inspeção read-only confirmou tabelas e tipos. **Nenhuma migração foi aplicada em produção.** Branch Supabase bloqueada pelo plano (requer Pro); projeto Supabase gratuito separado bloqueado pelo limite de dois projetos ativos.

## Homologação PostgreSQL isolada

Projeto Neon `mindsteps-ai-approvals-staging` (`cool-shadow-48948005`), PostgreSQL 17, database `mindsteps_staging`, schema `mindsteps_test`. **Não é uma cópia do Supabase**: contém tabelas mínimas e usuários sintéticos, sem Auth, PostgREST ou políticas reais de produção. Não conectar frontend de produção nem copiar dados de alunos.

### Testes executados no Neon

- [x] Criadas cinco tabelas sintéticas: users, institutions, institution_members, student_approvals, approval_events.
- [x] RLS habilitado nas três tabelas de membros/aprovações/eventos (habilitação não equivale a teste de acesso com papéis).
- [x] Trigger registra eventos de aprovação e revogação na mesma transação: 2 eventos confirmados.
- [x] Tentativa de UPDATE de evento rejeitada com SQLSTATE P0001; histórico permaneceu inalterado.
- [x] Justificativa composta só de espaços rejeitada com SQLSTATE 23514.
- [x] Sistema não reconhecido rejeitado com SQLSTATE 23514.
- [x] Tentativa de INSERT com gestor de outra instituição rejeitada com SQLSTATE P0001 após trigger de escopo.
- [x] Consulta de elegibilidade mostra aprovação revogada/expirada inelegível.
- [x] DELETE do histórico rejeitado com SQLSTATE P0001; rollback forçado da auditoria ainda pendente.
- [ ] Testes de acesso com papéis sem privilégios e RLS real do Supabase.
- [x] Gestor revogado rejeitado pelo trigger de escopo e consulta de vínculo ativo; tentativas entre escolas rejeitadas.\n- [x] Professor ativo sem papel de gestão rejeitado no INSERT de aprovação no Neon (SQLSTATE P0001).\n- [x] Coordenador ativo da própria escola conseguiu registrar aprovação vigente no Neon (caso positivo).\n- [x] Aprovação ainda marcada como approved, porém expirada, retornou eligible=false; alteração gerou segundo evento de auditoria.\n- [ ] Estudante por faixa escolar, múltiplas escolas e política institucional em testes integrados.
- [ ] Integração de backend/REST/Auth com ambiente isolado Supabase; Neon não substitui esses serviços.
- [ ] CI e build da PR #5 verificados e revisados; a consulta disponível de runs retorna apenas execuções de PR, portanto ausência de resultados não comprova ausência de runs de push.

## Pré-condições antes de produção

1. Inspecionar dependências reais de `public.users`, `mindsteps_institutions`, `mindsteps_student_links` e `mindsteps_ai_school_policies`; já verificados tipos UUID e coluna role dos vínculos.
2. Aplicar **primeiro** `institution-members-staging-draft.sql`, **depois** `individual-ai-approvals-staging-draft.sql` apenas em ambiente Supabase isolado, após revisão. Ambos ainda são rascunhos.
3. Verificar que os triggers `security invoker` possuem privilégios corretos, que o serviço grava e lê, e que não há concessão pública indevida.
4. Testar ausência/expiração/revogação de autorização, gestor inativo, isolamento de escolas e feature key.
5. Validar Auth, Data API, RLS, auditoria transacional, CI, frontend e APIs; revisar rollback e segurança.

**Critério de liberação:** PR #5 permanece draft, sem merge nem deploy até a homologação integrada. O Neon valida SQL PostgreSQL de forma parcial, não o stack Supabase completo.


### Bloqueio de troca de identidade (pendente de execução)
- [x] Instalada versão equivalente do trigger de identidade em `mindsteps_test.student_approvals` no Neon (não é execução literal da migração Supabase).
- [x] UPDATE de `system_key` rejeitado com SQLSTATE P0001; a linha preservou `socratic_tutor` e a contagem de eventos permaneceu 2.\n- [x] UPDATE separado de `id`, `institution_id`, `student_user_id` e `created_at` rejeitado com SQLSTATE P0001 em todos os quatro casos.\n- [x] Consulta posterior confirmou identidade original intacta e contagem de 2 eventos de auditoria.
- [x] UPDATE legítimo de `status`, `expires_at` e `reason` aceito no Neon; decisão `revoked` registrada e eventos de auditoria passaram de 2 para 3.
- [ ] Confirmar que a migração completa é executável na ordem: membros institucionais, aprovações, triggers, grants e políticas.
