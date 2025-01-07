import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceMeter } from './ConfidenceMeter';
import { ModelProfile, Provider } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star } from 'lucide-react';
import { ScoreBreakdownTooltip } from './ScoreBreakdownTooltip';
import type { ModelPreferences } from './ModelPreferences';
import { motion, AnimatePresence } from 'framer-motion';

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
    <motion.div 
      className="flex items-center gap-1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Star className="h-4 w-4 text-yellow-500" />
      <span className="text-sm font-medium">{name}:</span>
      <motion.span 
        className="text-sm text-muted-foreground"
        key={score}
        initial={{ scale: 1.2, color: '#10B981' }}
        animate={{ scale: 1, color: '#6B7280' }}
        transition={{ duration: 0.5 }}
      >
        {(score * 100).toFixed(0)}%
      </motion.span>
    </motion.div>
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
        <AnimatePresence mode="wait">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold">Recommended Model</h3>
            <motion.div 
              className="p-4 rounded-lg bg-primary/5"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
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

              <motion.div 
                className="mt-4 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
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

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h5 className="text-sm font-medium mb-2">Selection Factors:</h5>
                  <div className="space-y-2">
                    {selectionFactors.map((factor, index) => (
                      <motion.div 
                        key={factor} 
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {factor}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h5 className="text-sm font-medium mb-2">Best For:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedModel.bestFor.map((strength, index) => (
                      <motion.div
                        key={strength}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Badge variant="outline">
                          {strength}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Alternative Models</h3>
          {Object.entries(groupedAlternatives).map(([provider, models], groupIndex) => (
            <motion.div 
              key={provider} 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * groupIndex }}
            >
              <h4 className="text-sm font-medium text-muted-foreground mt-4">
                {provider} Models
              </h4>
              <div className="space-y-2">
                <AnimatePresence>
                  {models.map((model, index) => (
                    <motion.div
                      key={model.id}
                      className="p-4 rounded-lg bg-secondary/5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: 0.1 * index }}
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
                      <motion.div 
                        className="text-sm text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p>Context window: {model.contextWindow.toLocaleString()} tokens</p>
                        <p>Cost per token: ${model.costPerToken.toFixed(3)}</p>
                      </motion.div>
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}