# MindSteps - TutorIA

**Plataforma educacional com método socrático via IA**
*Aqui, aprender é pensar!*

---

## 🚀 Quick Start

### 1. Configurar o Banco de Dados (Supabase)

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute o conteúdo de `supabase_schema.sql`
4. Copie as credenciais do projeto (Settings > API)

### 2. Configurar o Backend

```bash
cd server

# Copiar variáveis de ambiente
cp .env.example .env

# Editar .env com suas credenciais:
# SUPABASE_URL=https://seu-projeto.supabase.co
# SUPABASE_SERVICE_KEY=sua-chave
# OPENAI_API_KEY=sua-chave-openai
# JWT_SECRET=uma-senha-secreta

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

### 3. Configurar o Frontend

```bash
cd client

# Criar arquivo de ambiente
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

### 4. Abrir no Navegador

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## 📁 Estrutura do Projeto

```
mindsteps/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas (routes)
│   │   ├── stores/        # Zustand (estado global)
│   │   └── lib/           # Utils e API client
│   └── index.html
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── routers/       # Rotas da API
│   │   ├── services/      # Lógica de negócio (IA)
│   │   └── db/            # Conexão com Supabase
│   └── package.json
└── SPEC.md                # Especificação do projeto
```

---

## 🎯 Funcionalidades

- [x] **Chat Socrático** - Conversa com IA que usa perguntas para guiar o aprendizado
- [x] **Sistema de Personas** - 5 tutores diferentes (Clássico, Scientist, Time Traveler, Detective, Storyteller)
- [x] **Gamificação** - XP, níveis, streaks
- [x] **Pets Virtuais** - Companheiros de estudo
- [x] **Onboarding** - Cadastro simplificado em 4 passos
- [x] **Rate Limiting** - 5 mensagens/dia (free tier)
- [x] **OpenAI Integration** - GPT-4o-mini para respostas otimizadas

---

## 🔧 Tecnologias

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- React Router v6

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL)
- OpenAI API
- JWT Authentication
- bcrypt

---

## 🌐 Deploy

### Frontend (Vercel)

```bash
cd client
npx vercel
```

### Backend (Railway)

1. Conecte seu repositório GitHub ao Railway
2. Configure as variáveis de ambiente
3. Deploy automático!

### Supabase

- Já está na nuvem (supabase.com)
- Apenas configure as credenciais

---

## 📝 Variáveis de Ambiente

### Backend (.env)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-super-secret-key
OPENAI_API_KEY=sk-your-openai-key
PORT=3001
```

### Frontend (.env)

```env
VITE_API_URL=/api  # Para produção, URL do backend
```

---

## 🧪 Testar Localmente

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

Acesse http://localhost:5173 e teste o chat!

---

## 📄 Licença

MIT © 2024 MindSteps