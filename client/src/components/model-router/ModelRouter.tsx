import React from 'react';
import { Card } from '@/components/ui/card';
import { PromptAnalyzer } from './PromptAnalyzer';
import { ModelComparison } from './ModelComparison';
import { HistoryTracker } from './HistoryTracker';
import { AnalysisDisplay } from './AnalysisDisplay';
import { ModelPreferences, type ModelPreferences as ModelPreferencesType } from './ModelPreferences';
import { Grid } from '@/components/ui/grid';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  const { data: history = [], error: historyError, isLoading } = useQuery<PerformanceRecord[], Error>({
    queryKey: ['/api/performance/history'],
    enabled: true,
  });

  const recordPerformanceMutation = useMutation({
    mutationFn: async (performanceData: Omit<PerformanceRecord, 'id' | 'createdAt'>) => {
      const response = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(performanceData),
      });

      if (!response.ok) {
        throw new Error('Failed to record performance');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/performance/history'] });
    },
    onError: (error) => {
      console.error('Failed to record performance:', error);
      toast({
        title: 'Error',
        description: 'Failed to record performance data',
        variant: 'destructive',
      });
    },
  });

  const handleAnalysis = async (newAnalysis: PromptAnalysis) => {
    setAnalysis(newAnalysis);
    const startTime = Date.now();

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

      // Record the performance
      await recordPerformanceMutation.mutateAsync({
        modelId: parseInt(model.id),
        promptType: newAnalysis.taskType,
        executionTime: Date.now() - startTime,
        tokenCount: newAnalysis.tokens,
        success: true,
        prompt: JSON.stringify(newAnalysis),
        response: JSON.stringify({
          modelId,
          confidence: modelConfidence,
          factors,
          scoreBreakdown: breakdown
        })
      });

      toast({
        title: 'Analysis Complete',
        description: `Recommended model: ${model.name} (${Math.round(modelConfidence * 100)}% confidence)`,
      });
    } catch (error) {
      console.error('Analysis error:', error);

      // Record the failure
      await recordPerformanceMutation.mutateAsync({
        modelId: 0,
        promptType: newAnalysis.taskType,
        executionTime: Date.now() - startTime,
        tokenCount: newAnalysis.tokens,
        success: false,
        prompt: JSON.stringify(newAnalysis),
        response: error instanceof Error ? error.message : 'Analysis failed'
      });

      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Could not determine the best model',
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    if (historyError) {
      toast({
        title: 'Error Loading History',
        description: historyError.message,
        variant: 'destructive',
      });
    }
  }, [historyError, toast]);

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
    <div className="fixed inset-0 bg-background overflow-y-auto overflow-x-hidden overscroll-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] space-y-4 sm:space-y-6 w-full">
        <Card className="p-4 sm:p-6 w-full rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6 pt-[env(safe-area-inset-top)] leading-tight">AI Model Router</h1>
          <PromptAnalyzer onAnalysis={handleAnalysis} />
        </Card>

        <Grid 
          columns={{ 
            default: 1, 
            md: 2 
          }} 
          gap="4"
          className="items-start"
        >
          <ModelPreferences
            preferences={preferences}
            onChange={setPreferences}
          />

          {selectedModel && analysis && (
            <AnalysisDisplay
              analysis={analysis}
              selectedModel={selectedModel}
            />
          )}
        </Grid>

        {selectedModel && analysis && (
          <ModelComparison
            selectedModel={selectedModel}
            alternativeModels={alternativeModels}
            confidence={confidence}
            selectionFactors={selectionFactors}
            scoreBreakdown={scoreBreakdown}
            preferences={preferences}
          />
        )}

        <Grid 
          columns={{ 
            default: 1, 
            lg: 2 
          }} 
          gap="4"
          className="items-start pb-[env(safe-area-inset-bottom)]"
        >
          <HistoryTracker
            history={history}
          />
        </Grid>
      </div>
    </div>
  );
}