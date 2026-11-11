# MindSteps — Gate de homologação de aprovações individuais de IA

Estado em 2026-11-11: o projeto Supabase `mindsteps.org` (ref `mhyfmacqufllszkaixar`) foi listado como INACTIVE. Uma consulta de leitura ao `information_schema.columns` falhou com `Database is possibly not accessible at the moment`. **Nenhum SQL foi aplicado.**

## Pré-condições antes de executar SQL

1. Confirmar que o projeto escolhido é ambiente isolado de homologação, não produção. Não restaurar nem alterar o projeto inativo sem decisão explícita sobre custos/ambiente.
2. Consultar tipos e colunas reais de `mindsteps_student_links`, `mindsteps_ai_school_policies`, `mindsteps_institution_members`, `student_profiles`. Confirmar que `role='student'` é um filtro válido e que `prohibited_uses` existe.
3. Confirmar chaves UUID, restrições, permissões Data API, extensões e RLS. O arquivo `individual-ai-approvals-staging-draft.sql` **não é migração pronta para produção**.
4. Testar com contas sintéticas: gestor ativo; professor sem papel de gestão; aluno de 5º ano; aluno de 6º–9º; aluno do ensino médio; gestor revogado; vínculos escolares expirados.
5. Verificar: ausência de política institucional bloqueia; política ativa sem mediação bloqueia; aprovação ausente/expirada/revogada bloqueia; aprovação válida de gestor ativo só libera a funcionalidade autorizada.
6. Verificar inserção do evento na mesma transação, rollback quando auditoria falhar, impossibilidade de UPDATE/DELETE do histórico e isolamento entre instituições.
7. Executar advisors de segurança/performance, validar CI e homologar frontend+API com credenciais de teste antes de qualquer merge ou deploy.

## Critérios de saída

- [ ] Banco de homologação identificado e ativo
- [ ] Schema existente inspecionado
- [ ] SQL adaptado aos tipos reais
- [ ] RLS e permissões testadas
- [ ] Auditoria transacional testada
- [ ] Fluxos positivos e negativos testados
- [ ] CI e revisão de segurança aprovados
- [ ] Plano de rollback e liberação controlada revisados

**Até concluir os itens acima, manter a PR #5 em draft e produção intocada.**
