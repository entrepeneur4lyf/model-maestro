import * as React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface ScoreComponent {
  label: string;
  score: number;
  description: string;
  color?: string;
}

interface Props {
  breakdown: {
    taskMatch: number;
    contextScore: number;
    speedBonus: number;
    costScore: number;
    reliabilityScore: number;
    specialtyMatch: number;
  };
  preferences: {
    prioritizeSpeed: boolean;
    costSensitivity: number;
    reliabilityThreshold: number;
    contextWindowImportance: number;
  };
}

export function ScoreBreakdownTooltip({ breakdown, preferences }: Props) {
  const components: ScoreComponent[] = [
    {
      label: 'Task Match',
      score: breakdown.taskMatch,
      description: 'Points for matching the task type',
      color: 'bg-blue-500'
    },
    {
      label: 'Context Score',
      score: breakdown.contextScore,
      description: `Based on context window requirements (${(preferences.contextWindowImportance || 0).toFixed(0)}% importance)`,
      color: 'bg-green-500'
    },
    {
      label: 'Speed Bonus',
      score: breakdown.speedBonus,
      description: preferences.prioritizeSpeed ? 'Speed priority is active (+2 points)' : 'Speed priority is inactive',
      color: 'bg-yellow-500'
    },
    {
      label: 'Cost Score',
      score: breakdown.costScore,
      description: `Cost sensitivity set to ${preferences.costSensitivity}%`,
      color: 'bg-purple-500'
    },
    {
      label: 'Reliability',
      score: breakdown.reliabilityScore,
      description: `Minimum reliability threshold: ${preferences.reliabilityThreshold}%`,
      color: 'bg-red-500'
    },
    {
      label: 'Special Match',
      score: breakdown.specialtyMatch,
      description: 'Points for matching special requirements',
      color: 'bg-orange-500'
    }
  ];

  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <Info className="h-4 w-4" />
          <span className="ml-1 text-sm">Score Details</span>
        </TooltipTrigger>
        <TooltipContent 
          className="w-80 p-0" 
          align="start"
          sideOffset={5}
        >
          <div className="p-4 space-y-3">
            <h4 className="font-medium">Score Breakdown</h4>
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {components.map(({ label, score, description, color }) => (
                  score > 0 && (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-sm">
                        <span>{label}</span>
                        <motion.span
                          key={score}
                          initial={{ scale: 1.2, color: '#10B981' }}
                          animate={{ scale: 1, color: '#6B7280' }}
                          transition={{ duration: 0.3 }}
                        >
                          +{score.toFixed(1)}
                        </motion.span>
                      </div>
                      <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className={`absolute inset-y-0 left-0 ${color || 'bg-primary'} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(0, Math.min(100, (score / totalScore) * 100))}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
              <div className="border-t mt-2 pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Score</span>
                  <motion.span
                    key={totalScore}
                    initial={{ scale: 1.2, color: '#10B981' }}
                    animate={{ scale: 1, color: '#000000' }}
                    transition={{ duration: 0.3 }}
                  >
                    {totalScore.toFixed(1)}
                  </motion.span>
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}