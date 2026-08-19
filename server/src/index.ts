import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import authRouter from './routers/auth.js'
import studyRouter from './routers/study.js'
import institutionLinksRouter from './routers/institutionLinks.js'
import enemStateRouter from './routers/enemState.js'

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
app.use('/api/enem', enemStateRouter)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({ message: 'Erro interno do servidor' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log('📚 MindSteps API ready!')
})
