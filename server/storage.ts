import type { Intensity, Prompt, Player, CustomPrompt, InsertCustomPrompt, Favorite, InsertFavorite, SexualPreference } from "@shared/schema";
import { customPrompts, favorites } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Gender-aware truth and dare content library
// Placeholders: {player}, {male_player}, {female_player}, {partner}, {other_couple_member}
const truths: Record<Intensity, string[]> = {
  mild: [
    "What's the naughtiest thought you've had about {player} in this room?",
    "What's your biggest turn-on that you've never told {partner}?",
    "Have you ever fantasized about {player}?",
    "What's the most embarrassing thing that's happened to you during intimacy?",
    "What's your secret guilty pleasure when it comes to flirting?",
    "Have you ever sent a dirty text to the wrong person?",
    "What's the weirdest place you've ever been intimate?",
    "What's your favorite body part on {partner}?",
    "Have you ever faked it? Why?",
    "What's the most adventurous thing on your bedroom bucket list?",
    "Have you ever had a crush on {player}?",
    "What's the sexiest dream you've ever had about someone here?",
    "What's something you've always wanted to try but been too shy to ask {partner} for?",
    "Have you ever been caught in a compromising position?",
    "What outfit does {partner} wear that drives you wild?",
    "What's the longest you've ever gone without it?",
    "Have you ever skinny dipped? With who?",
    "What's your favorite time of day to be intimate?",
    "Have you ever role-played? What was the scenario?",
    "What song puts you in the mood instantly?",
    "If you had to kiss {male_player} or {female_player}, who would you choose?",
    "What would you do if {player} walked in on you naked right now?",
  ],
  spicy: [
    "Describe in detail your hottest sexual experience ever.",
    "What's the dirtiest fantasy you've had about {player}?",
    "Have you ever had a threesome? If not, who in this room would you choose?",
    "What's the kinkiest thing you've ever done?",
    "Rate {male_player} and {female_player} from 1-10 on how attracted you are to them.",
    "Have you ever been with someone of the same sex? Would you try it with {player}?",
    "What's your favorite position and would you try it with {player}?",
    "Have you ever watched adult content with {partner}? What kind?",
    "What's the most public place you've ever been intimate?",
    "Do you have any fetishes you haven't told {partner} about?",
    "Have you ever been to a sex club or swingers party?",
    "What's the naughtiest thing you've ever done at work?",
    "Have you ever been intimate with more than one person in the same day?",
    "What's your experience with toys? Would you use one on {player}?",
    "Have you ever sent or received explicit photos from someone other than {partner}?",
    "What's the longest session you've ever had?",
    "Would you ever have a friends-with-benefits situation with {player}?",
    "What's something you've done that you'd never admit to your family?",
    "Have you ever been attracted to {player} while with {partner}?",
    "Would you watch {male_player} and {female_player} together?",
    "Have you ever been tied up or would you let {player} tie you up?",
    "Describe your ultimate sexual fantasy involving {player}.",
    "What would you do to {female_player} if you had permission?",
    "What would you let {male_player} do to you?",
    "What's the most spontaneous sexual thing you'd do with {player} right now?",
  ],
  extreme: [
    "Demonstrate your best oral technique on your finger while making eye contact with {player}.",
    "What's your most taboo fantasy involving someone in this room?",
    "Would you participate in group activities with everyone here? Describe how it would go.",
    "What's the kinkiest thing you want to do to {female_player}?",
    "Describe exactly what you'd do to {male_player} if you had one night with them.",
    "Have you ever been involved in BDSM? Would you try it with {player}?",
    "What's the most explicit message you've ever sent? Read it aloud.",
    "Would you be with {player} and {partner} together?",
    "Would you let {player} watch you and {partner}?",
    "Rate {player}'s body from 1-10 and explain your rating in detail.",
    "What's your most secret sexual desire involving {male_player}?",
    "Have you ever been intimate in front of others? Would you do it now?",
    "Describe in graphic detail your ideal encounter with {female_player}.",
    "Would you swap partners with another couple here tonight?",
    "How would you use food on {player} during intimacy?",
    "Would you dominate or be dominated by {player}?",
    "Would you let {partner} be with {player} while you watched?",
    "Show the group the most suggestive photo on your phone.",
    "Role-play meeting {player} as a stranger. How would you take them home?",
    "Describe exactly how you like to receive pleasure - demonstrate on {player}'s hand.",
    "What's the dirtiest thing you'd say to {female_player} in the bedroom?",
    "Would you let {male_player} choke you during intimacy?",
    "What boundaries would you break with {player} tonight?",
    "Describe your most intense orgasm - was it with {partner}?",
    "What would you do with {male_player} and {female_player} together if there were no consequences?",
  ],
  group: [
    "Describe your ultimate fantasy involving everyone in this room.",
    "Who here would you want to be sandwiched between? Describe what you'd do.",
    "If you could orchestrate a group encounter with everyone here, how would it go?",
    "Rate everyone in this room from 1-10 on who you'd want to share a bed with.",
    "Describe in detail your hottest group fantasy involving {male_player}, {female_player}, and {player}.",
    "If {partner} gave you permission for one night with multiple people here, who and what would you do?",
    "What's the most you'd do with {male_player} while {female_player} watched and participated?",
    "Describe your fantasy of being pleasured by {player} and {partner} at the same time.",
    "If everyone here was naked, who would you touch first, second, and third?",
    "What boundaries would you break if {male_player}, {female_player}, and {player} all wanted you tonight?",
    "Describe your ideal partner-swap scenario with the couples here.",
    "Who in this room do you think would be the best in a threesome? Who would join them?",
    "If you could dominate multiple people here at once, who and how?",
    "What's the dirtiest thing you've ever fantasized about doing with more than one person?",
    "Describe how you'd pleasure {male_player} and {female_player} simultaneously.",
    "If you were in the center of a group situation, what would you want everyone doing to you?",
    "Who here would you include in your ultimate orgy fantasy and what role would each play?",
    "Describe exactly what you'd do if {player}, {male_player}, and {female_player} were all in your bed.",
    "What's the most explicit group scenario you've ever imagined involving people you know?",
    "If everyone here consented to anything, what would you propose we do right now?",
  ],
};

