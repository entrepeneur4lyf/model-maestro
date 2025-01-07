import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { performanceRecords } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

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
      res.status(500).json({ 
        message: "Failed to record performance" 
      });
    }
  });

  // Get performance history
  app.get("/api/performance/history", async (_req, res) => {
    try {
      const records = await db.query.performanceRecords.findMany({
        orderBy: (records, { desc }) => [desc(records.createdAt)],
        limit: 10
      });

      res.json(records);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch performance records" 
      });
    }
  });

  return httpServer;
}