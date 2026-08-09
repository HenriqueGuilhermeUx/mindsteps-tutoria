import type { WritingVersion } from '@/stores/writing'

export interface VersionInsight {
  type: 'improved' | 'attention' | 'changed'
  title: string
  detail: string
}

const sentences = (text: string) => text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
const paragraphs = (text: string) => text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
const words = (text: string) => text.trim().toLowerCase().split(/\s+/).filter(Boolean)
const uniqueRatio = (text: string) => { const w = words(text); return w.length ? new Set(w).size / w.length : 0 }
const connectors = ['portanto','porém','além disso','nesse sentido','assim','desse modo','todavia','entretanto','logo','consequentemente','porque','visto que','uma vez que']
const repertoireSignals = ['segundo','conforme','constituição','onu','ibge','filósofo','sociólogo','obra','livro','filme','dados','pesquisa','história','artigo']
const interventionSignals = ['governo','estado','escola','sociedade','mídia','deve','devem','por meio de','a fim de','com o objetivo de','através de']

function countSignals(text: string, list: string[]) {
  const normalized = text.toLowerCase()
  return list.reduce((sum, term) => sum + (normalized.includes(term) ? 1 : 0), 0)
}

export function compareWritingVersions(previous: WritingVersion, current: WritingVersion): VersionInsight[] {
  const a = previous.text
  const b = current.text
  const insights: VersionInsight[] = []
  const wordDelta = current.wordCount - previous.wordCount
  const paragraphDelta = paragraphs(b).length - paragraphs(a).length
  const sentenceDelta = sentences(b).length - sentences(a).length
  const connectorDelta = countSignals(b, connectors) - countSignals(a, connectors)
  const repertoireDelta = countSignals(b, repertoireSignals) - countSignals(a, repertoireSignals)
  const interventionDelta = countSignals(b, interventionSignals) - countSignals(a, interventionSignals)
  const lexicalDelta = uniqueRatio(b) - uniqueRatio(a)

  if (wordDelta >= 20) insights.push({ type: 'changed', title: 'Você desenvolveu mais as ideias', detail: `A nova versão ganhou ${wordDelta} palavras. Agora vale conferir se cada trecho acrescenta argumento, explicação ou evidência.` })
  if (wordDelta <= -20) insights.push({ type: 'changed', title: 'Seu texto ficou mais enxuto', detail: `Você retirou ${Math.abs(wordDelta)} palavras. Isso pode aumentar a clareza quando as ideias principais continuam completas.` })
  if (paragraphDelta > 0) insights.push({ type: 'improved', title: 'A organização ficou mais visível', detail: 'Você separou melhor as ideias em parágrafos. Agora confira se cada parágrafo tem uma função clara.' })
  if (sentenceDelta > 1 && wordDelta > 0) insights.push({ type: 'improved', title: 'O desenvolvimento ganhou etapas', detail: 'Há mais frases articulando seu raciocínio. Isso costuma ajudar quando cada frase avança a ideia anterior.' })
  if (connectorDelta > 0) insights.push({ type: 'improved', title: 'Você conectou melhor o raciocínio', detail: 'A nova versão usa mais marcas de relação entre ideias. Verifique se os conectivos realmente expressam a relação desejada.' })
  if (repertoireDelta > 0) insights.push({ type: 'improved', title: 'Entrou mais repertório', detail: 'Você adicionou sinais de repertório. O próximo passo é garantir que ele ajude a provar o argumento, e não apareça apenas como citação.' })
  if (interventionDelta > 0) insights.push({ type: 'improved', title: 'A intervenção ficou mais concreta', detail: 'A versão mais recente apresenta mais elementos de ação, agente ou finalidade. Tente deixar explícitos quem faz, o que faz, como e para quê.' })
  if (lexicalDelta > 0.03) insights.push({ type: 'improved', title: 'Seu vocabulário ficou mais variado', detail: 'A repetição relativa de palavras caiu. Preserve naturalidade: variedade é útil quando melhora a precisão.' })
  if (paragraphs(b).length <= 1 && current.wordCount > 180) insights.push({ type: 'attention', title: 'Seu texto está muito concentrado', detail: 'Há bastante conteúdo em poucos blocos. Separar funções — introdução, desenvolvimento e conclusão — pode ajudar o leitor a acompanhar o raciocínio.' })
  if (countSignals(b, connectors) === 0 && current.wordCount > 120) insights.push({ type: 'attention', title: 'As relações entre ideias podem ficar mais explícitas', detail: 'O texto está crescendo, mas quase não aparecem conectores. Experimente marcar causa, contraste, consequência e conclusão quando fizer sentido.' })

  if (!insights.length) insights.push({ type: 'changed', title: 'A versão mudou de forma sutil', detail: 'As métricas estruturais ficaram parecidas. Compare os trechos alterados e pergunte: minha tese ficou mais precisa? meu argumento ficou mais convincente?' })
  return insights.slice(0, 6)
}
