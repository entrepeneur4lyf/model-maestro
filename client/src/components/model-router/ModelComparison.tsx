import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceMeter } from './ConfidenceMeter';
import { ModelProfile, Provider } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star } from 'lucide-react';
import { ScoreBreakdownTooltip } from './ScoreBreakdownTooltip';
import type { ModelPreferences } from './ModelPreferences';

interface Props {
  selectedModel: ModelProfile;
  alternativeModels: ModelProfile[];
  confidence: number;
  selectionFactors: string[];
  scoreBreakdown?: {
    taskMatch: number;
    contextScore: number;
    speedBonus: number;
    costScore: number;
    reliabilityScore: number;
    specialtyMatch: number;
  };
  preferences: ModelPreferences;
}

const providerColors: Record<Provider, string> = {
  'OpenAI': 'bg-green-100 text-green-800',
  'Anthropic': 'bg-blue-100 text-blue-800',
  'Google': 'bg-yellow-100 text-yellow-800',
  'DeepSeek': 'bg-purple-100 text-purple-800',
  'Other': 'bg-gray-100 text-gray-800'
};

function BenchmarkScore({ name, score }: { name: string; score: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 text-yellow-500" />
      <span className="text-sm font-medium">{name}:</span>
      <span className="text-sm text-muted-foreground">{(score * 100).toFixed(0)}%</span>
    </div>
  );
}

export function ModelComparison({
  selectedModel,
  alternativeModels,
  confidence,
  selectionFactors,
  scoreBreakdown,
  preferences
}: Props) {
  // Group alternative models by provider
  const groupedAlternatives = alternativeModels.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<Provider, ModelProfile[]>);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Model Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Recommended Model</h3>
          <div className="p-4 rounded-lg bg-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{selectedModel.name}</h4>
                <Badge
                  variant="secondary"
                  className={providerColors[selectedModel.provider]}
                >
                  {selectedModel.provider}
                </Badge>
              </div>
              <Badge variant="secondary">
                {selectedModel.averageSpeed} speed
              </Badge>
            </div>

            <ConfidenceMeter
              confidence={confidence}
              modelName={selectedModel.name}
            />

            <div className="mt-4 space-y-4">
              {scoreBreakdown && (
                <div className="flex items-center gap-2">
                  <ScoreBreakdownTooltip
                    breakdown={scoreBreakdown}
                    preferences={preferences}
                  />
                </div>
              )}

              {selectedModel.benchmarks && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.entries(selectedModel.benchmarks).map(([key, value]) => (
                    <BenchmarkScore
                      key={key}
                      name={key.replace(/([A-Z])/g, ' $1').trim()}
                      score={value}
                    />
                  ))}
                </div>
              )}

              <div>
                <h5 className="text-sm font-medium mb-2">Selection Factors:</h5>
                <div className="space-y-2">
                  {selectionFactors.map((factor) => (
                    <div key={factor} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {factor}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Best For:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.bestFor.map((strength) => (
                    <Badge key={strength} variant="outline">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Alternative Models</h3>
          {Object.entries(groupedAlternatives).map(([provider, models]) => (
            <div key={provider} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground mt-4">
                {provider} Models
              </h4>
              <div className="space-y-2">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="p-4 rounded-lg bg-secondary/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{model.name}</h4>
                        <Badge
                          variant="secondary"
                          className={providerColors[model.provider]}
                        >
                          {model.provider}
                        </Badge>
                      </div>
                      <Badge variant="secondary">
                        {model.averageSpeed} speed
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Context window: {model.contextWindow.toLocaleString()} tokens</p>
                      <p>Cost per token: ${model.costPerToken.toFixed(3)}</p>
                    </div>
                    {model.benchmarks && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {Object.entries(model.benchmarks).map(([key, value]) => (
                          <BenchmarkScore
                            key={key}
                            name={key.replace(/([A-Z])/g, ' $1').trim()}
                            score={value}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}