const dares: Record<Intensity, string[]> = {
  mild: [
    "Give {player} a 30-second lap dance.",
    "Kiss {player} on the neck for 10 seconds.",
    "Let {player} give you a hickey anywhere they choose.",
    "Remove one article of clothing and keep it off for 3 rounds.",
    "Whisper something dirty in {player}'s ear.",
    "Give {male_player} a sensual massage for 2 minutes.",
    "Do your sexiest dance in front of {player} for 30 seconds.",
    "Let {player} blindfold you and guess who's touching you.",
    "Bite your lip and make bedroom eyes at {female_player} for 20 seconds.",
    "Let {player} take a suggestive photo of you.",
    "Sit on {male_player}'s lap for the next 3 rounds.",
    "Let {female_player} run an ice cube down your body.",
    "Kiss {player} passionately for 15 seconds.",
    "Give {player} a foot massage while maintaining eye contact.",
    "Let {male_player} draw something suggestive on your body with their finger.",
    "Trade an article of clothing with {player}.",
    "Demonstrate your best kissing technique on {player}'s hand.",
    "Let {female_player} feed you something seductively.",
    "Do 10 pushups while {player} lies underneath you.",
    "Let {male_player} undo your pants button with their teeth.",
  ],
  spicy: [
    "Make out with {player} for a full minute.",
    "Remove {male_player}'s shirt using only your teeth.",
    "Let {player} spank you 5 times.",
    "Give {female_player} a lap dance with full body contact.",
    "French kiss {player} while {partner} watches.",
    "Let {male_player} touch you anywhere they want for 30 seconds.",
    "Remove your underwear without removing your outer clothes.",
    "Demonstrate your favorite position using {player} as your prop.",
    "Let {female_player} leave a mark anywhere on your body.",
    "Do a body shot off of {male_player}'s stomach.",
    "Kiss a trail from {female_player}'s neck to their waistband.",
    "Straddle {player} for 2 minutes while everyone watches.",
    "Remove {player}'s pants using only your mouth.",
    "Give {male_player} an intimate massage over their clothes.",
    "Whisper your dirtiest fantasy to {female_player} while touching them.",
    "Let {player} blindfold you and kiss you wherever they want.",
    "Take a suggestive photo with {player} of the opposite gender.",
    "Let {player} write 'property of [their name]' anywhere on your body.",
    "Recreate your most passionate kiss ever with {male_player}.",
    "Let {female_player} and {male_player} give you a simultaneous massage.",
    "Make out with {player} while {partner} watches and comments.",
    "Remove 2 articles of clothing from {player}.",
    "Let {player} give you a hickey on your inner thigh.",
    "Sit between {male_player}'s legs for the next round.",
    "Show {female_player} exactly where you like to be touched.",
  ],
  extreme: [
    "Go into a private room with {player} for 5 minutes. No rules.",
    "Strip down to your underwear for the rest of the game.",
    "Let {male_player} touch you intimately for 1 minute while blindfolded.",
    "Kiss {female_player} like you're about to sleep with them.",
    "Let {player} remove an article of your clothing with their teeth - their choice which.",
    "Demonstrate exactly how you like to be touched using {male_player}'s body.",
    "Trade underwear with {player} in front of everyone.",
    "Give {female_player} a massage with minimal clothing barriers.",
    "Act out your favorite explicit scene with {player}.",
    "Make out with {male_player} and {female_player} simultaneously.",
    "Let {player} leave marks anywhere on your body they want.",
    "Role-play meeting {female_player} at a bar and taking her home.",
    "Recreate the first 2 minutes of your favorite adult scene with {male_player}.",
    "Let {player} spank you until you say a safe word.",
    "Show everyone exactly how you like to be kissed - demonstrate on {player}.",
    "Let {female_player} blindfold you and do whatever she wants for 2 minutes.",
    "Make out with {male_player} with your hands tied behind your back.",
    "Let {player} take a very suggestive photo of you.",
    "Perform a slow striptease for {female_player} and {male_player}.",
    "Let {male_player} and {female_player} kiss you at the same time.",
    "Demonstrate on {player} how you'd pleasure them.",
    "Let {female_player} mark you as hers wherever she wants.",
    "Be blindfolded while {male_player} and {female_player} touch you - guess who is who.",
    "Act out your ultimate fantasy with {player} for 3 minutes.",
    "Let {player} do whatever they want to you - their choice.",
  ],
  group: [
    "Make out with {male_player} and {female_player} simultaneously for 2 minutes.",
    "Let everyone in the room touch you somewhere appropriate for 10 seconds each.",
    "Perform a strip tease while everyone watches and gives you tips on what to remove next.",
    "Give {player} a lap dance while {male_player} and {female_player} join in touching you.",
    "Be blindfolded while three different people kiss you - guess who each one is.",
    "Go into a private space with {male_player} and {female_player} for 5 minutes. No rules.",
    "Let {player} and {partner} massage you simultaneously - they choose where.",
    "Demonstrate on {male_player} and {female_player} how you like to be kissed.",
    "Lie in the center while everyone takes turns leaving marks on you.",
    "Play 'pass the kiss' - kiss {player}, they kiss {male_player}, continue around.",
    "Let {male_player} and {female_player} undress you together.",
    "Recreate a group scene from your favorite fantasy with willing participants.",
    "Be the center of attention - everyone must touch or kiss you for 1 minute straight.",
    "Trade an article of clothing with {player}, {male_player}, and {female_player}.",
    "Let two people of different genders give you a simultaneous massage under your clothes.",
    "Act out being pleasured by {male_player} while kissing {female_player}.",
    "Everyone whispers something dirty to you - pick your favorite and act it out with them.",
    "Let {player} and {partner} compete to give you the best 30-second kiss.",
    "Be sandwiched between {male_player} and {female_player} for 2 minutes.",
    "Propose a group dare and everyone must participate if they agree.",
  ],
};

