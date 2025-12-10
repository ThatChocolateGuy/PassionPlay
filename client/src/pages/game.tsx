import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Flame, Heart, Zap, X, Plus, Users, Shuffle, Sparkles, AlertCircle } from "lucide-react";
import type { Intensity, Player, Prompt } from "@shared/schema";

const intensityConfig = {
  mild: {
    label: "Mild",
    icon: Heart,
    description: "Flirty & fun",
    gradient: "from-pink-500 to-rose-500",
  },
  spicy: {
    label: "Spicy",
    icon: Flame,
    description: "Turn up the heat",
    gradient: "from-orange-500 to-red-500",
  },
  extreme: {
    label: "Extreme",
    icon: Zap,
    description: "No limits",
    gradient: "from-purple-500 to-pink-600",
  },
};

export default function Game() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("spicy");
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [showPlayers, setShowPlayers] = useState(true);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async ({ type, intensity, players }: { type: "truth" | "dare"; intensity: Intensity; players: string[] }) => {
      const response = await apiRequest("POST", "/api/generate", { type, intensity, players });
      return response.json() as Promise<Prompt>;
    },
    onSuccess: (data) => {
      setCurrentPrompt(data);
    },
    onError: () => {
      toast({
        title: "Oops!",
        description: "Failed to generate prompt. Try again.",
        variant: "destructive",
      });
    },
  });

  const addPlayer = useCallback(() => {
    const trimmedName = newPlayerName.trim();
    
    if (!trimmedName) {
      toast({
        title: "Name required",
        description: "Please enter a player name.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicates (case-insensitive)
    if (players.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast({
        title: "Duplicate name",
        description: "This player is already added.",
        variant: "destructive",
      });
      return;
    }
    
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: trimmedName,
    };
    setPlayers((prev) => [...prev, newPlayer]);
    setNewPlayerName("");
  }, [newPlayerName, players, toast]);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const generatePrompt = useCallback(
    (type: "truth" | "dare") => {
      generateMutation.mutate({
        type,
        intensity,
        players: players.map((p) => p.name),
      });
    },
    [intensity, players, generateMutation]
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  const isGenerating = generateMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300 bg-clip-text text-transparent mb-2">
            Truth or Dare
          </h1>
          <p className="text-rose-200/70 text-lg">
            Intimate games for adventurous souls
          </p>
        </motion.header>

        {/* Player Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
            <button
              onClick={() => setShowPlayers(!showPlayers)}
              className="flex items-center gap-2 w-full text-left mb-3"
              data-testid="button-toggle-players"
            >
              <Users className="w-5 h-5 text-pink-400" />
              <span className="text-rose-100 font-medium">Players</span>
              <Badge variant="secondary" className="ml-auto bg-pink-500/20 text-pink-200 border-pink-500/30">
                {players.length}
              </Badge>
            </button>

            <AnimatePresence>
              {showPlayers && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Enter player name..."
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-pink-400 focus:ring-pink-400/20"
                      data-testid="input-player-name"
                    />
                    <Button
                      onClick={addPlayer}
                      size="icon"
                      className="bg-pink-500 hover:bg-pink-600 text-white shrink-0"
                      data-testid="button-add-player"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence mode="popLayout">
                      {players.map((player) => (
                        <motion.div
                          key={player.id}
                          layout
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-100 border-pink-400/30 pr-1 gap-1"
                            data-testid={`badge-player-${player.id}`}
                          >
                            {player.name}
                            <button
                              onClick={() => removePlayer(player.id)}
                              className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
                              data-testid={`button-remove-player-${player.id}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {players.length === 0 && (
                      <p className="text-rose-200/50 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Add players to personalize the experience
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Intensity Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(intensityConfig) as Intensity[]).map((level) => {
              const config = intensityConfig[level];
              const Icon = config.icon;
              const isActive = intensity === level;

              return (
                <button
                  key={level}
                  onClick={() => setIntensity(level)}
                  className={`
                    relative p-4 rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? `bg-gradient-to-br ${config.gradient} shadow-lg shadow-pink-500/20`
                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                    }
                  `}
                  data-testid={`button-intensity-${level}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon
                      className={`w-6 h-6 ${isActive ? "text-white" : "text-pink-300"}`}
                    />
                    <span
                      className={`font-semibold ${isActive ? "text-white" : "text-rose-100"}`}
                    >
                      {config.label}
                    </span>
                    <span
                      className={`text-xs ${isActive ? "text-white/80" : "text-rose-200/60"}`}
                    >
                      {config.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Current Prompt Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 md:p-12 min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative">
                    <Sparkles className="w-12 h-12 text-pink-400 animate-pulse" />
                    <div className="absolute inset-0 w-12 h-12 bg-pink-400/30 blur-xl animate-pulse" />
                  </div>
                  <p className="text-rose-200/70">Getting spicy...</p>
                </motion.div>
              ) : currentPrompt ? (
                <motion.div
                  key={currentPrompt.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="text-center"
                >
                  <Badge
                    className={`mb-4 ${
                      currentPrompt.type === "truth"
                        ? "bg-blue-500/30 text-blue-200 border-blue-400/30"
                        : "bg-orange-500/30 text-orange-200 border-orange-400/30"
                    }`}
                    data-testid="badge-prompt-type"
                  >
                    {currentPrompt.type === "truth" ? "Truth" : "Dare"}
                  </Badge>
                  <p
                    className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed"
                    data-testid="text-current-prompt"
                  >
                    {currentPrompt.text}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <Shuffle className="w-12 h-12 text-pink-400/50 mx-auto mb-4" />
                  <p className="text-rose-200/50 text-lg">
                    Choose Truth or Dare to begin
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <Button
            onClick={() => generatePrompt("truth")}
            disabled={isGenerating}
            size="lg"
            className="h-16 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            data-testid="button-generate-truth"
          >
            <Heart className="w-5 h-5 mr-2" />
            Truth
          </Button>
          <Button
            onClick={() => generatePrompt("dare")}
            disabled={isGenerating}
            size="lg"
            className="h-16 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            data-testid="button-generate-dare"
          >
            <Flame className="w-5 h-5 mr-2" />
            Dare
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-rose-200/40 text-sm"
        >
          <p>Play responsibly. Consent is sexy.</p>
        </motion.footer>
      </div>
    </div>
  );
}
