# MindSteps - TutorIA
**Plataforma educacional com método socrático via IA**

---

## 1. Concept & Vision

**MindSteps** é uma plataforma onde crianças e adolescentes aprendem Pensando, não apenas Memorizando. O **Tutor Socrático** é o protagonista - uma IA que conversa com o aluno através de perguntas inteligentes, guiando-o a descobrir respostas por conta própria.

**Slogan:** "Aqui, aprender é pensar!"

**Tom:** Acolhedor, curioso, игривый (brincalhão), mas sempre educacional. Como um amigo mais velho que adora fazer perguntas.

---

## 2. Design Language

### Aesthetic Direction
Inspirado em apps de mensagem modernos (Telegram, Discord) com toques de gamificação sutil. Interface limpa que coloca o chat em destaque absoluto.

### Color Palette
```
Primary:      #6366F1 (Indigo - inteligência, confiança)
Secondary:    #8B5CF6 (Purple - criatividade, curiosidade)
Accent:       #F59E0B (Amber - conquistas, XP, energia)
Success:      #10B981 (Emerald - progresso)
Background:   #F8FAFC (Slate 50 - leve, limpo)
Surface:      #FFFFFF (Cards, inputs)
Text Primary: #1E293B (Slate 800)
Text Muted:   #64748B (Slate 500)
```

### Typography
- **Headings:** Inter (700) - moderna, legível
- **Body:** Inter (400, 500) - excelente para telas
- **Fallback:** system-ui, sans-serif

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64
- Border radius: 8px (cards), 12px (buttons), 9999px (avatars)
- Max content width: 1200px

### Motion Philosophy
- Micro-interações suaves (150-300ms)
- Transições de página: fade + slide (200ms ease-out)
- Feedback de envio de mensagem: bounce sutil
- Confetti em conquistas (celebração)

### Visual Assets
- **Icons:** Lucide React (consistente, leve)
- **Emojis:** Nativos do sistema (autenticidade)
- **Ilustrações:** none (foco no chat)

---

## 3. Layout & Structure

### Páginas

#### 1. Landing Page (/)
```
┌─────────────────────────────────────────┐
│  Header: Logo + Login/Cadastro          │
├─────────────────────────────────────────┤
│  Hero: "Aqui, aprender é pensar!"       │
│  Subtítulo sobre método socrático       │
│  CTA: "Começar a Aprender"              │
├─────────────────────────────────────────┤
│  Como Funciona (3 passos)                │
│  1. Escolha um tema                     │
│  2. Converse com seu Tutor              │
│  3. Pense e descubra                    │
├─────────────────────────────────────────┤
│  Demo do Chat (mockup visual)           │
├─────────────────────────────────────────┤
│  Footer: Sobre, FAQ, Privacidade        │
└─────────────────────────────────────────┘
```

#### 2. Cadastro/Login (/auth)
- Formulário simples: email + senha
- Toggle entre Login e Cadastro
- Validação inline
- feedback de erro amigável

#### 3. Onboarding (/onboarding)
```
┌─────────────────────────────────────────┐
│  Progress bar (4 passos)                │
├─────────────────────────────────────────┤
│  Passo 1: Qual seu nome?               │
│  Passo 2: Quantos anos você tem?         │
│  Passo 3: Qual seu nível escolar?       │
│ Passo 4: Escolha seu Tutor (5 personas) │
└─────────────────────────────────────────┘
```

#### 4. Chat Principal (/chat)
```
┌─────────────────────────────────────────┐
│  Header: Tutor + Nível/XP + Streak      │
├─────────────────────────────────────────┤
│                                         │
│  Área do Chat                           │
│  - Mensagens do Tutor (bola branca)     │
│  - Mensagens do Aluno (bola roxa)       │
│  - Sugestões de temas                   │
│  - Botão Quiz (aparece após explicações)│
│                                         │
├─────────────────────────────────────────┤
│  Input: Texto + Botão Enviar + Voz      │
└─────────────────────────────────────────┘
```