export interface IStorage {
  generatePrompt(
    type: "truth" | "dare", 
    intensity: Intensity, 
    players: Player[], 
    currentPlayerId: string,
    excludeIds?: string[]
  ): Promise<Prompt>;
  
  // Custom prompts
  getCustomPrompts(): Promise<CustomPrompt[]>;
  createCustomPrompt(prompt: InsertCustomPrompt): Promise<CustomPrompt>;
  deleteCustomPrompt(id: string): Promise<void>;
  
  // Favorites
  getFavorites(): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private usedPromptIds: Set<string> = new Set();

  private getPlayersByGender(players: Player[], gender: "male" | "female"): Player[] {
    return players.filter(p => p.gender === gender);
  }

  private getRandomPlayer(players: Player[]): Player | null {
    if (players.length === 0) return null;
    return players[Math.floor(Math.random() * players.length)];
  }

  private getRandomPlayerExcluding(players: Player[], excludeIds: string[]): Player | null {
    const available = players.filter(p => !excludeIds.includes(p.id));
    return this.getRandomPlayer(available);
  }

  private getPartner(players: Player[], currentPlayer: Player): Player | null {
    if (!currentPlayer.coupleId) return null;
    return players.find(p => p.coupleId === currentPlayer.coupleId && p.id !== currentPlayer.id) || null;
  }

