# MindSteps — Gate pós-primeira liberação no Google Play

## Estado atual

O MindSteps ENEM / Redação V2 permanece **desabilitado por padrão** em site e app.

A liberação depende de `VITE_ENEM_V2_ENABLED=true`.

Sem essa variável, todas as rotas `/enem/*` redirecionam para a experiência pública/atual e o destaque ENEM não aparece na home do estudante.

## Regra de lançamento

Não habilitar `VITE_ENEM_V2_ENABLED` antes de a primeira versão do MindSteps estar aprovada e disponível no Google Play.

## Validação antes da liberação

1. Workflow `Validate MindSteps Release` verde.
2. TypeScript sem erros.
3. Build com `VITE_ENEM_V2_ENABLED=false` concluído.
4. Build com `VITE_ENEM_V2_ENABLED=true` concluído.
5. Pacote Android confirmado: `br.com.alternativeventures.mindsteps`.
6. Política de Privacidade publicada e acessível.
7. Exclusão de conta publicada e acessível.
8. Exclusão de dados publicada e acessível.
9. Login e onboarding testados em Android real.
10. Home, Tutor, Mapa, Missões e Perfil testados.
11. ENEM V2 testado em ambiente controlado com a flag habilitada.
12. Redação: criar projeto, salvar V1, Coach, treino, V2, comparar e DNA testados.
13. Nenhuma credencial, token ou dado pessoal de teste exposto no bundle/repositório.

## Como liberar no site depois da aprovação do Google Play

No ambiente de produção do Netlify:

`VITE_ENEM_V2_ENABLED=true`

Depois realizar novo deploy e testar `/enem` e `/enem/redacao` autenticado.

## Como liberar no app depois da aprovação do Google Play

Gerar a próxima versão Android com:

`VITE_ENEM_V2_ENABLED=true`

O primeiro AAB aprovado não deve ser alterado retroativamente. A liberação do ENEM V2 entra em uma atualização posterior, usando o mesmo package id e um `versionCode` superior.

## Rollback

Se houver qualquer problema após a liberação web, definir novamente:

`VITE_ENEM_V2_ENABLED=false`

No Android, publicar correção com a flag desabilitada e `versionCode` superior.

## Princípio

Desenvolver agora, validar agora, expor somente quando a primeira presença oficial do MindSteps no Google Play estiver estável.
