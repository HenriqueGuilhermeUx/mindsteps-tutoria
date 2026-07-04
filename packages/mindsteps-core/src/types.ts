export type AgeGroup = '6-10' | '11-14' | '15-17' | '18+';

export type Subject =
  | 'matematica'
  | 'portugues'
  | 'ciencias'
  | 'historia'
  | 'geografia'
  | 'geral';

export type LearningStrategyType =
  | 'socratic_questioning'
  | 'guided_hint'
  | 'analogy'
  | 'worked_example'
  | 'retrieval_practice'
  | 'spaced_review'
  | 'reflection'
  | 'offline_mission'
  | 'conceptual_explanation';

export type LearningEventType =
  | 'QuestionAsked'
  | 'HintRequested'
  | 'HintAccepted'
  | 'ConceptUnderstood'
  | 'MisconceptionDetected'
  | 'ConfidenceImproved'
  | 'FrustrationDetected'
  | 'ReflectionCompleted'
  | 'OfflineActivityCompleted'
  | 'TeacherIntervention'
  | 'FamilyParticipation';

export interface LearningEvent {
  id?: string;
  learnerId: string;
  type: LearningEventType;
  subject?: Subject;
  concept?: string;
  evidence?: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CognitiveTwin {
  learnerId: string;
  ageGroup: AgeGroup;
  interests: string[];
  preferredExamples: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  masteredConcepts: string[];
  fragileConcepts: string[];
  misconceptions: string[];
  confidenceLevel: number;
  frustrationSignals: string[];
  successfulStrategies: LearningStrategyType[];
  nextRecommendedStep?: string;
  updatedAt: string;
}

export interface LearningMemory {
  learnerId: string;
  semanticMemory: string[];
  strategyMemory: Array<{
    concept: string;
    strategy: LearningStrategyType;
    worked: boolean;
    evidence?: string;
  }>;
  interestMemory: string[];
  reflectionMemory: string[];
  updatedAt: string;
}

export interface LearningContext {
  learnerId: string;
  learnerName?: string;
  subject: Subject;
  currentMessage: string;
  recentMessages?: Array<{ role: 'learner' | 'assistant'; content: string }>;
  cognitiveTwin: CognitiveTwin;
  learningMemory: LearningMemory;
}

export interface PedagogicalStrategy {
  type: LearningStrategyType;
  goal: string;
  reasoning: string;
  instructionForAi: string;
  avoidDirectAnswer: boolean;
  suggestedQuestion?: string;
  suggestedAnalogy?: string;
  offlineMission?: string;
}

export interface LearningResponsePlan {
  strategy: PedagogicalStrategy;
  memoryUpdates: LearningEvent[];
  teacherSignal?: string;
  familySignal?: string;
}
