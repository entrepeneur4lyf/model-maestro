import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { PromptAnalysis, ModelProfile } from '@/lib/types';

interface Props {
  analysis: PromptAnalysis;
  selectedModel: ModelProfile;
}

export function AnalysisDisplay({ analysis, selectedModel }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Task Analysis</h3>
          <div className="grid gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Task Type</span>
                <Badge>{analysis.taskType}</Badge>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Complexity</span>
                <Progress value={analysis.complexity * 100} className="w-1/2" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Selected Model: {selectedModel.name}</h3>
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              {selectedModel.strengths.map((strength) => (
                <Badge key={strength} variant="secondary">
                  {strength}
                </Badge>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Context Window: {selectedModel.contextWindow.toLocaleString()} tokens</p>
              <p>Reliability Score: {(selectedModel.reliabilityScore * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {analysis.specialRequirements.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Special Requirements</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.specialRequirements.map((req) => (
                <Badge key={req} variant="outline">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