  // Check if player A can interact with player B based on BOTH of their preferences
  private areMutuallyCompatible(playerA: Player, playerB: Player): boolean {
    const prefA = playerA.sexualPreference || "bisexual";
    const prefB = playerB.sexualPreference || "bisexual";
    
    // Check if A is attracted to B's gender
    const aAttractedToB = this.isAttractedTo(playerA, playerB.gender);
    // Check if B is attracted to A's gender
    const bAttractedToA = this.isAttractedTo(playerB, playerA.gender);
    
    return aAttractedToB && bAttractedToA;
  }

  // Check if a player is attracted to a specific gender based on their preference
  private isAttractedTo(player: Player, targetGender: "male" | "female"): boolean {
    const preference = player.sexualPreference || "bisexual";
    const playerGender = player.gender;
    
    switch (preference) {
      case "heterosexual":
        return targetGender !== playerGender;
      case "homosexual":
        return targetGender === playerGender;
      case "bisexual":
      default:
        return true;
    }
  }

  // Get players that the current player can interact with based on MUTUAL sexual preference
  private getCompatiblePlayers(players: Player[], currentPlayer: Player): Player[] {
    return players.filter(p => {
      if (p.id === currentPlayer.id) return false;
      return this.areMutuallyCompatible(currentPlayer, p);
    });
  }

  // Get compatible players filtered by gender
  private getCompatiblePlayersByGender(players: Player[], currentPlayer: Player, gender: "male" | "female"): Player[] {
    return this.getCompatiblePlayers(players, currentPlayer).filter(p => p.gender === gender);
  }

  // Check if a prompt template is compatible with current player's preferences
  // Returns true only if we can fill all gender-specific placeholders with mutually compatible players
  private isPromptCompatible(promptText: string, currentPlayer: Player, players: Player[]): boolean {
    const compatiblePlayers = this.getCompatiblePlayers(players, currentPlayer);
    
    // Must have at least one compatible player
    if (compatiblePlayers.length === 0) return false;
    
    // Check for gender-specific placeholders
    const hasMalePlaceholder = promptText.includes("{male_player}");
    const hasFemalePlaceholder = promptText.includes("{female_player}");
    
    // Count how many of each gender placeholder we need
    const maleCount = (promptText.match(/\{male_player\}/g) || []).length;
    const femaleCount = (promptText.match(/\{female_player\}/g) || []).length;
    
    // Get compatible players of each gender
    const compatibleMales = this.getCompatiblePlayersByGender(players, currentPlayer, "male");
    const compatibleFemales = this.getCompatiblePlayersByGender(players, currentPlayer, "female");
    
    // If prompt needs males, we need enough compatible males
    if (hasMalePlaceholder && compatibleMales.length < maleCount) {
      return false;
    }
    
    // If prompt needs females, we need enough compatible females
    if (hasFemalePlaceholder && compatibleFemales.length < femaleCount) {
      return false;
    }
    
    return true;
  }

  // Returns null if placeholder cannot be filled with compatible player
  private replacePlayerPlaceholders(text: string, players: Player[], currentPlayer: Player): string | null {
    const partner = this.getPartner(players, currentPlayer);
    const compatiblePlayers = this.getCompatiblePlayers(players, currentPlayer);
    const compatibleMales = this.getCompatiblePlayersByGender(players, currentPlayer, "male");
    const compatibleFemales = this.getCompatiblePlayersByGender(players, currentPlayer, "female");
    const usedPlayerIds: string[] = [currentPlayer.id];
    
    let result = text;
    
    // Replace {partner} first - partner is always ok regardless of preference
    if (result.includes("{partner}")) {
      const partnerName = partner?.name || "your partner";
      result = result.replace(/\{partner\}/g, partnerName);
      if (partner) usedPlayerIds.push(partner.id);
    }
    
    // Replace {male_player} - use mutually compatible males only
    while (result.includes("{male_player}")) {
      const availableMales = compatibleMales.filter(m => !usedPlayerIds.includes(m.id));
      const selectedMale = this.getRandomPlayer(availableMales);
      if (!selectedMale) {
        // Cannot fill this placeholder with a compatible player
        return null;
      }
      result = result.replace("{male_player}", selectedMale.name);
      usedPlayerIds.push(selectedMale.id);
    }
    
    // Replace {female_player} - use mutually compatible females only
    while (result.includes("{female_player}")) {
      const availableFemales = compatibleFemales.filter(f => !usedPlayerIds.includes(f.id));
      const selectedFemale = this.getRandomPlayer(availableFemales);
      if (!selectedFemale) {
        // Cannot fill this placeholder with a compatible player
        return null;
      }
      result = result.replace("{female_player}", selectedFemale.name);
      usedPlayerIds.push(selectedFemale.id);
    }
    
    // Replace generic {player} - use mutually compatible players only
    while (result.includes("{player}")) {
      const compatibleAvailable = compatiblePlayers.filter(p => !usedPlayerIds.includes(p.id));
      const selectedPlayer = this.getRandomPlayer(compatibleAvailable);
      if (!selectedPlayer) {
        // Cannot fill this placeholder with a compatible player
        return null;
      }
      result = result.replace("{player}", selectedPlayer.name);
      usedPlayerIds.push(selectedPlayer.id);
    }
    
    return result;
  }

