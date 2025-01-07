import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  confidence: number;
  modelName: string;
}

export function ConfidenceMeter({ confidence, modelName }: Props) {
  const confidencePercent = Math.round(confidence * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Confidence Score for {modelName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={confidencePercent} />
          <p className="text-sm text-muted-foreground text-right">
            {confidencePercent}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
