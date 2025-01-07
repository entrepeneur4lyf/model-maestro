import React from 'react';
import { PromptAnalyzer } from '@/components/model-router/PromptAnalyzer';
import { ModelComparison } from '@/components/model-router/ModelComparison';
import { HistoryTracker } from '@/components/model-router/HistoryTracker';
import { findBestModel } from '@/lib/model-profiles';
import { modelProfiles } from '@/lib/model-profiles';
import { PromptAnalysis, ModelProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [analysis, setAnalysis] = React.useState<PromptAnalysis | null>(null);
  const [selectedModel, setSelectedModel] = React.useState<ModelProfile | null>(null);
  const [confidence, setConfidence] = React.useState(0);
  const { toast } = useToast();

  // Fetch performance history
  const { data: history = [] } = useQuery({
    queryKey: ['/api/performance/history'],
    enabled: false, // Only fetch when needed
  });

  const handleAnalysis = (newAnalysis: PromptAnalysis) => {
    setAnalysis(newAnalysis);

    try {
      const bestModelId = findBestModel(newAnalysis);
      const model = modelProfiles[bestModelId];

      if (!model) {
        throw new Error('No suitable model found');
      }

      setSelectedModel(model);

      // Calculate confidence based on analysis factors
      const confidenceScore = calculateConfidence(newAnalysis, model);
      setConfidence(confidenceScore);

      toast({
        title: 'Analysis Complete',
        description: `Recommended model: ${model.name}`,
      });
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Could not determine the best model',
        variant: 'destructive',
      });
    }
  };

  const calculateConfidence = (
    analysis: PromptAnalysis, 
    model: ModelProfile
  ): number => {
    const factors = [
      model.specialties.includes(analysis.taskType) ? 0.4 : 0,
      model.contextWindow >= analysis.tokens * 2 ? 0.3 : 0,
      model.reliabilityScore * 0.3
    ];

    return factors.reduce((a, b) => a + b);
  };

  const alternativeModels = selectedModel 
    ? Object.values(modelProfiles)
        .filter(m => m.id !== selectedModel.id)
    : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <PromptAnalyzer onAnalysis={handleAnalysis} />

        {selectedModel && (
          <ModelComparison
            selectedModel={selectedModel}
            alternativeModels={alternativeModels}
            confidence={confidence}
          />
        )}

        <HistoryTracker
          history={history}
        />
      </div>
    </div>
  );
}