  async generatePrompt(
    type: "truth" | "dare", 
    intensity: Intensity, 
    players: Player[], 
    currentPlayerId: string,
    excludeIds: string[] = []
  ): Promise<Prompt> {
    const content = type === "truth" ? truths[intensity] : dares[intensity];
    const currentPlayer = players.find(p => p.id === currentPlayerId) || players[0];
    
    // Get custom prompts from DB
    let customPromptTexts: string[] = [];
    try {
      const dbCustom = await db.select().from(customPrompts).where(eq(customPrompts.type, type));
      customPromptTexts = dbCustom
        .filter(p => p.intensity === intensity)
        .map(p => p.text);
    } catch (e) {
      // DB not available, continue with built-in prompts
    }
    
    const allPrompts = [...content, ...customPromptTexts];
    
    // Filter prompts based on current player's sexual preference compatibility
    let compatiblePrompts = allPrompts.filter(p => this.isPromptCompatible(p, currentPlayer, players));
    
    // If no compatible prompts exist, fall back to all prompts (edge case)
    if (compatiblePrompts.length === 0) {
      compatiblePrompts = allPrompts;
    }
    
    // Try to get an unused prompt first
    let availablePrompts = compatiblePrompts.filter(p => !this.usedPromptIds.has(`${type}-${intensity}-${p}`));
    
    // If all compatible prompts have been used, reset
    if (availablePrompts.length === 0) {
      compatiblePrompts.forEach(p => this.usedPromptIds.delete(`${type}-${intensity}-${p}`));
      availablePrompts = compatiblePrompts;
    }
    
    // Filter out any that match exclude patterns
    if (excludeIds.length > 0) {
      availablePrompts = availablePrompts.filter(p => !excludeIds.some(id => p.includes(id)));
    }
    
    if (availablePrompts.length === 0) {
      availablePrompts = compatiblePrompts;
    }
    
    // Shuffle available prompts and try to find one that can be personalized
    const shuffledPrompts = [...availablePrompts].sort(() => Math.random() - 0.5);
    
    for (const candidatePrompt of shuffledPrompts) {
      const personalizedText = this.replacePlayerPlaceholders(candidatePrompt, players, currentPlayer);
      
      if (personalizedText !== null) {
        const promptId = randomUUID();
        
        // Mark as used
        this.usedPromptIds.add(`${type}-${intensity}-${candidatePrompt}`);
        
        return {
          id: promptId,
          type,
          intensity,
          text: personalizedText,
          isCustom: customPromptTexts.includes(candidatePrompt),
        };
      }
    }
    
    // Fallback: if no prompts could be personalized, return a generic prompt
    // This should rarely happen if isPromptCompatible is working correctly
    const promptId = randomUUID();
    return {
      id: promptId,
      type,
      intensity,
      text: type === "truth" 
        ? "What's something exciting you've always wanted to try?" 
        : "Do something daring that surprises everyone.",
      isCustom: false,
    };
  }

  async getCustomPrompts(): Promise<CustomPrompt[]> {
    try {
      return await db.select().from(customPrompts);
    } catch (e) {
      return [];
    }
  }

  async createCustomPrompt(prompt: InsertCustomPrompt): Promise<CustomPrompt> {
    const [created] = await db.insert(customPrompts).values(prompt).returning();
    return created;
  }

  async deleteCustomPrompt(id: string): Promise<void> {
    await db.delete(customPrompts).where(eq(customPrompts.id, id));
  }

  async getFavorites(): Promise<Favorite[]> {
    try {
      return await db.select().from(favorites);
    } catch (e) {
      return [];
    }
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [created] = await db.insert(favorites).values(favorite).returning();
    return created;
  }

  async removeFavorite(id: string): Promise<void> {
    await db.delete(favorites).where(eq(favorites.id, id));
  }
}

export const storage = new MemStorage();
