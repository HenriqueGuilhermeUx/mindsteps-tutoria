import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore, useChatStore, useUsageStore } from '@/stores'
import { studyApi, usageApi } from '@/lib/api'
import { cn, formatXP, getLevelTitle, getXPProgress, getPetEmoji, getPetStage } from '@/lib/utils'
import { Send, Mic, MicOff, Loader2, Sparkles, Zap, MessageCircle, ChevronDown, Lightbulb } from 'lucide-react'

const SUBJECTS = [
  { id: 'geral', label: 'Geral', emoji: '🌟' },
  { id: 'matematica', label: 'Matemática', emoji: '🔢' },
  { id: 'portugues', label: 'Português', emoji: '📝' },
  { id: 'ciencias', label: 'Ciências', emoji: '🧬' },
  { id: 'historia', label: 'História', emoji: '🏛️' },
  { id: 'geografia', label: 'Geografia', emoji: '🌍' },
]

const SUGGESTED_TOPICS = [
  'Por que o céu é azul?',
  'Como funcionam as equações?',
  'Quem foram os faraós?',
  'O que é fotossíntese?',
  'Como funciona a gravidade?',
]

export function ChatPage() {
  const navigate = useNavigate()
  const { profile, addXP, isAuthenticated } = useAuthStore()
  const { messages, isLoading, setLoading, addMessage, clearChat, subject, setSubject, sessionId, setSessionId } = useChatStore()
  const [input, setInput] = useState('')
  const [showSubjects, setShowSubjects] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintLoading, setHintLoading] = useState(false)
  const [currentHint, setCurrentHint] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
    }
  }, [isAuthenticated, navigate])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentHint])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleGetHint = async () => {
    if (!sessionId || hintLoading) return

    setHintLoading(true)
    setShowHint(true)

    try {
      const response = await studyApi.getHint(sessionId)
      setCurrentHint(response.hint)
    } catch (error) {
      setCurrentHint('Que tal pensar sobre isso de outra forma? Às vezes um exemplo do cotidiano ajuda!')
    } finally {
      setHintLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    setShowHint(false)
    setCurrentHint('')

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    })

    try {
      // Start session if needed
      let currentSessionId = sessionId
      if (!currentSessionId) {
        const session = await studyApi.startSession(profile?.tutorId || 'default')
        setSessionId(session.sessionId)
        currentSessionId = session.sessionId
      }

      // Send message
      const response = await studyApi.sendMessage(currentSessionId!, userMessage, subject)

      // Add assistant message
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      })

      // Add XP
      addXP(response.xpEarned)

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar mensagem')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedTopic = (topic: string) => {
    setInput(topic)
    inputRef.current?.focus()
  }

  const handleNewChat = () => {
    clearChat()
    toast.success('Nova conversa iniciada!')
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Subject Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSubjects(!showSubjects)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <span>{SUBJECTS.find(s => s.id === subject)?.emoji}</span>
                <span className="font-medium text-slate-700">
                  {SUBJECTS.find(s => s.id === subject)?.label}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {showSubjects && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSubject(s.id)
                        setShowSubjects(false)
                        handleNewChat()
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2',
                        subject === s.id && 'bg-primary-50 text-primary-700'
                      )}
                    >
                      <span>{s.emoji}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1 text-accent-600">
              <Flame className="w-5 h-5" />
              <span className="font-semibold">{profile.streak}</span>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1 text-primary-600">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">{formatXP(profile.xp)}</span>
            </div>

            {/* Level */}
            <div className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
              {getLevelTitle(profile.level)}
            </div>

            {/* New Chat */}
            <button
              onClick={handleNewChat}
              className="btn-ghost p-2"
              title="Nova conversa"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* Hint Button */}
            <button
              onClick={handleGetHint}
              disabled={!sessionId || messages.length === 0 || hintLoading}
              className="btn-ghost p-2 flex items-center gap-1 text-amber-600 hover:bg-amber-50"
              title="Pedir dica"
            >
              <Lightbulb className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <WelcomeMessage
              tutorId={profile.tutorId}
              name={profile.name}
              onSuggestedTopic={handleSuggestedTopic}
            />
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex animate-fade-in',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-lg mr-3 flex-shrink-0">
                  {profile.tutorId === 'scientist' ? '🧪' :
                   profile.tutorId === 'time_traveler' ? '⏰' :
                   profile.tutorId === 'detective' ? '🔍' :
                   profile.tutorId === 'storyteller' ? '📖' : '🎓'}
                </div>
              )}

              <div
                className={cn(
                  'max-w-[70%] px-4 py-3',
                  message.role === 'user'
                    ? 'message-bubble-user'
                    : 'message-bubble-assistant'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-lg ml-3 flex-shrink-0">
                  {profile.petType ? getPetEmoji(profile.petType) : '👤'}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-lg mr-3">
                🎓
              </div>
              <div className="message-bubble-assistant">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-slate-500 text-sm">Pensando...</span>
                </div>
              </div>
            </div>
          )}

          {/* Hint Box */}
          {showHint && (
            <div className="flex justify-center">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-md">
                {hintLoading ? (
                  <div className="flex items-center gap-2 text-amber-700">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Buscando dica...</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 mb-1">💡 Dica do Tutor:</p>
                      <p className="text-amber-900">{currentHint}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-100 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef as any}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="input resize-none pr-12"
                rows={1}
              />
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={cn(
                  'absolute right-3 bottom-3 p-1.5 rounded-lg transition-colors',
                  isRecording ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || messagesRemaining <= 0}
              className="btn-primary p-3 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-2">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  )
}

interface WelcomeMessageProps {
  tutorId: string
  name: string
  onSuggestedTopic: (topic: string) => void
}

function WelcomeMessage({ tutorId, name, onSuggestedTopic }: WelcomeMessageProps) {
  const tutorEmoji = tutorId === 'scientist' ? '🧪' :
                    tutorId === 'time_traveler' ? '⏰' :
                    tutorId === 'detective' ? '🔍' :
                    tutorId === 'storyteller' ? '📖' : '🎓'

  return (
    <div className="flex items-start gap-4 animate-fade-in">
      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
        {tutorEmoji}
      </div>
      <div className="message-bubble-assistant max-w-lg">
        <p className="mb-3">
          Olá, <strong>{name}</strong>! 👋 Que bom ter você aqui!
        </p>
        <p className="mb-3">
          Sou seu Tutor e estou aqui para te ajudar a aprender de um jeito diferente — através de perguntas que fazem você pensar e descobrir as respostas!
        </p>
        <p className="mb-4">
          Sobre o que você quer aprender hoje? Pode ser qualquer coisa: matemática, ciências, história, português...
        </p>
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Sugestões para começar:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => onSuggestedTopic(topic)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}