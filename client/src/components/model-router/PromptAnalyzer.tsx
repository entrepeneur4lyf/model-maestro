import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { analyzePrompt } from '@/lib/analyze-prompt';
import type { PromptAnalysis } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '@/lib/utils';

interface Props {
  onAnalysis: (analysis: PromptAnalysis) => void;
}

export function PromptAnalyzer({ onAnalysis }: Props) {
  const [prompt, setPrompt] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = React.useState(0);
  const [pullDistance, setPullDistance] = React.useState(0);
  const maxPullDistance = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (formRef.current?.scrollTop === 0) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart > 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, Math.min(currentY - touchStart, maxPullDistance));
      setPullDistance(distance);

      // Provide light haptic feedback at 50% and 100% of pull distance
      if (distance >= maxPullDistance * 0.5 && distance < maxPullDistance * 0.51) {
        triggerHaptic('light');
      } else if (distance >= maxPullDistance * 0.95) {
        triggerHaptic('medium');
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= maxPullDistance) {
      setPrompt('');
      triggerHaptic('success');
      toast({
        title: 'Prompt Cleared',
        description: 'You can now enter a new prompt.',
      });
    }
    setTouchStart(0);
    setPullDistance(0);
  };

  const handleAnalyze = async () => {
    triggerHaptic('selection');
    setLoading(true);
    try {
      console.log('Analyzing prompt:', prompt);
      const analysis = await analyzePrompt(prompt);
      console.log('Analysis result:', analysis);

      triggerHaptic('success');
      onAnalysis(analysis);
      toast({
        title: 'Analysis Complete',
        description: `Task type: ${analysis.taskType}, Complexity: ${Math.round(analysis.complexity * 100)}%`,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      triggerHaptic('error');
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze prompt',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      ref={formRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${pullDistance}px)`,
        transition: touchStart ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      <motion.div
        initial={false}
        animate={{
          scale: loading ? 0.98 : 1,
          opacity: loading ? 0.8 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <Textarea
          placeholder="Enter your prompt here (e.g., 'Write a function to sort an array' or 'Analyze this dataset')"
          className="min-h-[150px] resize-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            className="w-full relative overflow-hidden"
            onClick={handleAnalyze}
            disabled={!prompt || loading}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </motion.div>
              ) : (
                <motion.span
                  key="analyze"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  Analyze Prompt
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </AnimatePresence>

      {pullDistance > 0 && (
        <motion.div 
          className="absolute top-0 left-0 w-full flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: pullDistance / maxPullDistance }}
        >
          <span className="text-sm text-muted-foreground">
            {pullDistance >= maxPullDistance ? 'Release to clear' : 'Pull down to clear'}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}