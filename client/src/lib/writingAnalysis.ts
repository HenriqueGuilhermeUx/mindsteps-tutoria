import type { WritingSkill, WritingVersion } from '@/stores/writing'

export interface VersionInsight { type: 'improved' | 'attention' | 'changed'; title: string; detail: string }
export interface WritingSignals { words: number; paragraphs: number; diversity: number; avgSentence: number; scores: Record<WritingSkill, number> }

const sentences = (text: string) => text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
const paragraphs = (text: string) => text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
const words = (text: string) => text.trim().toLowerCase().split(/\s+/).filter(Boolean)
const uniqueRatio = (text: string) => { const w = words(text); return w.length ? new Set(w).size / w.length : 0 }
const connectors = ['portanto','porém','além disso','nesse sentido','assim','desse modo','todavia','entretanto','logo','consequentemente','porque','visto que','uma vez que']
const repertoireSignals = ['segundo','conforme','constituição','onu','ibge','unesco','filósofo','sociólogo','obra','livro','filme','dados','pesquisa','história','artigo']
const interventionSignals = ['governo','estado','escola','sociedade','mídia','instituição','ministério','prefeitura','projeto','política pública','deve','devem','por meio de','a fim de','com o objetivo de']

function countSignals(text: string, list: string[]) { const normalized = text.toLowerCase(); return list.reduce((sum, term) => sum + (normalized.includes(term) ? 1 : 0), 0) }

export const writingSkillLabels: Record<WritingSkill, string> = { tese:'Tese', argumentacao:'Argumentação', repertorio:'Repertório', coesao:'Coesão', intervencao:'Intervenção', clareza:'Clareza' }

export function analyzeWriting(text: string): WritingSignals {
  const tokenList = words(text)
  const unique = new Set(tokenList.map(w => w.replace(/[^a-záàâãéèêíïóôõöúçñ]/gi,'')).filter(Boolean))
  const sent = sentences(text); const pars = paragraphs(text)
  const connectorCount = countSignals(text, connectors); const repertoireCount = countSignals(text, repertoireSignals); const interventionCount = countSignals(text, interventionSignals)
  const avgSentence = sent.length ? Math.round(tokenList.length / sent.length) : 0
  const diversity = tokenList.length ? Math.round((unique.size / tokenList.length) * 100) : 0
  const scores: Record<WritingSkill, number> = {
    tese: Math.min(100, 40 + (pars.length >= 3 ? 25 : 5) + (tokenList.length >= 180 ? 20 : 5)),
    argumentacao: Math.min(100, 30 + pars.length * 10 + connectorCount * 7),
    repertorio: Math.min(100, 25 + repertoireCount * 22),
    coesao: Math.min(100, 30 + connectorCount * 9 + (pars.length >= 4 ? 18 : 5)),
    intervencao: Math.min(100, 25 + interventionCount * 18 + (text.toLowerCase().includes('para') ? 8 : 0)),
    clareza: Math.max(25, Math.min(100, 90 - Math.max(0, avgSentence - 24) * 2 + Math.min(15, Math.round(diversity / 6)))),
  }
  return { words: tokenList.length, paragraphs: pars.length, diversity, avgSentence, scores }
}

export function scoreDelta(before: string, after: string, skill: WritingSkill) { return analyzeWriting(after).scores[skill] - analyzeWriting(before).scores[skill] }

export function compareWritingVersions(previous: WritingVersion, current: WritingVersion): VersionInsight[] {
  const a = previous.text, b = current.text, insights: VersionInsight[] = []
  const wordDelta = current.wordCount - previous.wordCount, paragraphDelta = paragraphs(b).length - paragraphs(a).length, sentenceDelta = sentences(b).length - sentences(a).length
  const connectorDelta = countSignals(b, connectors) - countSignals(a, connectors), repertoireDelta = countSignals(b, repertoireSignals) - countSignals(a, repertoireSignals), interventionDelta = countSignals(b, interventionSignals) - countSignals(a, interventionSignals), lexicalDelta = uniqueRatio(b) - uniqueRatio(a)
  if (wordDelta >= 20) insights.push({ type:'changed', title:'Você desenvolveu mais as ideias', detail:`A nova versão ganhou ${wordDelta} palavras. Agora vale conferir se cada trecho acrescenta argumento, explicação ou evidência.` })
  if (wordDelta <= -20) insights.push({ type:'changed', title:'Seu texto ficou mais enxuto', detail:`Você retirou ${Math.abs(wordDelta)} palavras. Isso pode aumentar a clareza quando as ideias principais continuam completas.` })
  if (paragraphDelta > 0) insights.push({ type:'improved', title:'A organização ficou mais visível', detail:'Você separou melhor as ideias em parágrafos. Agora confira se cada parágrafo tem uma função clara.' })
  if (sentenceDelta > 1 && wordDelta > 0) insights.push({ type:'improved', title:'O desenvolvimento ganhou etapas', detail:'Há mais frases articulando seu raciocínio. Isso costuma ajudar quando cada frase avança a ideia anterior.' })
  if (connectorDelta > 0) insights.push({ type:'improved', title:'Você conectou melhor o raciocínio', detail:'A nova versão usa mais marcas de relação entre ideias. Verifique se os conectivos realmente expressam a relação desejada.' })
  if (repertoireDelta > 0) insights.push({ type:'improved', title:'Entrou mais repertório', detail:'Você adicionou sinais de repertório. O próximo passo é garantir que ele ajude a provar o argumento.' })
  if (interventionDelta > 0) insights.push({ type:'improved', title:'A intervenção ficou mais concreta', detail:'A versão mais recente apresenta mais elementos de ação, agente ou finalidade.' })
  if (lexicalDelta > 0.03) insights.push({ type:'improved', title:'Seu vocabulário ficou mais variado', detail:'A repetição relativa de palavras caiu. Preserve naturalidade e precisão.' })
  if (paragraphs(b).length <= 1 && current.wordCount > 180) insights.push({ type:'attention', title:'Seu texto está muito concentrado', detail:'Há bastante conteúdo em poucos blocos. Separar funções pode ajudar o leitor a acompanhar o raciocínio.' })
  if (countSignals(b, connectors) === 0 && current.wordCount > 120) insights.push({ type:'attention', title:'As relações entre ideias podem ficar mais explícitas', detail:'Experimente marcar causa, contraste, consequência e conclusão quando fizer sentido.' })
  if (!insights.length) insights.push({ type:'changed', title:'A versão mudou de forma sutil', detail:'Compare os trechos alterados e pergunte: minha tese ficou mais precisa? meu argumento ficou mais convincente?' })
  return insights.slice(0,6)
}
