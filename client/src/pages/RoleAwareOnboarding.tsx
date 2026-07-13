import { OnboardingPage } from '@/pages/Onboarding'
import { InstitutionalOnboardingPage } from '@/pages/InstitutionalOnboarding'

export function RoleAwareOnboardingPage() {
  const audience = localStorage.getItem('mindsteps_audience') || 'aluno'

  if (audience === 'aluno') {
    return <OnboardingPage />
  }

  return <InstitutionalOnboardingPage />
}
