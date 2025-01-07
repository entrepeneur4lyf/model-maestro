import { ModelProfile } from './types';
import type { ModelPreferences } from '@/components/model-router/ModelPreferences';

export const modelProfiles: Record<string, ModelProfile> = {
  'claude-3-opus': {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    strengths: ['long-form writing', 'complex analysis', 'research'],
    contextWindow: 200000,
    specialties: ['academic writing', 'code analysis', 'technical writing'],
    costPerToken: 0.015,
    averageSpeed: 'medium',
    reliabilityScore: 0.95,
    bestFor: ['research', 'analysis', 'long-form content']
  },
  'gemini-pro': {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    strengths: ['code generation', 'technical tasks', 'mathematical analysis'],
    contextWindow: 32000,
    specialties: ['coding', 'math', 'data analysis'],
    costPerToken: 0.012,
    averageSpeed: 'fast',
    reliabilityScore: 0.92,
    bestFor: ['coding', 'quick responses', 'technical tasks']
  },
  'claude-3-sonnet': {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    strengths: ['balanced performance', 'concise responses'],
    contextWindow: 100000,
    specialties: ['general tasks', 'balanced performance'],
    costPerToken: 0.008,
    averageSpeed: 'fast',
    reliabilityScore: 0.93,
    bestFor: ['general queries', 'balanced tasks']
  }
};

export function findBestModel(analysis: any, preferences: ModelPreferences): string {
  const scores = Object.entries(modelProfiles).map(([id, profile]) => {
    let score = 0;

    // Task type matching
    if (profile.specialties.includes(analysis.taskType)) score += 2;

    // Context window requirements with user preference
    const requiredTokens = analysis.tokens * 2; // Estimate response size
    if (profile.contextWindow >= requiredTokens) {
      score += (preferences.contextWindowImportance / 100);
    }

    // Speed preference
    if (preferences.prioritizeSpeed && profile.averageSpeed === 'fast') {
      score += 2;
    }

    // Cost sensitivity
    const costScore = (1 - profile.costPerToken / 0.015) * (preferences.costSensitivity / 100);
    score += costScore;

    // Reliability threshold
    if (profile.reliabilityScore * 100 >= preferences.reliabilityThreshold) {
      score += profile.reliabilityScore * (preferences.reliabilityThreshold / 100);
    }

    // Special requirements matching
    const matchingSpecialties = analysis.specialRequirements
      .filter((req: string) => profile.specialties.includes(req)).length;
    score += matchingSpecialties;

    return { id, score };
  });

  return scores.sort((a, b) => b.score - a.score)[0].id;
}