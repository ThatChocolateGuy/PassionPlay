import type { Intensity, Prompt } from "@shared/schema";
import { randomUUID } from "crypto";

// Extensive truth and dare content library
const truths: Record<Intensity, string[]> = {
  mild: [
    "What's the naughtiest thought you've had about someone in this room?",
    "What's your biggest turn-on that you've never told anyone?",
    "Have you ever fantasized about a friend's partner?",
    "What's the most embarrassing thing that's happened to you during intimacy?",
    "What's your secret guilty pleasure when it comes to flirting?",
    "Have you ever sent a dirty text to the wrong person?",
    "What's the weirdest place you've ever been intimate?",
    "What's your favorite body part on your partner?",
    "Have you ever faked it? Why?",
    "What's the most adventurous thing on your bedroom bucket list?",
    "Have you ever had a crush on someone in this room?",
    "What's the sexiest dream you've ever had?",
    "What's something you've always wanted to try but been too shy to ask for?",
    "Have you ever been caught in a compromising position?",
    "What outfit does your partner wear that drives you wild?",
    "What's the longest you've ever gone without it?",
    "Have you ever skinny dipped? With who?",
    "What's your favorite time of day to be intimate?",
    "Have you ever role-played? What was the scenario?",
    "What song puts you in the mood instantly?",
  ],
  spicy: [
    "Describe in detail your hottest sexual experience ever.",
    "What's the dirtiest fantasy you've never shared with anyone?",
    "Have you ever had a threesome? If not, would you?",
    "What's the kinkiest thing you've ever done?",
    "Rate everyone here from 1-10 on how much you'd want to see them naked.",
    "Have you ever been with someone of the same sex? Would you try it?",
    "What's your favorite position and why?",
    "Have you ever watched adult content with a partner? What kind?",
    "What's the most public place you've ever been intimate?",
    "Do you have any fetishes you haven't told your partner about?",
    "Have you ever been to a sex club or swingers party?",
    "What's the naughtiest thing you've ever done at work?",
    "Have you ever been intimate with more than one person in the same day?",
    "What's your experience with toys? What's your favorite?",
    "Have you ever sent or received explicit photos? Show the tame ones.",
    "What's the longest session you've ever had?",
    "Have you ever had a friends-with-benefits situation?",
    "What's something you've done that you'd never admit to your family?",
    "Have you ever been attracted to someone else while in a relationship?",
    "What's your take on watching adult films together as foreplay?",
    "Have you ever been tied up or tied someone else up?",
    "What's the most partners you've had in a month?",
    "Describe your ultimate sexual fantasy in explicit detail.",
    "Have you ever had phone or video intimacy? With who?",
    "What's the most spontaneous sexual encounter you've had?",
  ],
  extreme: [
    "Demonstrate your best oral technique on your finger while making eye contact with {player}.",
    "What's the most taboo fantasy you've ever had?",
    "Have you ever participated in group activities? Describe it.",
    "What's the kinkiest thing you want to do to someone in this room?",
    "Describe exactly what you'd do to {player} if you had one night with them.",
    "Have you ever been involved in BDSM? What role do you prefer?",
    "What's the most explicit message you've ever sent? Read it aloud.",
    "Have you ever been with a couple? Would you?",
    "What's your take on being watched or watching others?",
    "Rate {player}'s body from 1-10 and explain your rating.",
    "What's your most secret sexual desire that you've never acted on?",
    "Have you ever been intimate in front of others intentionally?",
    "Describe in graphic detail your ideal encounter with someone in this room.",
    "What's the most partners you've been with at once?",
    "Have you ever used food during intimacy? How?",
    "What's your experience with domination or submission?",
    "Would you ever let your partner be with someone else while you watched?",
    "What's the most explicit photo or video you have on your phone?",
    "Have you ever role-played a stranger pickup and actually followed through?",
    "Describe exactly how you like to receive oral pleasure.",
    "What's the dirtiest thing you've said during intimacy?",
    "Have you ever been choked or choked someone during intimacy?",
    "What boundaries would you be willing to break tonight?",
    "Describe your most intense orgasm in vivid detail.",
    "What would you do with {player} and {player} together if there were no consequences?",
  ],
};

