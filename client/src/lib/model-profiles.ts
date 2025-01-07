import { ModelProfile } from './types';

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

export function findBestModel(analysis: any) {
  const scores = Object.entries(modelProfiles).map(([id, profile]) => {
    let score = 0;
    
    // Task type matching
    if (profile.specialties.includes(analysis.taskType)) score += 2;
    
    // Context window requirements
    const requiredTokens = analysis.tokens * 2; // Estimate response size
    if (profile.contextWindow >= requiredTokens) score += 1;
    
    // Complexity matching
    if (analysis.complexity > 0.7 && profile.reliabilityScore > 0.94) score += 2;
    
    // Special requirements matching
    const matchingSpecialties = analysis.specialRequirements
      .filter(req => profile.specialties.includes(req)).length;
    score += matchingSpecialties;
    
    return { id, score };
  });
  
  return scores.sort((a, b) => b.score - a.score)[0].id;
}
