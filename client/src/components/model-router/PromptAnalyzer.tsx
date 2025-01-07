import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { analyzePrompt } from '@/lib/analyze-prompt';
import type { PromptAnalysis } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface Props {
  onAnalysis: (analysis: PromptAnalysis) => void;
}

export function PromptAnalyzer({ onAnalysis }: Props) {
  const [prompt, setPrompt] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const analysis = await analyzePrompt(prompt);
      onAnalysis(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your prompt here..."
        className="min-h-[150px] resize-none"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button
        className="w-full"
        onClick={handleAnalyze}
        disabled={!prompt || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze Prompt'
        )}
      </Button>
    </div>
  );
}