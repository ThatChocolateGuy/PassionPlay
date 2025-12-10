import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generatePromptRequestSchema, insertCustomPromptSchema, insertFavoriteSchema } from "@shared/schema";

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
      
      const { type, intensity, players, currentPlayerId, excludeIds } = parsed.data;
      const prompt = await storage.generatePrompt(type, intensity, players, currentPlayerId, excludeIds);
      
      return res.json(prompt);
    } catch (error) {
      console.error("Error generating prompt:", error);
      return res.status(500).json({ error: "Failed to generate prompt" });
    }
  });

  // Custom prompts CRUD
  app.get("/api/custom-prompts", async (req, res) => {
    try {
      const prompts = await storage.getCustomPrompts();
      return res.json(prompts);
    } catch (error) {
      console.error("Error fetching custom prompts:", error);
      return res.status(500).json({ error: "Failed to fetch custom prompts" });
    }
  });

  app.post("/api/custom-prompts", async (req, res) => {
    try {
      const parsed = insertCustomPromptSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request", details: parsed.error.errors });
      }
      const prompt = await storage.createCustomPrompt(parsed.data);
      return res.json(prompt);
    } catch (error) {
      console.error("Error creating custom prompt:", error);
      return res.status(500).json({ error: "Failed to create custom prompt" });
    }
  });

  app.delete("/api/custom-prompts/:id", async (req, res) => {
    try {
      await storage.deleteCustomPrompt(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error deleting custom prompt:", error);
      return res.status(500).json({ error: "Failed to delete custom prompt" });
    }
  });

  // Favorites CRUD
  app.get("/api/favorites", async (req, res) => {
    try {
      const favs = await storage.getFavorites();
      return res.json(favs);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const parsed = insertFavoriteSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request", details: parsed.error.errors });
      }
      const fav = await storage.addFavorite(parsed.data);
      return res.json(fav);
    } catch (error) {
      console.error("Error adding favorite:", error);
      return res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      await storage.removeFavorite(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error removing favorite:", error);
      return res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  return httpServer;
}
