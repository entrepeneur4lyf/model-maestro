import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PerformanceRecord } from '@/lib/types';
import { modelProfiles } from '@/lib/model-profiles';

interface Props {
  history: PerformanceRecord[];
}

export function HistoryTracker({ history }: Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Analysis History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/5"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {modelProfiles[entry.modelId]?.name || 'Unknown Model'}
                    </span>
                    <Badge variant={entry.success ? "outline" : "destructive"}>
                      {entry.success ? "Success" : "Failed"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entry.promptType} - {entry.executionTime}ms
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}