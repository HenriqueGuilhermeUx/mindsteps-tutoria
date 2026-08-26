import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import authRouter from './routers/auth.js'
import studyRouter from './routers/study.js'
import institutionLinksRouter from './routers/institutionLinks.js'
import institutionAdminRouter from './routers/institutionAdmin.js'
import enemStateRouter from './routers/enemState.js'
import responsibleAIRouter from './routers/responsibleAI.js'
import learningSafetyRouter from './routers/learningSafety.js'
import learningGovernanceRouter from './routers/learningGovernance.js'
import learningOSRouter from './routers/learningOS.js'
import schoolGovernanceRouter from './routers/schoolGovernance.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api', studyRouter)
app.use('/api/institutions', institutionLinksRouter)
app.use('/api/institutions', institutionAdminRouter)
app.use('/api/enem', enemStateRouter)
app.use('/api/responsible-ai', responsibleAIRouter)
app.use('/api/learning-safety', learningSafetyRouter)
app.use('/api/learning-governance', learningGovernanceRouter)
app.use('/api/learning-os', learningOSRouter)
app.use('/api/school-governance', schoolGovernanceRouter)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({ message: 'Erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log('📚 MindSteps API ready!')
})
