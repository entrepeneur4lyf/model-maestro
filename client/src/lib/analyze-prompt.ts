import natural from 'natural';
import { PromptAnalysis, TaskType } from './types';

const tokenizer = new natural.WordTokenizer();
const tfidf = new natural.TfIdf();

const TASK_KEYWORDS = {
  coding: ['code', 'function', 'program', 'algorithm', 'debug'],
  writing: ['write', 'essay', 'article', 'blog', 'content'],
  analysis: ['analyze', 'evaluate', 'research', 'study', 'investigate'],
  math: ['calculate', 'solve', 'equation', 'math', 'formula'],
  general: ['explain', 'describe', 'help', 'tell', 'what']
};

export function analyzePrompt(prompt: string): PromptAnalysis {
  const tokens = tokenizer.tokenize(prompt.toLowerCase());
  
  // Task classification
  const taskScores = Object.entries(TASK_KEYWORDS).map(([task, keywords]) => {
    const score = keywords.reduce((acc, keyword) => 
      acc + (tokens.includes(keyword) ? 1 : 0), 0);
    return { task, score };
  });
  
  const taskType = taskScores.reduce((a, b) => 
    a.score > b.score ? a : b).task as TaskType;

  // Complexity analysis
  const complexity = calculateComplexity(prompt, tokens);
  
  // Context estimation
  const contextNeeded = estimateContextRequirement(tokens);
  
  // Special requirements detection
  const specialRequirements = detectSpecialRequirements(prompt);

  return {
    taskType,
    complexity,
    contextNeeded,
    tokens: tokens.length,
    specialRequirements
  };
}

function calculateComplexity(prompt: string, tokens: string[]): number {
  const factors = [
    tokens.length / 100, // Length factor
    prompt.split('.').length / 5, // Sentence complexity
    new Set(tokens).size / tokens.length, // Vocabulary diversity
  ];
  
  return Math.min(1, factors.reduce((a, b) => a + b) / 3);
}

function estimateContextRequirement(tokens: string[]): number {
  const contextFactors = [
    tokens.includes('previous') || tokens.includes('before'),
    tokens.includes('context') || tokens.includes('background'),
    tokens.length > 50
  ];
  
  return contextFactors.filter(Boolean).length / contextFactors.length;
}

function detectSpecialRequirements(prompt: string): string[] {
  const requirements: string[] = [];
  
  if (/code|program|function/.test(prompt)) {
    requirements.push('code-generation');
  }
  if (/math|calculate|equation/.test(prompt)) {
    requirements.push('mathematical-computation');
  }
  if (/creative|imagine|story/.test(prompt)) {
    requirements.push('creativity');
  }
  
  return requirements;
}
