export type OrganizationType = 'school' | 'network' | 'municipality' | 'ngo' | 'private_course' | 'home';

export interface BrandingConfig {
  organizationName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface ModuleConfig {
  tutor: boolean;
  gamification: boolean;
  familyCompanion: boolean;
  teacherCopilot: boolean;
  projects: boolean;
  learningPassport: boolean;
  analytics: boolean;
}

export interface PedagogicalPolicyConfig {
  allowDirectAnswers: boolean;
  requireSocraticFirstStep: boolean;
  enableOfflineMissions: boolean;
  maxDailyFreeMessages?: number;
  teacherAlertSensitivity: 'low' | 'medium' | 'high';
}

export interface WhiteLabelConfig {
  organizationId: string;
  organizationType: OrganizationType;
  branding: BrandingConfig;
  modules: ModuleConfig;
  pedagogy: PedagogicalPolicyConfig;
}

export const DEFAULT_WHITE_LABEL_CONFIG: WhiteLabelConfig = {
  organizationId: 'mindsteps-default',
  organizationType: 'home',
  branding: {
    organizationName: 'MindSteps',
    primaryColor: '#2563eb',
    secondaryColor: '#0f172a',
    accentColor: '#22c55e',
  },
  modules: {
    tutor: true,
    gamification: true,
    familyCompanion: false,
    teacherCopilot: false,
    projects: false,
    learningPassport: false,
    analytics: false,
  },
  pedagogy: {
    allowDirectAnswers: false,
    requireSocraticFirstStep: true,
    enableOfflineMissions: true,
    maxDailyFreeMessages: 5,
    teacherAlertSensitivity: 'medium',
  },
};

export function createSchoolWhiteLabelConfig(params: {
  organizationId: string;
  organizationName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}): WhiteLabelConfig {
  return {
    ...DEFAULT_WHITE_LABEL_CONFIG,
    organizationId: params.organizationId,
    organizationType: 'school',
    branding: {
      organizationName: params.organizationName,
      logoUrl: params.logoUrl,
      primaryColor: params.primaryColor || DEFAULT_WHITE_LABEL_CONFIG.branding.primaryColor,
      secondaryColor: params.secondaryColor || DEFAULT_WHITE_LABEL_CONFIG.branding.secondaryColor,
      accentColor: DEFAULT_WHITE_LABEL_CONFIG.branding.accentColor,
    },
    modules: {
      tutor: true,
      gamification: true,
      familyCompanion: true,
      teacherCopilot: true,
      projects: true,
      learningPassport: true,
      analytics: true,
    },
    pedagogy: {
      ...DEFAULT_WHITE_LABEL_CONFIG.pedagogy,
      maxDailyFreeMessages: undefined,
      teacherAlertSensitivity: 'medium',
    },
  };
}

export function createMunicipalityWhiteLabelConfig(params: {
  organizationId: string;
  organizationName: string;
  logoUrl?: string;
}): WhiteLabelConfig {
  return {
    ...createSchoolWhiteLabelConfig(params),
    organizationType: 'municipality',
    modules: {
      tutor: true,
      gamification: false,
      familyCompanion: true,
      teacherCopilot: true,
      projects: true,
      learningPassport: true,
      analytics: true,
    },
    pedagogy: {
      ...DEFAULT_WHITE_LABEL_CONFIG.pedagogy,
      maxDailyFreeMessages: undefined,
      teacherAlertSensitivity: 'high',
    },
  };
}

export function isModuleEnabled(config: WhiteLabelConfig, moduleName: keyof ModuleConfig): boolean {
  return config.modules[moduleName];
}

export function shouldShowTeacherAlert(config: WhiteLabelConfig, signalStrength: number): boolean {
  const threshold = config.pedagogy.teacherAlertSensitivity === 'high'
    ? 6
    : config.pedagogy.teacherAlertSensitivity === 'medium'
      ? 8
      : 9;

  return signalStrength >= threshold;
}

export function summarizeWhiteLabelConfig(config: WhiteLabelConfig): string {
  const enabledModules = Object.entries(config.modules)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name)
    .join(', ');

  return `${config.branding.organizationName} (${config.organizationType}) enabled modules: ${enabledModules}. Socratic first step: ${config.pedagogy.requireSocraticFirstStep ? 'yes' : 'no'}.`;
}