#### 5. Perfil (/perfil)
```
┌─────────────────────────────────────────┐
│  Avatar + Nome + Nível                  │
│  Barra de XP (progresso)                │
│  Streak (dias consecutivos)             │
├─────────────────────────────────────────┤
│  Meus Pets (cards)                      │
│  Minhas Conquistas (badges)             │
│  Escolher Tutor                         │
├─────────────────────────────────────────┤
│  Configurações (logout)                 │
└─────────────────────────────────────────┘
```

---

## 4. Features & Interactions

### 4.1 Chat Socrático (CORE)

**Fluxo Principal:**
1. Aluno digita mensagem ou fala (voz → texto)
2. Sistema verifica rate limit (5 msgs/dia free)
3. Mensagem enviada ao backend
4. Backend chama OpenAI com prompt socrático
5. Resposta exibida no chat
6. XP concedido (+10 por mensagem)
7. Detecção de sinais de frustração → oferecer ajuda

**Prompt do Tutor (核心 do projeto):**
```
Você é um tutor educacional SUPER CURIOSO e INVESTIGATIVO
que usa o método socrático EQUILIBRADO.

REGRAS:
1. Faça perguntas sobre interesses do aluno
2. Conecte conceitos com hobbies (Minecraft, futebol, etc)
3. Use linguagem jovem e emojis estratégicos
4. Alterne perguntas com mini-explicações
5. Ensine conceitos base primeiro
6. Segurança: recuse conteúdo inadequado
7. Detectar frustração → dar exemplo concreto

TOM: amigável, acolhedor, curioso
```

**Escolha de Modelo IA:**
- Perguntas simples → GPT-4o-mini (barato)
- Perguntas complexas → GPT-4o (mais capaz)

### 4.2 Sistema de Personas/Tutores

| Persona | Emoji | Descrição | Melhor para |
|---------|-------|-----------|-------------|
| Tutor Clássico | 🎓 | Guia investigativo padrão | Todas as matérias |
| Cientista Maluco | 🧪 | Experimentos e descobertas | Ciências, Física |
| Viajante do Tempo | ⏰ | História como aventura | História, Geografia |
| Detetive Lógico | 🔍 | Mistérios a resolver | Matemática, Lógica |
| Contador de Histórias | 📖 | Narrativas mágicas | Português, Literatura |

### 4.3 Gamificação

**XP (Experiência):**
- +10 XP por mensagem enviada
- +50 XP ao completar quiz
- +100 XP ao atingir streak de 7 dias

**Níveis:**
```
1-100 XP:    Nível 1 - Curioso
100-300 XP:  Nível 2 - Investigador
300-600 XP:  Nível 3 - Explorador
600-1000 XP: Nível 4 - Descobridor
1000-1500:   Nível 5 - Pensador
... (escalando)
```

**Streak:**
- Contador de dias consecutivos estudiando
- Reset às 20h se não estudar
- Visual: 🔥 5 dias

### 4.4 Pets Virtuais

**Sistema:**
- Pet acompanha o aluno no chat
- Ganha XP com o aluno (1 XP pet = 10 XP aluno)
- Evolui: Ovo → Filhote → Adolescent → Adulto → Lendário

**Tipos:**
- 🐉 Dragão (fogo, paixão)
- 🐱 Gato (curiosidade, independência)
- 🤖 Robô (lógica, tecnologia)
- 🦄 Unicórnio (criatividade, imaginação)
- 🔥 Fênix (ressurreição, persistência)

### 4.5 Quiz IA

**Trigger:** Após IA explicar um conceito (mensagem > 200 chars)

**Fluxo:**
1. Botão "🎮 Quiz Rápido" aparece
2. IA gera 3 perguntas sobre o tema
3. Aluno responde (timer 30s por pergunta)
4. Resultado: acertos + XP奖励

### 4.6 Rate Limiting (Free Tier)

**Limites:**
- 5 mensagens/dia (Free)
- Reset às 00:00 UTC
- Indicador visual: "3/5 mensagens restantes"

**Ao atingir limite:**
- "Você atingiu seu limite diário! Volte amanhã para mais aprendizado. 🌟"

---

## 5. Component Inventory

### Button
- **Primary:** bg-indigo-600, text-white, hover:bg-indigo-700
- **Secondary:** bg-slate-100, text-slate-700, hover:bg-slate-200
- **Ghost:** transparent, hover:bg-slate-100
- **States:** loading (spinner), disabled (opacity-50)

