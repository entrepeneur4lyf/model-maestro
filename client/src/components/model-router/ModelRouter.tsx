import React from 'react';
import { Card } from '@/components/ui/card';
import { PromptAnalyzer } from './PromptAnalyzer';
import { ModelComparison } from './ModelComparison';
import { HistoryTracker } from './HistoryTracker';
import { AnalysisDisplay } from './AnalysisDisplay';
import { ModelPreferences, type ModelPreferences as ModelPreferencesType } from './ModelPreferences';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import type { PromptAnalysis, ModelProfile, PerformanceRecord } from '@/lib/types';
import { findBestModel } from '@/lib/model-profiles';
import { modelProfiles } from '@/lib/model-profiles';
import { Loader2 } from 'lucide-react';

export function ModelRouter() {
  const [analysis, setAnalysis] = React.useState<PromptAnalysis | null>(null);
  const [selectedModel, setSelectedModel] = React.useState<ModelProfile | null>(null);
  const [confidence, setConfidence] = React.useState(0);
  const [selectionFactors, setSelectionFactors] = React.useState<string[]>([]);
  const [scoreBreakdown, setScoreBreakdown] = React.useState<any>(null);
  const [preferences, setPreferences] = React.useState<ModelPreferencesType>({
    prioritizeSpeed: false,
    costSensitivity: 50,
    reliabilityThreshold: 80,
    contextWindowImportance: 50,
  });

  const { toast } = useToast();

  const { data: history = [], error: historyError, isLoading } = useQuery<PerformanceRecord[], Error>({
    queryKey: ['/api/performance/history'],
    enabled: true,
  });

  const handleAnalysis = async (newAnalysis: PromptAnalysis) => {
    setAnalysis(newAnalysis);

    try {
      const { modelId, confidence: modelConfidence, factors, scoreBreakdown: breakdown } = findBestModel(newAnalysis, preferences);
      const model = modelProfiles[modelId];

      if (!model) {
        throw new Error('No suitable model found');
      }

      setSelectedModel(model);
      setConfidence(modelConfidence);
      setSelectionFactors(factors);
      setScoreBreakdown(breakdown);

      toast({
        title: 'Analysis Complete',
        description: `Recommended model: ${model.name} (${Math.round(modelConfidence * 100)}% confidence)`,
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

  // When preferences change, re-run analysis if we have one
  React.useEffect(() => {
    if (analysis) {
      handleAnalysis(analysis);
    }
  }, [preferences]);

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

      <ModelPreferences
        preferences={preferences}
        onChange={setPreferences}
      />

      {selectedModel && analysis && (
        <>
          <AnalysisDisplay
            analysis={analysis}
            selectedModel={selectedModel}
          />

          <ModelComparison
            selectedModel={selectedModel}
            alternativeModels={alternativeModels}
            confidence={confidence}
            selectionFactors={selectionFactors}
            scoreBreakdown={scoreBreakdown}
            preferences={preferences}
          />
        </>
      )}

      <HistoryTracker
        history={history}
      />
    </div>
  );
}