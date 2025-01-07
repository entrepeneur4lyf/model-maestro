import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PerformanceRecord } from '@/lib/types';
import { modelProfiles } from '@db/schema';
import { useQuery } from '@tanstack/react-query';

interface Props {
  history: PerformanceRecord[];
}

export function HistoryTracker({ history }: Props) {
  const { data: profiles = [] } = useQuery({
    queryKey: ['/api/model-profiles'],
    enabled: true,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Analysis History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4">
          <div className="space-y-4">
            {history.map((entry) => {
              // Handle null modelId case
              if (entry.modelId === null) {
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Analysis Request</span>
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
                );
              }

              const model = profiles.find((p: { id: number }) => p.id === entry.modelId);
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {model ? model.name : `Model ${entry.modelId}`}
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
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}