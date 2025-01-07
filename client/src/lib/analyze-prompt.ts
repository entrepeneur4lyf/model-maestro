import type { PromptAnalysis } from './types';

export async function analyzePrompt(prompt: string): Promise<PromptAnalysis> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze prompt');
  }

  return response.json();
}