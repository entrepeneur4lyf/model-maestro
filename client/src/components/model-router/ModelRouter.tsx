import React from 'react';
import { Card } from '@/components/ui/card';
import { PromptAnalyzer } from './PromptAnalyzer';
import { AnalysisDisplay } from './AnalysisDisplay';
import { PerformanceMetrics } from './PerformanceMetrics';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import type { PromptAnalysis, ModelProfile } from '@/lib/types';
import { findBestModel } from '@/lib/model-profiles';
import { modelProfiles } from '@/lib/model-profiles';

export function ModelRouter() {
  const [analysis, setAnalysis] = React.useState<PromptAnalysis | null>(null);
  const [selectedModel, setSelectedModel] = React.useState<ModelProfile | null>(null);
  const { toast } = useToast();

  // Fetch performance metrics
  const { data: performanceData } = useQuery({
    queryKey: ['/api/performance/metrics'],
    enabled: !!selectedModel,
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
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Could not determine the best model',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">AI Model Router</h1>
        <PromptAnalyzer onAnalysis={handleAnalysis} />
      </Card>

      {analysis && selectedModel && (
        <AnalysisDisplay
          analysis={analysis}
          selectedModel={selectedModel}
        />
      )}

      {performanceData && (
        <PerformanceMetrics
          data={performanceData}
          selectedModel={selectedModel?.id}
        />
      )}
    </div>
  );
}
