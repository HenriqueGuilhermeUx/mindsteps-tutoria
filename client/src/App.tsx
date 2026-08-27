import { Routes, Route, Navigate } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { useAuthStore } from '@/stores'
import { features } from '@/lib/features'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { InstitutionalContextBar } from '@/components/InstitutionalContextBar'
import { MobileAppShell } from '@/components/MobileAppShell'
import { EnemCloudBridge } from '@/components/EnemCloudBridge'
import { HomePage } from '@/pages/Home'
import { AuthPage } from '@/pages/Auth'
import { RoleAwareOnboardingPage } from '@/pages/RoleAwareOnboarding'
import { ChatPage } from '@/pages/Chat'
import { ProfilePage } from '@/pages/Profile'
import { LearningConnectionsPage } from '@/pages/LearningConnections'
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
import { CompanyPage } from '@/pages/Company'
import { RoadmapPage } from '@/pages/Roadmap'
import { SafetyPage } from '@/pages/Safety'
import { AccessibilityPage } from '@/pages/Accessibility'
import { LearningGenomePage } from '@/pages/LearningGenome'
import { KnowledgeGraphPage } from '@/pages/KnowledgeGraph'
import { ProductTourPage } from '@/pages/ProductTour'
import { StartPage } from '@/pages/Start'
import { LearningCenterPage } from '@/pages/LearningCenter'
import { HomeStudyPage } from '@/pages/HomeStudy'
import { TodayPage } from '@/pages/Today'
import { ResponsibleLearningHomePage } from '@/pages/ResponsibleLearningHome'
import { ResponsibleAICenterPage } from '@/pages/ResponsibleAICenter'
import { AILiteracyCenterPage } from '@/pages/AILiteracyCenter'
import { TeacherAICopilotPage } from '@/pages/TeacherAICopilot'
import { SchoolAIGovernancePage } from '@/pages/SchoolAIGovernance'
import { HumanReviewCenterPage } from '@/pages/HumanReviewCenter'
import { DataRightsCenterPage } from '@/pages/DataRightsCenter'
import { EnemHubPage } from '@/pages/EnemHub'
import { EnemSetupPage } from '@/pages/EnemSetup'
import { EnemDiagnosticPage } from '@/pages/EnemDiagnostic'
import { EnemTodayPage } from '@/pages/EnemToday'
import { EnemWeekPage } from '@/pages/EnemWeek'
import { EnemErrorsPage } from '@/pages/EnemErrors'
import { EnemQuestionsPage } from '@/pages/EnemQuestions'
import { EnemSimulationPage } from '@/pages/EnemSimulation'
import { EnemStrategyCoachPage } from '@/pages/EnemStrategyCoach'
import { EnemMapPage } from '@/pages/EnemMap'
import { EnemWritingLabPage } from '@/pages/EnemWritingLab'
import { EnemWritingStudioPage } from '@/pages/EnemWritingStudio'
import { EnemWritingCoachPage } from '@/pages/EnemWritingCoach'
import { EnemWritingDrillPage } from '@/pages/EnemWritingDrill'
import { EnemRepertoireLabPage } from '@/pages/EnemRepertoireLab'
import { WritingVersionComparePage } from '@/pages/WritingVersionCompare'
import { WritingDNAPage } from '@/pages/WritingDNA'
import { EnemThemeEnginePage } from '@/pages/EnemThemeEngine'
function ProtectedRoute({ children }: { children: React.ReactNode }) { const { isAuthenticated } = useAuthStore(); if (!isAuthenticated) return <Navigate to="/auth" replace />; return <>{children}</> }
function InstitutionalLayout({ children }: { children: React.ReactNode }) { return <div className="flex flex-col min-h-screen"><Header /><InstitutionalContextBar />{children}<Footer /></div> }
function ProtectedWebLayout({ children }: { children: React.ReactNode }) { return <ProtectedRoute><div className="flex min-h-screen flex-col"><Header />{children}<Footer /></div></ProtectedRoute> }
function StudentRoute({ children, title }: { children: React.ReactNode; title?: string }) { return <ProtectedRoute><MobileAppShell title={title}>{children}</MobileAppShell></ProtectedRoute> }
function EnemV2Route({ children, title }: { children: React.ReactNode; title?: string }) { if (!features.enemV2) return <Navigate to={Capacitor.isNativePlatform() ? '/hoje' : '/'} replace />; return <StudentRoute title={title}>{children}</StudentRoute> }
function RootRoute() { const { isAuthenticated } = useAuthStore(); if (Capacitor.isNativePlatform()) return <Navigate to={isAuthenticated ? '/hoje' : '/auth'} replace />; return <><Header /><HomePage /><Footer /></> }
function App() { return <div className="min-h-screen bg-slate-50"><EnemCloudBridge/><Routes>
<Route path="/" element={<RootRoute />} />
<Route path="/comecar" element={<><Header /><StartPage /><Footer /></>} /><Route path="/estudar-em-casa" element={<><Header /><HomeStudyPage /><Footer /></>} /><Route path="/tour" element={<><Header /><ProductTourPage /><Footer /></>} /><Route path="/academia" element={<><Header /><LearningCenterPage /><Footer /></>} /><Route path="/empresa" element={<><Header /><CompanyPage /><Footer /></>} /><Route path="/roadmap" element={<><Header /><RoadmapPage /><Footer /></>} /><Route path="/seguranca" element={<><Header /><SafetyPage /><Footer /></>} /><Route path="/acessibilidade" element={<><Header /><AccessibilityPage /><Footer /></>} /><Route path="/genoma" element={<><Header /><LearningGenomePage /><Footer /></>} /><Route path="/grafo" element={<><Header /><KnowledgeGraphPage /><Footer /></>} /><Route path="/testes" element={<><Header /><TestLabPage /><Footer /></>} /><Route path="/protocolo" element={<><Header /><TestProtocolPage /><Footer /></>} /><Route path="/inteligencia" element={<><Header /><IntelligenceLabPage /><Footer /></>} /><Route path="/simulador" element={<><Header /><ScenarioSimulatorPage /><Footer /></>} /><Route path="/feedback" element={<><Header /><FeedbackLabPage /><Footer /></>} /><Route path="/escola" element={<InstitutionalLayout><SchoolDashboardPage /></InstitutionalLayout>} /><Route path="/rede" element={<InstitutionalLayout><NetworkDashboardPage /></InstitutionalLayout>} /><Route path="/pesquisa" element={<><Header /><ResearchDashboardPage /><Footer /></>} /><Route path="/piloto" element={<><Header /><PilotCenterPage /><Footer /></>} />
<Route path="/auth" element={<AuthPage />} /><Route path="/onboarding" element={<ProtectedRoute><RoleAwareOnboardingPage /></ProtectedRoute>} />
<Route path="/aprendizagem-responsavel" element={<ProtectedWebLayout><ResponsibleLearningHomePage /></ProtectedWebLayout>} /><Route path="/transparencia-ia" element={<ProtectedWebLayout><ResponsibleAICenterPage /></ProtectedWebLayout>} /><Route path="/ia-cidadania" element={<ProtectedWebLayout><AILiteracyCenterPage /></ProtectedWebLayout>} /><Route path="/direitos-dados" element={<ProtectedWebLayout><DataRightsCenterPage /></ProtectedWebLayout>} /><Route path="/professor/ia" element={<ProtectedRoute><InstitutionalLayout><TeacherAICopilotPage /></InstitutionalLayout></ProtectedRoute>} /><Route path="/escola/governanca-ia" element={<ProtectedRoute><InstitutionalLayout><SchoolAIGovernancePage /></InstitutionalLayout></ProtectedRoute>} /><Route path="/revisoes-humanas" element={<ProtectedRoute><InstitutionalLayout><HumanReviewCenterPage /></InstitutionalLayout></ProtectedRoute>} />
<Route path="/hoje" element={<StudentRoute><TodayPage /></StudentRoute>} /><Route path="/chat" element={<StudentRoute title="Tutor"><ChatPage /></StudentRoute>} /><Route path="/dashboard" element={<ProtectedRoute><Navigate to="/hoje" replace /></ProtectedRoute>} /><Route path="/dashboard-legado" element={<ProtectedRoute><div className="flex flex-col min-h-screen"><Header /><LearningDashboardPage /><Footer /></div></ProtectedRoute>} /><Route path="/journey" element={<StudentRoute title="Meu mapa"><LearningJourneyPage /></StudentRoute>} /><Route path="/missoes" element={<StudentRoute title="Missões"><MissionCenterPage /></StudentRoute>} /><Route path="/dominio" element={<StudentRoute title="Domínio"><MasteryCenterPage /></StudentRoute>} /><Route path="/passport" element={<StudentRoute title="Passaporte"><LearningPassportPage /></StudentRoute>} /><Route path="/vinculos" element={<StudentRoute title="Meus vínculos"><LearningConnectionsPage /></StudentRoute>} /><Route path="/perfil" element={<StudentRoute title="Meu perfil"><ProfilePage /></StudentRoute>} />
<Route path="/enem" element={<EnemV2Route title="MindSteps ENEM"><EnemHubPage /></EnemV2Route>} /><Route path="/enem/configurar" element={<EnemV2Route title="Configurar meu ENEM"><EnemSetupPage /></EnemV2Route>} /><Route path="/enem/diagnostico" element={<EnemV2Route title="Diagnóstico ENEM"><EnemDiagnosticPage /></EnemV2Route>} /><Route path="/enem/hoje" element={<EnemV2Route title="Meu Dia ENEM"><EnemTodayPage /></EnemV2Route>} /><Route path="/enem/semana" element={<EnemV2Route title="Minha Semana ENEM"><EnemWeekPage /></EnemV2Route>} /><Route path="/enem/erros" element={<EnemV2Route title="Caderno de Erros"><EnemErrorsPage /></EnemV2Route>} /><Route path="/enem/questoes" element={<EnemV2Route title="Questões ENEM"><EnemQuestionsPage /></EnemV2Route>} /><Route path="/enem/simulado" element={<EnemV2Route title="Simulado ENEM"><EnemSimulationPage /></EnemV2Route>} /><Route path="/enem/estrategia" element={<EnemV2Route title="Coach de Estratégia"><EnemStrategyCoachPage /></EnemV2Route>} /><Route path="/enem/mapa" element={<EnemV2Route title="Meu mapa ENEM"><EnemMapPage /></EnemV2Route>} /><Route path="/enem/redacao" element={<EnemV2Route title="Redação ENEM"><EnemWritingLabPage /></EnemV2Route>} /><Route path="/enem/redacao/escrever" element={<EnemV2Route title="Estúdio de Escrita"><EnemWritingStudioPage /></EnemV2Route>} /><Route path="/enem/redacao/coach" element={<EnemV2Route title="Coach de Escrita"><EnemWritingCoachPage /></EnemV2Route>} /><Route path="/enem/redacao/treino/:kind" element={<EnemV2Route title="Treino de Escrita"><EnemWritingDrillPage /></EnemV2Route>} /><Route path="/enem/redacao/repertorio" element={<EnemV2Route title="Repertório Vivo"><EnemRepertoireLabPage /></EnemV2Route>} /><Route path="/enem/redacao/comparar" element={<EnemV2Route title="Evolução da Escrita"><WritingVersionComparePage /></EnemV2Route>} /><Route path="/enem/redacao/dna" element={<EnemV2Route title="DNA da Escrita"><WritingDNAPage /></EnemV2Route>} /><Route path="/enem/redacao/temas" element={<EnemV2Route title="Temas ENEM"><EnemThemeEnginePage /></EnemV2Route>} />
<Route path="/professor" element={<ProtectedRoute><InstitutionalLayout><TeacherDashboardPage /></InstitutionalLayout></ProtectedRoute>} /><Route path="/familia" element={<ProtectedRoute><InstitutionalLayout><FamilyDashboardPage /></InstitutionalLayout></ProtectedRoute>} /><Route path="*" element={<Navigate to="/" replace />} />
</Routes></div> }
export default App
