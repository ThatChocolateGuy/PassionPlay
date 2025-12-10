import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// Database tables

// Custom prompts created by users
export const customPrompts = pgTable("custom_prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  intensity: text("intensity").notNull(),
  text: text("text").notNull(),
  category: text("category"),
  targetGender: text("target_gender"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCustomPromptSchema = createInsertSchema(customPrompts).omit({
  id: true,
  createdAt: true,
});

export type InsertCustomPrompt = z.infer<typeof insertCustomPromptSchema>;
export type CustomPrompt = typeof customPrompts.$inferSelect;

// Favorites - prompts users have starred
export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  promptText: text("prompt_text").notNull(),
  promptType: text("prompt_type").notNull(),
  intensity: text("intensity").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Zod schemas for runtime validation

// Gender enum
export const genderSchema = z.enum(["male", "female"]);
export type Gender = z.infer<typeof genderSchema>;

// Intensity levels
export const intensitySchema = z.enum(["mild", "spicy", "extreme"]);
export type Intensity = z.infer<typeof intensitySchema>;

// Couple schema
export const coupleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Couple name is required"),
  color: z.string().optional(),
});

export type Couple = z.infer<typeof coupleSchema>;

// Player schema with gender and couple
export const playerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  gender: genderSchema,
  coupleId: z.string().optional(),
});

export type Player = z.infer<typeof playerSchema>;

export const insertPlayerSchema = playerSchema.omit({ id: true });
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

// Truth/Dare prompt schema
export const promptSchema = z.object({
  id: z.string(),
  type: z.enum(["truth", "dare"]),
  intensity: intensitySchema,
  text: z.string(),
  category: z.string().optional(),
  isCustom: z.boolean().optional(),
});

export type Prompt = z.infer<typeof promptSchema>;

// Game session state
export const gameSessionSchema = z.object({
  players: z.array(playerSchema),
  couples: z.array(coupleSchema),
  currentPlayerIndex: z.number(),
  roundNumber: z.number(),
  turnCount: z.number(),
  intensity: intensitySchema,
  currentPrompt: promptSchema.nullable(),
  history: z.array(z.object({
    promptId: z.string(),
    playerId: z.string(),
    timestamp: z.number(),
  })),
});

export type GameSession = z.infer<typeof gameSessionSchema>;

// API request/response types
export const generatePromptRequestSchema = z.object({
  type: z.enum(["truth", "dare"]),
  intensity: intensitySchema,
  players: z.array(playerSchema),
  currentPlayerId: z.string(),
  excludeIds: z.array(z.string()).optional(),
});

export type GeneratePromptRequest = z.infer<typeof generatePromptRequestSchema>;