const dares: Record<Intensity, string[]> = {
  mild: [
    "Give {player} a 30-second lap dance.",
    "Kiss {player} on the neck for 10 seconds.",
    "Let {player} give you a hickey anywhere they choose.",
    "Remove one article of clothing and keep it off for 3 rounds.",
    "Whisper something dirty in {player}'s ear.",
    "Give {player} a sensual massage for 2 minutes.",
    "Do your sexiest dance for 30 seconds.",
    "Let {player} blindfold you and guess who's touching you.",
    "Bite your lip and make bedroom eyes at {player} for 20 seconds.",
    "Let {player} take a suggestive photo of you.",
    "Sit on {player}'s lap for the next 3 rounds.",
    "Let {player} run an ice cube down your body.",
    "Kiss the person to your left passionately for 15 seconds.",
    "Give {player} a foot massage while maintaining eye contact.",
    "Let {player} draw something suggestive on your body with their finger.",
    "Trade an article of clothing with someone in the room.",
    "Demonstrate your best kissing technique on your hand.",
    "Let {player} feed you something seductively.",
    "Do 10 pushups while {player} lies underneath you.",
    "Let someone undo your pants button with their teeth.",
  ],
  spicy: [
    "Make out with {player} for a full minute.",
    "Remove {player}'s shirt using only your teeth.",
    "Let {player} spank you 5 times.",
    "Give {player} a lap dance with full body contact.",
    "French kiss {player} while someone else watches.",
    "Let {player} touch you anywhere they want for 30 seconds.",
    "Remove your underwear without removing your outer clothes.",
    "Demonstrate your favorite position using {player} as your prop.",
    "Let {player} leave a mark anywhere on your body.",
    "Body shot off of {player}'s stomach.",
    "Kiss a trail from {player}'s neck to their waistband.",
    "Let the group choose who you have to straddle for 2 minutes.",
    "Remove {player}'s pants using only your mouth.",
    "Give {player} an intimate massage over their clothes.",
    "Whisper your dirtiest fantasy to {player} while touching them.",
    "Let {player} blindfold you and kiss you wherever they want.",
    "Take a suggestive photo with {player} and post it somewhere private.",
    "Let {player} write 'property of [their name]' anywhere on your body.",
    "Recreate your most passionate kiss ever with {player}.",
    "Let two people give you a simultaneous massage.",
    "Make out with {player} while {player} watches.",
    "Remove 2 articles of clothing from the person of your choice.",
    "Let {player} give you a hickey on your inner thigh.",
    "Spend the next round sitting between {player}'s legs.",
    "Show {player} exactly where you like to be touched.",
  ],
  extreme: [
    "Go into a private room with {player} for 5 minutes. No rules.",
    "Strip down to your underwear for the rest of the game.",
    "Let {player} touch you intimately for 1 minute while blindfolded.",
    "Kiss {player} like you're about to sleep with them.",
    "Let {player} remove an article of your clothing with their teeth - their choice which.",
    "Demonstrate exactly how you like to be touched on {player}.",
    "Trade underwear with {player} in front of everyone.",
    "Give {player} a full body massage with no clothing barriers.",
    "Act out your favorite explicit scene with {player}.",
    "Let the group choose two people you have to make out with simultaneously.",
    "Let {player} leave marks anywhere on your body they want.",
    "Role-play meeting {player} at a bar and taking them home.",
    "Recreate the first 2 minutes of your favorite adult scene with {player}.",
    "Let {player} spank you until you say a safe word.",
    "Show everyone exactly how you like to be kissed - demonstrate on {player}.",
    "Let {player} blindfold you and do whatever they want for 2 minutes.",
    "Make out with {player} with your hands tied behind your back.",
    "Let {player} take a very suggestive photo of you for their eyes only.",
    "Perform a striptease for the group down to your underwear.",
    "Let two people kiss you at the same time.",
    "Demonstrate on {player} how you'd pleasure them.",
    "Let {player} mark you as theirs wherever they want.",
    "Be blindfolded while two people touch you - guess who is who.",
    "Act out your ultimate fantasy with {player} for 3 minutes.",
    "Let the winner of the next round do whatever they want to you.",
  ],
};

export interface IStorage {
  generatePrompt(type: "truth" | "dare", intensity: Intensity, players: string[]): Promise<Prompt>;
}

export class MemStorage implements IStorage {
  private usedPrompts: Set<string> = new Set();

  private getRandomPlayer(players: string[]): string {
    if (players.length === 0) return "someone";
    return players[Math.floor(Math.random() * players.length)];
  }

  private replacePlayerPlaceholders(text: string, players: string[]): string {
    let result = text;
    const playerPattern = /\{player\}/g;
    const matches = text.match(playerPattern);
    
    if (matches) {
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      let playerIndex = 0;
      
      result = text.replace(playerPattern, () => {
        const player = shuffledPlayers[playerIndex % shuffledPlayers.length] || this.getRandomPlayer(players);
        playerIndex++;
        return player;
      });
    }
    
    return result;
  }

  async generatePrompt(type: "truth" | "dare", intensity: Intensity, players: string[]): Promise<Prompt> {
    const content = type === "truth" ? truths[intensity] : dares[intensity];
    
    // Try to get an unused prompt first
    let availablePrompts = content.filter(p => !this.usedPrompts.has(`${type}-${intensity}-${p}`));
    
    // If all prompts have been used, reset
    if (availablePrompts.length === 0) {
      content.forEach(p => this.usedPrompts.delete(`${type}-${intensity}-${p}`));
      availablePrompts = content;
    }
    
    const randomIndex = Math.floor(Math.random() * availablePrompts.length);
    const selectedPrompt = availablePrompts[randomIndex];
    
    // Mark as used
    this.usedPrompts.add(`${type}-${intensity}-${selectedPrompt}`);
    
    // Replace player placeholders
    const personalizedText = this.replacePlayerPlaceholders(selectedPrompt, players);
    
    return {
      id: randomUUID(),
      type,
      intensity,
      text: personalizedText,
    };
  }
}

export const storage = new MemStorage();
