export type TaskType = 'coding' | 'writing' | 'analysis' | 'general' | 'math';

export interface PromptAnalysis {
  taskType: TaskType;
  complexity: number;
  contextNeeded: number;
  tokens: number;
  specialRequirements: string[];
}

export interface ModelProfile {
  id: string;
  name: string;
  strengths: string[];
  contextWindow: number;
  specialties: string[];
  costPerToken: number;
  averageSpeed: 'fast' | 'medium' | 'slow';
  reliabilityScore: number;
  bestFor: string[];
}

export interface PerformanceRecord {
  id: number;
  modelId: number;
  promptType: string;
  executionTime: number;
  tokenCount: number;
  userRating?: number;
  success: boolean;
  createdAt: Date;
  prompt: string;
  response: string;
}

export interface ModelRecommendation {
  modelId: string;
  confidence: number;
  reasons: string[];
}

export interface PromptFeatures {
  semanticCategory: string[];
  technicalComplexity: number;
  domainSpecificTerms: string[];
  expectedOutputType: 'code' | 'text' | 'analysis' | 'creative';
}

export interface AnalysisResult {
  features: PromptFeatures;
  confidence: number;
  recommendedModel: string;
  alternativeModels: string[];
  reasoning: string[];
}