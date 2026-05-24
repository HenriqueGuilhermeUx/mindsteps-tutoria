import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores'
import { cn, formatXP, getLevelTitle, getXPProgress, getXPForNextLevel, getPetEmoji, getPetStage } from '@/lib/utils'
import { LogOut, Edit2, Crown, Loader2 } from 'lucide-react'

const TUTORS = [
  { id: 'default', emoji: '🎓', name: 'Tutor Clássico' },
  { id: 'scientist', emoji: '🧪', name: 'Cientista Maluco' },
  { id: 'time_traveler', emoji: '⏰', name: 'Viajante do Tempo' },
  { id: 'detective', emoji: '🔍', name: 'Detetive Lógico' },
  { id: 'storyteller', emoji: '📖', name: 'Contador de Histórias' },
]

const PET_TYPES = [
  { id: 'dragon', emoji: '🐉', name: 'Dragão' },
  { id: 'cat', emoji: '🐱', name: 'Gato' },
  { id: 'robot', emoji: '🤖', name: 'Robô' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicórnio' },
  { id: 'phoenix', emoji: '🔥', name: 'Fênix' },
]

export function ProfilePage() {
  const navigate = useNavigate()
  const { profile, setProfile, logout } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(profile?.name || '')
  const [isLoading, setIsLoading] = useState(false)
  const [showTutors, setShowTutors] = useState(false)
  const [showPets, setShowPets] = useState(false)

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const handleSaveName = async () => {
    if (editName.trim().length < 2) {
      toast.error('Nome muito curto')
      return
    }
    setIsLoading(true)
    try {
      setProfile({ ...profile, name: editName.trim() })
      setIsEditing(false)
      toast.success('Nome atualizado!')
    } catch (error) {
      toast.error('Erro ao salvar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectTutor = (tutorId: string) => {
    setProfile({ ...profile, tutorId })
    setShowTutors(false)
    toast.success('Tutor alterado!')
  }

  const handleSelectPet = (petType: string) => {
    setProfile({ ...profile, petType })
    setShowPets(false)
    toast.success('Pet selecionado!')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const currentTutor = TUTORS.find(t => t.id === profile.tutorId) || TUTORS[0]
  const petStage = getPetStage(profile.petXp)
  const xpProgress = getXPProgress(profile.xp, profile.level)
  const nextLevelXP = getXPForNextLevel(profile.level)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-4xl">
                {profile.petType ? getPetEmoji(profile.petType) : '👤'}
              </div>
              {profile.petType && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-lg border-2 border-white">
                  {petStage.emoji}
                </div>
              )}
            </div>

            {/* Name & Level */}
            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input py-2"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={isLoading}
                    className="btn-primary py-2"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setEditName(profile.name)
                    }}
                    className="btn-ghost py-2"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
                  <button
                    onClick={() => {
                      setEditName(profile.name)
                      setIsEditing(true)
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-0.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {getLevelTitle(profile.level)}
                </span>
                <span className="text-sm text-slate-500">Nível {profile.level}</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600">Progresso para próximo nível</span>
              <span className="font-medium text-slate-700">
                {profile.xp} / {nextLevelXP} XP
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{formatXP(profile.xp)}</div>
              <div className="text-sm text-slate-500">XP Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">{profile.streak}</div>
              <div className="text-sm text-slate-500">Dias de Streak 🔥</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">{profile.level}</div>
              <div className="text-sm text-slate-500">Nível</div>
            </div>
          </div>
        </div>

        {/* Pet Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Meu Pet</h2>
            <button
              onClick={() => setShowPets(!showPets)}
              className="text-primary-600 text-sm font-medium hover:underline"
            >
              {profile.petType ? 'Mudar' : 'Escolher'}
            </button>
          </div>

          {profile.petType ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center text-3xl">
                {getPetEmoji(profile.petType)}
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  {profile.petName || 'Meu Pet'} {petStage.emoji}
                </div>
                <div className="text-sm text-slate-500">
                  {petStage.name} • {profile.petXp} XP
                </div>
                <div className="mt-1 h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${Math.min(100, (profile.petXp / 100) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500">
              <p>Você ainda não tem um pet!</p>
              <button
                onClick={() => setShowPets(true)}
                className="text-primary-600 font-medium hover:underline mt-1"
              >
                Escolher agora
              </button>
            </div>
          )}

          {/* Pet Selection */}
          {showPets && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-3">Escolha seu companheiro:</p>
              <div className="grid grid-cols-5 gap-2">
                {PET_TYPES.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => handleSelectPet(pet.id)}
                    className={cn(
                      'p-3 rounded-xl text-center transition-all hover:bg-slate-50',
                      profile.petType === pet.id && 'bg-primary-50 border-2 border-primary-500'
                    )}
                  >
                    <div className="text-2xl mb-1">{pet.emoji}</div>
                    <div className="text-xs text-slate-600">{pet.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tutor Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Meu Tutor</h2>
            <button
              onClick={() => setShowTutors(!showTutors)}
              className="text-primary-600 text-sm font-medium hover:underline"
            >
              Mudar
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center text-3xl">
              {currentTutor.emoji}
            </div>
            <div>
              <div className="font-semibold text-slate-900">{currentTutor.name}</div>
              <div className="text-sm text-slate-500">
                {currentTutor.id === 'scientist' && 'Focado em ciências e descobertas'}
                {currentTutor.id === 'time_traveler' && 'Viaja pela história e geografia'}
                {currentTutor.id === 'detective' && 'Especialista em lógica e matemática'}
                {currentTutor.id === 'storyteller' && 'Conecta aprendizado com histórias'}
                {currentTutor.id === 'default' && 'Guia completo para todas as matérias'}
              </div>
            </div>
          </div>

          {/* Tutor Selection */}
          {showTutors && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-3">Escolha seu tutor:</p>
              <div className="space-y-2">
                {TUTORS.map((tutor) => (
                  <button
                    key={tutor.id}
                    onClick={() => handleSelectTutor(tutor.id)}
                    className={cn(
                      'w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all',
                      profile.tutorId === tutor.id
                        ? 'bg-primary-50 border-2 border-primary-500'
                        : 'bg-slate-50 hover:bg-slate-100'
                    )}
                  >
                    <span className="text-2xl">{tutor.emoji}</span>
                    <span className="font-medium text-slate-900">{tutor.name}</span>
                    {profile.tutorId === tutor.id && (
                      <Crown className="w-4 h-4 text-amber-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full btn-secondary py-3 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair da conta
        </button>
      </div>
    </div>
  )
}