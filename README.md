# MindSteps TutorIA

Plataforma de tutoria com método socrático usando IA para crianças.

## Stack Técnica

- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini

## Configuração

### 1. Variáveis de Ambiente

**Frontend (`client/.env`)**
```
VITE_API_URL=https://seu-backend.railway.app
```

**Backend (`server/.env`)**
```
PORT=3000
SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_KEY=sua_chave_de_servico
SUPABASE_ANON_KEY=sua_chave_anonima
JWT_SECRET=seu_segredo_jwt
OPENAI_API_KEY=sua_chave_openai
```

### 2. Supabase Setup

Execute o SQL em `supabase_schema.sql` no painel do Supabase para criar as tabelas:
- `users`
- `student_profiles`
- `study_sessions`
- `chat_messages`
- `daily_usage`

### 3. Deploy

**Frontend (Netlify)**
1. Conecte o repositório GitHub ao Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

**Backend (Railway)**
1. Conecte o repositório GitHub ao Railway
2. Adicione as variáveis de ambiente
3. Railway detectará automaticamente o Node.js

## Funcionalidades

- Autenticação JWT
- Tutor IA com método socrático
- Sistema de XP e níveis
- Mascotes virtuais
- Gamificação (streaks, conquistas)
- Interface responsiva para crianças

## Desenvolvimento

```bash
# Install dependencies
cd client && npm install -g
cd server && npm install -g

# Run frontend
cd client && npm run dev

# Run backend
cd server && npm run dev
```
