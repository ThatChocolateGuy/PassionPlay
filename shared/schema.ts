import { z } from "zod";

// Intensity levels for truths and dares
export type Intensity = "mild" | "spicy" | "extreme";

// Player schema
export const playerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
});

export type Player = z.infer<typeof playerSchema>;

export const insertPlayerSchema = playerSchema.omit({ id: true });
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;

// Truth/Dare prompt schema
export const promptSchema = z.object({
  id: z.string(),
  type: z.enum(["truth", "dare"]),
  intensity: z.enum(["mild", "spicy", "extreme"]),
  text: z.string(),
});

export type Prompt = z.infer<typeof promptSchema>;

// Game state schema
export const gameStateSchema = z.object({
  players: z.array(playerSchema),
  currentIntensity: z.enum(["mild", "spicy", "extreme"]),
  currentPrompt: promptSchema.nullable(),
});

export type GameState = z.infer<typeof gameStateSchema>;

// API request/response types
export const generatePromptRequestSchema = z.object({
  type: z.enum(["truth", "dare"]),
  intensity: z.enum(["mild", "spicy", "extreme"]),
  players: z.array(z.string()),
});

export type GeneratePromptRequest = z.infer<typeof generatePromptRequestSchema>;
