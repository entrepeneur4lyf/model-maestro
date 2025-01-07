import React from 'react';
import { Card } from '@/components/ui/card';
import { PromptAnalyzer } from './PromptAnalyzer';
import { ModelComparison } from './ModelComparison';
import { HistoryTracker } from './HistoryTracker';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import type { PromptAnalysis, ModelProfile, PerformanceRecord } from '@/lib/types';
import { findBestModel } from '@/lib/model-profiles';
import { modelProfiles } from '@/lib/model-profiles';
import { Loader2 } from 'lucide-react';

export function ModelRouter() {
  const [analysis, setAnalysis] = React.useState<PromptAnalysis | null>(null);
  const [selectedModel, setSelectedModel] = React.useState<ModelProfile | null>(null);
  const { toast } = useToast();

  // Fetch performance history with proper typing
  const { data: history = [], error: historyError, isLoading } = useQuery<PerformanceRecord[], Error>({
    queryKey: ['/api/performance/history'],
    enabled: true,
  });

  const handleAnalysis = async (newAnalysis: PromptAnalysis) => {
    setAnalysis(newAnalysis);

    try {
      const bestModelId = findBestModel(newAnalysis);
      const model = modelProfiles[bestModelId];

      if (!model) {
        throw new Error('No suitable model found');
      }

      setSelectedModel(model);

      toast({
        title: 'Analysis Complete',
        description: `Recommended model: ${model.name}`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Could not determine the best model',
        variant: 'destructive',
      });
    }
  };

  // Show error toast for history fetch errors
  React.useEffect(() => {
    if (historyError) {
      toast({
        title: 'Error Loading History',
        description: historyError.message,
        variant: 'destructive',
      });
    }
  }, [historyError, toast]);

  const alternativeModels = selectedModel 
    ? Object.values(modelProfiles)
        .filter(m => m.id !== selectedModel.id)
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">AI Model Router</h1>
        <PromptAnalyzer onAnalysis={handleAnalysis} />
      </Card>

      {selectedModel && analysis && (
        <ModelComparison
          selectedModel={selectedModel}
          alternativeModels={alternativeModels}
          confidence={0.8} // We'll implement dynamic confidence calculation later
        />
      )}

      <HistoryTracker
        history={history}
      />
    </div>
  );
}