import OpenAI from 'openai'
const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY})

export async function generateIndependentChallenge(input:{subject:string;skill?:string;ageGroup?:string;context?:string}){
 const prompt=`Crie UM check curto de transferência para um estudante brasileiro. Matéria: ${input.subject}. Habilidade/contexto: ${input.skill||input.context||'conteúdo estudado recentemente'}. Faixa etária: ${input.ageGroup||'não informada'}. O aluno fará SEM pistas, sem resposta pronta e sem consulta. Não copie uma pergunta anterior. Retorne JSON com question, rubric (3 critérios curtos) e expectedMinutes. Não inclua resposta correta.`
 const r=await openai.chat.completions.create({model:'gpt-4o-mini',temperature:.5,max_tokens:350,response_format:{type:'json_object'},messages:[{role:'system',content:'Você cria avaliações formativas curtas, claras, adequadas à idade e sem pegadinhas.'},{role:'user',content:prompt}]})
 const parsed=JSON.parse(r.choices[0]?.message?.content||'{}')
 return {question:String(parsed.question||'Explique com suas palavras o que você aprendeu e dê um exemplo novo.'),rubric:Array.isArray(parsed.rubric)?parsed.rubric.slice(0,3).map(String):['compreensão','aplicação','clareza'],expectedMinutes:Math.max(2,Math.min(15,Number(parsed.expectedMinutes)||5))}
}

export async function evaluateIndependentAnswer(input:{question:string;answer:string;subject:string;skill?:string;rubric?:string[]}){
 const prompt=`Avalie uma resposta de estudante SEM ajuda. Questão: ${input.question}\nResposta: ${input.answer}\nMatéria: ${input.subject}\nHabilidade: ${input.skill||''}\nRubrica: ${(input.rubric||[]).join('; ')}. Retorne SOMENTE JSON com score de 0 a 100, feedback em até 2 frases, evidence em até 3 itens e passed boolean. Não premie texto longo; premie compreensão e transferência.`
 const r=await openai.chat.completions.create({model:'gpt-4o-mini',temperature:.2,max_tokens:350,response_format:{type:'json_object'},messages:[{role:'system',content:'Você é um avaliador formativo. Seja criterioso, pedagógico e não invente evidências.'},{role:'user',content:prompt}]})
 const parsed=JSON.parse(r.choices[0]?.message?.content||'{}');const score=Math.max(0,Math.min(100,Number(parsed.score)||0))
 return {score:Math.round(score),feedback:String(parsed.feedback||'Resposta registrada para acompanhar sua autonomia.'),evidence:Array.isArray(parsed.evidence)?parsed.evidence.slice(0,3).map(String):[],passed:typeof parsed.passed==='boolean'?parsed.passed:score>=60}
}
