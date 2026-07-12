import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HomePage } from '@/pages/Home'
import { AuthPage } from '@/pages/Auth'
import { OnboardingPage } from '@/pages/Onboarding'
import { ChatPage } from '@/pages/Chat'
import { ProfilePage } from '@/pages/Profile'
import { LearningDashboardPage } from '@/pages/LearningDashboard'
import { TeacherDashboardPage } from '@/pages/TeacherDashboard'
import { LearningPassportPage } from '@/pages/LearningPassport'
import { FamilyDashboardPage } from '@/pages/FamilyDashboard'
import { LearningJourneyPage } from '@/pages/LearningJourney'
import { MissionCenterPage } from '@/pages/MissionCenter'
import { MasteryCenterPage } from '@/pages/MasteryCenter'
import { TestLabPage } from '@/pages/TestLab'
import { IntelligenceLabPage } from '@/pages/IntelligenceLab'
import { ScenarioSimulatorPage } from '@/pages/ScenarioSimulator'
import { FeedbackLabPage } from '@/pages/FeedbackLab'
import { SchoolDashboardPage } from '@/pages/SchoolDashboard'
import { NetworkDashboardPage } from '@/pages/NetworkDashboard'
import { ResearchDashboardPage } from '@/pages/ResearchDashboard'
import { PilotCenterPage } from '@/pages/PilotCenter'
import { TestProtocolPage } from '@/pages/TestProtocol'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Routes>
        <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
        <Route path="/testes" element={<><Header /><TestLabPage /><Footer /></>} />
        <Route path="/protocolo" element={<><Header /><TestProtocolPage /><Footer /></>} />
        <Route path="/inteligencia" element={<><Header /><IntelligenceLabPage /><Footer /></>} />
        <Route path="/simulador" element={<><Header /><ScenarioSimulatorPage /><Footer /></>} />
        <Route path="/feedback" element={<><Header /><FeedbackLabPage /><Footer /></>} />
        <Route path="/escola" element={<><Header /><SchoolDashboardPage /><Footer /></>} />
        <Route path="/rede" element={<><Header /><NetworkDashboardPage /><Footer /></>} />
        <Route path="/pesquisa" element={<><Header /><ResearchDashboardPage /><Footer /></>} />
        <Route path="/piloto" element={<><Header /><PilotCenterPage /><Footer /></>} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><div className="flex-1"><ChatPage /></div></div></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><LearningDashboardPage /><Footer /></div></ProtectedRoute>} />
        <Route path="/journey" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><LearningJourneyPage /><Footer /></div></ProtectedRoute>} />
        <Route path="/missoes" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><MissionCenterPage /><Footer /></div></ProtectedRoute>} />
        <Route path="/dominio" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><MasteryCenterPage /><Footer /></div></ProtectedRoute>} />
        <Route path="/passport" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><LearningPassportPage /><Footer /></div></ProtectedRoute>} />
        <Route path="/professor" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><TeacherDashboardPage /><Footer /></div></ProtectedRoute>} />
        <Route path="/familia" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><FamilyDashboardPage /><Footer /></div></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><ProfilePage /><Footer /></div></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
