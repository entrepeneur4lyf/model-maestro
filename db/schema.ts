import { pgTable, text, serial, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const modelProfiles = pgTable("model_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").unique().notNull(),
  strengths: jsonb("strengths").$type<string[]>().notNull(),
  contextWindow: integer("context_window").notNull(),
  specialties: jsonb("specialties").$type<string[]>().notNull(),
  costPerToken: integer("cost_per_token").notNull(),
  reliabilityScore: integer("reliability_score").notNull(),
});

export const performanceRecords = pgTable("performance_records", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").references(() => modelProfiles.id),
  promptType: text("prompt_type").notNull(),
  executionTime: integer("execution_time").notNull(),
  tokenCount: integer("token_count").notNull(),
  userRating: integer("user_rating"),
  success: boolean("success").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
});

export type ModelProfile = typeof modelProfiles.$inferSelect;
export type PerformanceRecord = typeof performanceRecords.$inferSelect;