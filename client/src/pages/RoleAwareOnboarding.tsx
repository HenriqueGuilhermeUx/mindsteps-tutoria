import { OnboardingPage } from '@/pages/Onboarding'
import { InstitutionalOnboardingPage } from '@/pages/InstitutionalOnboarding'

export function RoleAwareOnboardingPage() {
  const audience = localStorage.getItem('mindsteps_audience') || 'independente'

  if (audience === 'aluno' || audience === 'independente') {
    return <OnboardingPage />
  }

  return <InstitutionalOnboardingPage />
}