### Input
- border-slate-200, focus:ring-indigo-500
- Error: border-red-500, text-red-600
- Success: border-emerald-500

### Card
- bg-white, shadow-sm, rounded-xl
- Padding: 24px

### MessageBubble
- **User:** bg-indigo-600, text-white, rounded-2xl (destro)
- **Assistant:** bg-slate-100, text-slate-800, rounded-2xl (sinistro)
- **System:** italic, text-slate-500, centered

### Avatar
- Circular, border-2 border-indigo-200
- Sizes: sm (32px), md (48px), lg (64px)

### Badge
- Pill shape, bg-amber-100, text-amber-700
- XP badge, level badge, streak badge

### Modal
- Backdrop blur, centered, scale animation
- Close on escape/backdrop click

### Toast
- Position: bottom-center
- Types: success (green), error (red), info (blue)

---

## 6. Technical Approach

### Stack
- **Frontend:** React 18 + Vite + TypeScript + TailwindCSS
- **Routing:** React Router v6
- **State:** Zustand (leve, simples)
- **Backend:** Node.js + Express + tRPC
- **Database:** Supabase (PostgreSQL compat)
- **ORM:** Drizzle ORM
- **Auth:** JWT simples (email + senha)
- **IA:** OpenAI API (GPT-4o-mini default)

### Estrutura de Pastas
```
mindsteps/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas (routes)
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utils, API client
│   │   ├── stores/        # Zustand stores
│   │   └── App.tsx
│   └── index.html
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routers/       # tRPC routers
│   │   ├── services/      # Lógica de negócio
│   │   ├── db/           # Schema Drizzle
│   │   └── index.ts      # Entry point
│   └── package.json
└── package.json            # Root workspace
```

### API Endpoints (tRPC)

**auth:**
- `auth.register` - { email, password, name, age, grade }
- `auth.login` - { email, password } → { token, user }

**study:**
- `study.startSession` - { tutorId } → { sessionId }
- `study.sendMessage` - { sessionId, content } → { response, xp, cognitiveLevel }
- `study.getHistory` - { sessionId } → { messages[] }
- `study.endSession` - { sessionId } → { stats }

**profile:**
- `profile.get` - {} → { name, xp, level, streak, pet, badges }
- `profile.update` - { name, tutorId } → { profile }
- `profile.claimDaily` - {} → { streak, bonus }

**quiz:**
- `quiz.generate` - { topic } → { questions[] }
- `quiz.submit` - { answers[] } → { score, xpEarned }

### Database Schema (Simplificado)

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE student_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  age_group TEXT, -- '6-10', '11-14', '15-17'
  grade TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_study_date DATE,
  tutor_id TEXT DEFAULT 'default',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study Sessions
CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES student_profiles(id),
  tutor_id TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- Chat Messages
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES study_sessions(id),
  role TEXT, -- 'user', 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pets
CREATE TABLE student_pets (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES student_profiles(id),
  pet_type TEXT,
  pet_name TEXT,
  pet_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Badges
CREATE TABLE student_badges (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES student_profiles(id),
  badge_type TEXT,
  earned_at TIMESTAMP DEFAULT NOW()
);

-- Usage Tracking (rate limiting)
CREATE TABLE daily_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  date DATE,
  message_count INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, date)
);
```

### Security Considerations
- Passwords: bcrypt with salt
- JWT tokens: 7 day expiry
- Rate limiting: 5 requests/day for free tier
- Input sanitization on all user content
- No PII stored without consent

---

## 7. Non-Goals (O que NÃO vamos fazer)

- ❌ Dashboard de pais
- ❌ Sistema de pagamento/assinatura
- ❌ Painel administrativo
- ❌ Consentimento parental obrigatório
- ❌ Importação de alunos por CSV
- ❌ Multi-tenant (escolas)
- ❌ Sistema de convites
- ❌ Ranking competitivo
- ❌ Conteúdo BNCC estruturado

---

## 8. Success Metrics

- Tempo até primeira mensagem: < 2 minutos
- Taxa de retorno D+1: > 30%
- Média de mensagens por sessão: > 5
- Satisfação: feedback "foi útil" > 80%