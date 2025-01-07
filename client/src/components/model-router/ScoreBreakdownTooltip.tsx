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
  };
}

export function ScoreBreakdownTooltip({ breakdown, preferences }: Props) {
  const components: ScoreComponent[] = [
    {
      label: 'Task Match',
      score: breakdown.taskMatch,
      description: 'Points for matching the task type'
    },
    {
      label: 'Context Score',
      score: breakdown.contextScore,
      description: 'Based on context window requirements'
    },
    {
      label: 'Speed Bonus',
      score: breakdown.speedBonus,
      description: preferences.prioritizeSpeed ? 'Speed priority is active (+2)' : 'Speed priority is inactive'
    },
    {
      label: 'Cost Score',
      score: breakdown.costScore,
      description: `Cost sensitivity at ${preferences.costSensitivity}%`
    },
    {
      label: 'Reliability',
      score: breakdown.reliabilityScore,
      description: `Minimum reliability: ${preferences.reliabilityThreshold}%`
    },
    {
      label: 'Special Match',
      score: breakdown.specialtyMatch,
      description: 'Points for matching special requirements'
    }
  ];

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <Info className="h-4 w-4" />
          <span className="ml-1 text-sm">Score Details</span>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-0" align="start">
          <div className="p-4 space-y-3">
            <h4 className="font-medium">Score Breakdown</h4>
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                {components.map(({ label, score, description }) => (
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
                        <span>+{score.toFixed(1)}</span>
                      </div>
                      <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(score / 2) * 100}%` }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
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
                  <span>
                    {Object.values(breakdown).reduce((a, b) => a + b, 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
