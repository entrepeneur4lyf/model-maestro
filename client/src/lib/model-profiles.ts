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
  breakdown: {
    taskMatch: number;
    contextScore: number;
    speedBonus: number;
    costScore: number;
    reliabilityScore: number;
    specialtyMatch: number;
  };
}

export function findBestModel(analysis: any, preferences: ModelPreferences): { 
  modelId: string; 
  confidence: number; 
  factors: string[];
  scoreBreakdown: ModelScore['breakdown'];
} {
  console.log('Running model selection with preferences:', {
    ...preferences,
    costSensitivityNormalized: preferences.costSensitivity / 100,
    reliabilityThresholdNormalized: preferences.reliabilityThreshold / 100,
    contextImportanceNormalized: preferences.contextWindowImportance / 100
  });

  const scores: ModelScore[] = Object.entries(modelProfiles).map(([id, profile]) => {
    const breakdown = {
      taskMatch: 0,
      contextScore: 0,
      speedBonus: 0,
      costScore: 0,
      reliabilityScore: 0,
      specialtyMatch: 0
    };
    const factors: string[] = [];

    // Task type matching
    if (profile.specialties.includes(analysis.taskType)) {
      breakdown.taskMatch = 2;
      factors.push(`Specialized in ${analysis.taskType}`);
    }

    // Context window requirements with user preference
    const requiredTokens = analysis.tokens * 2;
    if (profile.contextWindow >= requiredTokens) {
      breakdown.contextScore = preferences.contextWindowImportance / 100;
      factors.push(`Sufficient context window (${profile.contextWindow.toLocaleString()} tokens)`);
    }

    // Speed preference
    if (preferences.prioritizeSpeed && profile.averageSpeed === 'fast') {
      breakdown.speedBonus = 2;
      factors.push('Fast response time');
    }

    // Cost sensitivity
    const costNormalized = preferences.costSensitivity / 100;
    breakdown.costScore = (1 - profile.costPerToken / 0.015) * costNormalized;
    if (breakdown.costScore > 0.5) {
      factors.push(`Cost-effective (${(profile.costPerToken * 1000).toFixed(1)}¢ per 1k tokens)`);
    }

    // Reliability threshold
    const reliabilityThreshold = preferences.reliabilityThreshold / 100;
    if (profile.reliabilityScore >= reliabilityThreshold) {
      breakdown.reliabilityScore = profile.reliabilityScore * reliabilityThreshold;
      factors.push(`High reliability (${(profile.reliabilityScore * 100).toFixed(1)}%)`);
    }

    // Special requirements matching
    breakdown.specialtyMatch = analysis.specialRequirements
      .filter((req: string) => profile.specialties.includes(req)).length;
    if (breakdown.specialtyMatch > 0) {
      factors.push(`Matches ${breakdown.specialtyMatch} special requirements`);
    }

    const score = Object.values(breakdown).reduce((a, b) => a + b, 0);

    console.log(`Model ${profile.name} score breakdown:`, {
      ...breakdown,
      totalScore: score,
      factors,
      preferences: {
        speedBonus: preferences.prioritizeSpeed ? 'Active (+2 for fast models)' : 'Inactive',
        costMultiplier: `${costNormalized.toFixed(2)}x`,
        reliabilityRequired: `${(reliabilityThreshold * 100).toFixed(0)}%`
      }
    });

    return { 
      id, 
      score, 
      factors,
      breakdown,
      confidence: 0 // Will be calculated after all scores are computed
    };
  });

  // Calculate confidence based on relative score differences
  const maxScore = Math.max(...scores.map(s => s.score));
  const minScore = Math.min(...scores.map(s => s.score));
  const scoreRange = maxScore - minScore;

  scores.forEach(score => {
    score.confidence = scoreRange > 0 
      ? (score.score - minScore) / scoreRange 
      : 1;
  });

  const bestModel = scores.sort((a, b) => b.score - a.score)[0];
  console.log('Selected model:', modelProfiles[bestModel.id].name, 'with confidence:', bestModel.confidence);

  return {
    modelId: bestModel.id,
    confidence: bestModel.confidence,
    factors: bestModel.factors,
    scoreBreakdown: bestModel.breakdown
  };
}