import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceMeter } from './ConfidenceMeter';
import { ModelProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface Props {
  selectedModel: ModelProfile;
  alternativeModels: ModelProfile[];
  confidence: number;
}

export function ModelComparison({ 
  selectedModel, 
  alternativeModels,
  confidence 
}: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Model Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
              <div className="mt-4">
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
                    Context window: {model.contextWindow.toLocaleString()} tokens
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
