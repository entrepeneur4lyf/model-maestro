import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { PerformanceMetrics as Metrics } from '@/lib/types';

interface Props {
  data: Metrics;
  selectedModel?: string;
}

export function PerformanceMetrics({ data, selectedModel }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm text-muted-foreground">
                {(data.successRate * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={data.successRate * 100} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Average Rating</span>
              <span className="text-sm text-muted-foreground">
                {(data.averageRating * 5).toFixed(1)}/5
              </span>
            </div>
            <Progress value={data.averageRating * 100} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Average Response Time</span>
              <span className="text-sm text-muted-foreground">
                {data.averageExecutionTime}ms
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
