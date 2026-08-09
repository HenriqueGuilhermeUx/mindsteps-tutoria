# MindSteps V2 — Release Candidate

## Status

Versão do app: `2.0.0-rc.1`

Package Android: `br.com.alternativeventures.mindsteps`

Produto: MindSteps + módulo MindSteps ENEM (aditivo, não substitui o core geral).

## O que está fechado no app

- Experiência mobile-first com shell próprio de aplicativo.
- Home do estudante com missão diária e destaque do MindSteps ENEM.
- Hub ENEM.
- Laboratório de Redação ENEM.
- Estúdio de escrita com histórico V1/V2/V3.
- Coach adaptativo de escrita.
- Microtreinos de tese, argumentação, repertório, clareza/parágrafo, perspectiva e intervenção.
- Motor de temas.
- Repertório Vivo.
- Comparação entre versões.
- DNA da Escrita baseado em textos reais.
- Registro de intervenção por habilidade e versão de origem.
- Medição de efeito antes/depois e histórico de estratégias pedagógicas.
- Persistência local offline-first.
- Tentativa de sincronização remota sem risco de perda do dado local.

## Backend preparado

Contrato cliente já previsto para:

- `GET /api/writing/projects`
- `POST /api/writing/projects/sync`
- `DELETE /api/writing/projects/:clientId`
- `GET /api/writing/effects`

Migration Supabase preparada para projetos, versões, treinos e efeitos de intervenção.

O app não depende destes endpoints para preservar o trabalho do aluno: enquanto a sincronização remota não estiver disponível, o histórico permanece local no dispositivo.

## Gate antes de produção Google Play

1. Rodar `npm run typecheck` e `npm run build` no client.
2. Gerar APK e AAB a partir do mesmo commit.
3. Instalar APK limpo em Android real.
4. Criar/validar conta permanente de avaliação da Google Play.
5. Testar cadastro, login, onboarding, Hoje, Tutor, ENEM, Redação, Coach, DNA, Missões, Mapa e Perfil.
6. Tirar screenshots exclusivamente do APK final instalado.
7. Confirmar que ícone, splash, screenshots e descrição correspondem ao AAB enviado.
8. Validar URLs públicas de Política de Privacidade, Exclusão de Conta e Exclusão de Dados em janela anônima.
9. Confirmar declaração de Famílias e Segurança dos Dados com base no comportamento efetivo da versão publicada.
10. Só então promover `2.0.0-rc.1` para release de produção.

## Princípio do módulo de redação

A IA não deve escrever pelo estudante. Deve ajudá-lo a pensar, estruturar, testar, escrever, revisar, reescrever e reconhecer a própria evolução.

O objetivo longitudinal é aprender não apenas **o que o estudante precisa desenvolver**, mas **quais intervenções pedagógicas funcionam melhor para ele**.
