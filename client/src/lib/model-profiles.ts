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

interface ModelScore {
  id: string;
  score: number;
  confidence: number;
  factors: string[];
}

export function findBestModel(analysis: any, preferences: ModelPreferences): { modelId: string; confidence: number; factors: string[] } {
  const scores: ModelScore[] = Object.entries(modelProfiles).map(([id, profile]) => {
    let score = 0;
    const factors: string[] = [];

    // Task type matching
    if (profile.specialties.includes(analysis.taskType)) {
      score += 2;
      factors.push(`Specialized in ${analysis.taskType}`);
    }

    // Context window requirements with user preference
    const requiredTokens = analysis.tokens * 2;
    if (profile.contextWindow >= requiredTokens) {
      const contextScore = preferences.contextWindowImportance / 100;
      score += contextScore;
      factors.push(`Sufficient context window (${profile.contextWindow.toLocaleString()} tokens)`);
    }

    // Speed preference
    if (preferences.prioritizeSpeed && profile.averageSpeed === 'fast') {
      score += 2;
      factors.push('Fast response time');
    }

    // Cost sensitivity
    const costScore = (1 - profile.costPerToken / 0.015) * (preferences.costSensitivity / 100);
    score += costScore;
    if (costScore > 0.5) {
      factors.push('Cost-effective option');
    }

    // Reliability threshold
    if (profile.reliabilityScore * 100 >= preferences.reliabilityThreshold) {
      const reliabilityScore = profile.reliabilityScore * (preferences.reliabilityThreshold / 100);
      score += reliabilityScore;
      factors.push(`High reliability (${(profile.reliabilityScore * 100).toFixed(1)}%)`);
    }

    // Special requirements matching
    const matchingSpecialties = analysis.specialRequirements
      .filter((req: string) => profile.specialties.includes(req)).length;
    if (matchingSpecialties > 0) {
      score += matchingSpecialties;
      factors.push(`Matches ${matchingSpecialties} special requirements`);
    }

    // Calculate confidence based on total possible score
    const maxPossibleScore = 7; 
    const confidence = Math.min(score / maxPossibleScore, 1);

    return { id, score, confidence, factors };
  });

  const bestModel = scores.sort((a, b) => b.score - a.score)[0];
  return {
    modelId: bestModel.id,
    confidence: bestModel.confidence,
    factors: bestModel.factors
  };
}