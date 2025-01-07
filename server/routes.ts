import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { performanceRecords } from "@db/schema";
import { eq } from "drizzle-orm";
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();

const TASK_KEYWORDS = {
  coding: ['code', 'function', 'program', 'algorithm', 'debug'],
  writing: ['write', 'essay', 'article', 'blog', 'content'],
  analysis: ['analyze', 'evaluate', 'research', 'study', 'investigate'],
  math: ['calculate', 'solve', 'equation', 'math', 'formula'],
  general: ['explain', 'describe', 'help', 'tell', 'what']
};

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Analyze prompt endpoint
  app.post("/api/analyze", async (req, res) => {
    const startTime = Date.now();
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const tokens = tokenizer.tokenize(prompt.toLowerCase());

      // Task classification
      const taskScores = Object.entries(TASK_KEYWORDS).map(([task, keywords]) => {
        const score = keywords.reduce((acc, keyword) => 
          acc + (tokens.includes(keyword) ? 1 : 0), 0);
        return { task, score };
      });

      const taskType = taskScores.reduce((a, b) => 
        a.score > b.score ? a : b).task;

      // Calculate complexity
      const complexity = calculateComplexity(prompt, tokens);

      // Estimate context
      const contextNeeded = estimateContext(tokens);

      // Detect special requirements
      const specialRequirements = detectSpecialRequirements(prompt);

      const analysis = {
        taskType,
        complexity,
        contextNeeded,
        tokens: tokens.length,
        specialRequirements
      };

      // Record the analysis performance
      await db.insert(performanceRecords).values({
        modelId: 0, // We'll update this when a model is selected
        promptType: taskType,
        executionTime: Date.now() - startTime,
        tokenCount: tokens.length,
        success: true,
        prompt,
        response: JSON.stringify(analysis)
      });

      res.json(analysis);
    } catch (error) {
      console.error('Analysis error:', error);

      // Record the failed analysis
      await db.insert(performanceRecords).values({
        modelId: 0,
        promptType: 'unknown',
        executionTime: Date.now() - startTime,
        tokenCount: 0,
        success: false,
        prompt: req.body.prompt || '',
        response: error instanceof Error ? error.message : 'Unknown error'
      });

      res.status(500).json({ message: "Failed to analyze prompt" });
    }
  });

  // Record model performance
  app.post("/api/performance", async (req, res) => {
    try {
      const record = await db.insert(performanceRecords).values({
        modelId: req.body.modelId,
        promptType: req.body.promptType,
        executionTime: req.body.executionTime,
        tokenCount: req.body.tokenCount,
        userRating: req.body.userRating,
        success: req.body.success,
        prompt: req.body.prompt,
        response: req.body.response
      });

      res.json({ success: true, record });
    } catch (error) {
      console.error('Performance recording error:', error);
      res.status(500).json({ 
        message: "Failed to record performance",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get performance history with enhanced details
  app.get("/api/performance/history", async (_req, res) => {
    try {
      const records = await db.query.performanceRecords.findMany({
        orderBy: (records, { desc }) => [desc(records.createdAt)],
        limit: 10
      });

      res.json(records);
    } catch (error) {
      console.error('History fetch error:', error);
      res.status(500).json({ 
        message: "Failed to fetch performance records",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return httpServer;
}

function calculateComplexity(prompt: string, tokens: string[]): number {
  const factors = [
    tokens.length / 100, // Length factor
    prompt.split('.').length / 5, // Sentence complexity
    new Set(tokens).size / tokens.length, // Vocabulary diversity
  ];

  return Math.min(1, factors.reduce((a, b) => a + b) / 3);
}

function estimateContext(tokens: string[]): number {
  const contextFactors = [
    tokens.includes('previous') || tokens.includes('before'),
    tokens.includes('context') || tokens.includes('background'),
    tokens.length > 50
  ];

  return contextFactors.filter(Boolean).length / contextFactors.length;
}

function detectSpecialRequirements(prompt: string): string[] {
  const requirements: string[] = [];

  if (/code|program|function/.test(prompt)) {
    requirements.push('code-generation');
  }
  if (/math|calculate|equation/.test(prompt)) {
    requirements.push('mathematical-computation');
  }
  if (/creative|imagine|story/.test(prompt)) {
    requirements.push('creativity');
  }

  return requirements;
}