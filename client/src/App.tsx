import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HomePage } from '@/pages/Home'
import { AuthPage } from '@/pages/Auth'
import { OnboardingPage } from '@/pages/Onboarding'
import { ChatPage } from '@/pages/Chat'
import { ProfilePage } from '@/pages/Profile'

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
        {/* Public routes with header/footer */}
        <Route path="/" element={<><Header /><HomePage /><Footer /></>} />

        {/* Auth routes (no header) */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        } />

        {/* Protected routes with header */}
        <Route path="/chat" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex-1">
                <ChatPage />
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/perfil" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
              <Header />
              <ProfilePage />
              <Footer />
            </div>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App