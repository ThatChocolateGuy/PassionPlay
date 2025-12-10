import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generatePromptRequestSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Generate a random truth or dare
  app.post("/api/generate", async (req, res) => {
    try {
      const parsed = generatePromptRequestSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parsed.error.errors 
        });
      }
      
      const { type, intensity, players } = parsed.data;
      const prompt = await storage.generatePrompt(type, intensity, players);
      
      return res.json(prompt);
    } catch (error) {
      console.error("Error generating prompt:", error);
      return res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  return httpServer;
}
