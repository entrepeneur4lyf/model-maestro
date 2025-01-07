import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceMeter } from './ConfidenceMeter';
import { ModelProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

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
}

export function ModelComparison({ 
  selectedModel, 
  alternativeModels,
  confidence,
  selectionFactors,
  scoreBreakdown
}: Props) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);

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
              <h4 className="font-medium">{selectedModel.name}</h4>
              <Badge variant="secondary">
                {selectedModel.averageSpeed} speed
              </Badge>
            </div>

            <ConfidenceMeter 
              confidence={confidence} 
              modelName={selectedModel.name} 
            />

            <div className="mt-4 space-y-4">
              <div>
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Selection Score Breakdown
                  {showBreakdown ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {showBreakdown && scoreBreakdown && (
                  <div className="mt-2 space-y-1 text-sm">
                    {scoreBreakdown.taskMatch > 0 && (
                      <div className="flex justify-between">
                        <span>Task Match:</span>
                        <span>+{scoreBreakdown.taskMatch.toFixed(1)}</span>
                      </div>
                    )}
                    {scoreBreakdown.contextScore > 0 && (
                      <div className="flex justify-between">
                        <span>Context Window:</span>
                        <span>+{scoreBreakdown.contextScore.toFixed(1)}</span>
                      </div>
                    )}
                    {scoreBreakdown.speedBonus > 0 && (
                      <div className="flex justify-between">
                        <span>Speed Bonus:</span>
                        <span>+{scoreBreakdown.speedBonus.toFixed(1)}</span>
                      </div>
                    )}
                    {scoreBreakdown.costScore > 0 && (
                      <div className="flex justify-between">
                        <span>Cost Efficiency:</span>
                        <span>+{scoreBreakdown.costScore.toFixed(1)}</span>
                      </div>
                    )}
                    {scoreBreakdown.reliabilityScore > 0 && (
                      <div className="flex justify-between">
                        <span>Reliability:</span>
                        <span>+{scoreBreakdown.reliabilityScore.toFixed(1)}</span>
                      </div>
                    )}
                    {scoreBreakdown.specialtyMatch > 0 && (
                      <div className="flex justify-between">
                        <span>Special Requirements:</span>
                        <span>+{scoreBreakdown.specialtyMatch.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="border-t pt-1 mt-1 font-medium">
                      <div className="flex justify-between">
                        <span>Total Score:</span>
                        <span>
                          {Object.values(scoreBreakdown)
                            .reduce((a, b) => a + b, 0)
                            .toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
          <div className="space-y-4">
            {alternativeModels.map((model) => (
              <div 
                key={model.id} 
                className="p-4 rounded-lg bg-secondary/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{model.name}</h4>
                  <Badge variant="secondary">
                    {model.averageSpeed} speed
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Context window: {model.contextWindow.toLocaleString()} tokens</p>
                  <p>Cost per token: ${model.costPerToken.toFixed(3)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}