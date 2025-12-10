import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Flame, Heart, Zap, X, Plus, Users, Shuffle, Sparkles, 
  ChevronRight, Timer, Star, UserPlus, Crown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Intensity, Player, Prompt, Couple } from "@shared/schema";

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

const coupleColors = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-indigo-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-amber-500",
  "from-purple-500 to-violet-500",
  "from-cyan-500 to-teal-500",
];

export default function Game() {
  const [couples, setCouples] = useState<Couple[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerGender, setNewPlayerGender] = useState<"male" | "female">("male");
  const [newPlayerCoupleId, setNewPlayerCoupleId] = useState<string>("");
  const [newCoupleName, setNewCoupleName] = useState("");
  const [intensity, setIntensity] = useState<Intensity>("spicy");
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [showAddCouple, setShowAddCouple] = useState(false);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async ({ type, intensity, players, currentPlayerId }: { 
      type: "truth" | "dare"; 
      intensity: Intensity; 
      players: Player[];
      currentPlayerId: string;
    }) => {
      const response = await apiRequest("POST", "/api/generate", { 
        type, 
        intensity, 
        players,
        currentPlayerId,
      });
      return response.json() as Promise<Prompt>;
    },
    onSuccess: (data) => {
      setCurrentPrompt(data);
      if (data.type === "dare") {
        setTimerSeconds(60);
      }
    },
    onError: () => {
      toast({
        title: "Oops!",
        description: "Failed to generate prompt. Try again.",
        variant: "destructive",
      });
    },
  });

  const addCouple = useCallback(() => {
    const trimmedName = newCoupleName.trim();
    if (!trimmedName) {
      toast({
        title: "Name required",
        description: "Please enter a couple name.",
        variant: "destructive",
      });
      return;
    }
    
    const newCouple: Couple = {
      id: crypto.randomUUID(),
      name: trimmedName,
      color: coupleColors[couples.length % coupleColors.length],
    };
    setCouples((prev) => [...prev, newCouple]);
    setNewCoupleName("");
    setShowAddCouple(false);
  }, [newCoupleName, couples, toast]);

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
      gender: newPlayerGender,
      coupleId: newPlayerCoupleId || undefined,
    };
    setPlayers((prev) => [...prev, newPlayer]);
    setNewPlayerName("");
  }, [newPlayerName, newPlayerGender, newPlayerCoupleId, players, toast]);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const removeCouple = useCallback((id: string) => {
    setCouples((prev) => prev.filter((c) => c.id !== id));
    setPlayers((prev) => prev.map(p => 
      p.coupleId === id ? { ...p, coupleId: undefined } : p
    ));
  }, []);

  const startGame = useCallback(() => {
    if (players.length < 2) {
      toast({
        title: "Need more players",
        description: "Add at least 2 players to start.",
        variant: "destructive",
      });
      return;
    }
    setGameStarted(true);
    setShowSetup(false);
    setCurrentPlayerIndex(0);
    setTurnCount(0);
    setRoundNumber(1);
  }, [players, toast]);

  const generatePrompt = useCallback(
    (type: "truth" | "dare") => {
      const currentPlayer = players[currentPlayerIndex];
      generateMutation.mutate({
        type,
        intensity,
        players,
        currentPlayerId: currentPlayer.id,
      });
    },
    [intensity, players, currentPlayerIndex, generateMutation]
  );

  const nextTurn = useCallback(() => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);
    setTurnCount((prev) => prev + 1);
    
    if (nextIndex === 0) {
      setRoundNumber((prev) => prev + 1);
    }
    
    setCurrentPrompt(null);
    setTimerActive(false);
    setTimerSeconds(60);
  }, [currentPlayerIndex, players.length]);

  const startTimer = useCallback(() => {
    setTimerActive(true);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          toast({
            title: "Time's up!",
            description: "The dare timer has ended.",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [toast]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  const currentPlayer = players[currentPlayerIndex];
  const currentCouple = currentPlayer?.coupleId 
    ? couples.find(c => c.id === currentPlayer.coupleId) 
    : null;
  const isGenerating = generateMutation.isPending;

  const getCoupleColor = (coupleId?: string) => {
    if (!coupleId) return "from-gray-500 to-gray-600";
    const couple = couples.find(c => c.id === coupleId);
    return couple?.color || "from-gray-500 to-gray-600";
  };

  // Setup screen
  if (showSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-950 via-purple-950 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-purple-300 bg-clip-text text-transparent mb-2">
              Truth or Dare
            </h1>
            <p className="text-rose-200/70 text-lg">Setup your game</p>
          </motion.header>

          {/* Couples Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span className="text-rose-100 font-medium">Couples</span>
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-200 border-amber-500/30">
                    {couples.length}
                  </Badge>
                </div>
                <Dialog open={showAddCouple} onOpenChange={setShowAddCouple}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="border-white/20 text-rose-100 hover:bg-white/10">
                      <Plus className="w-4 h-4 mr-1" /> Add Couple
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-white/10">
                    <DialogHeader>
                      <DialogTitle className="text-rose-100">Add a Couple</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Couple name (e.g., 'The Smiths')"
                        value={newCoupleName}
                        onChange={(e) => setNewCoupleName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        data-testid="input-couple-name"
                      />
                      <Button onClick={addCouple} className="w-full bg-amber-500 hover:bg-amber-600" data-testid="button-save-couple">
                        Save Couple
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-wrap gap-2">
                {couples.map((couple) => (
                  <Badge
                    key={couple.id}
                    className={`bg-gradient-to-r ${couple.color} text-white border-0 pr-1`}
                    data-testid={`badge-couple-${couple.id}`}
                  >
                    {couple.name}
                    <button
                      onClick={() => removeCouple(couple.id)}
                      className="ml-1 p-0.5 rounded-full hover:bg-white/20"
                      data-testid={`button-remove-couple-${couple.id}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {couples.length === 0 && (
                  <p className="text-rose-200/50 text-sm">Add couples to pair players together</p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Players Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-pink-400" />
                <span className="text-rose-100 font-medium">Players</span>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-200 border-pink-500/30">
                  {players.length}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <Input
                  placeholder="Player name..."
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  data-testid="input-player-name"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Select value={newPlayerGender} onValueChange={(v) => setNewPlayerGender(v as "male" | "female")}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-gender">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="male" data-testid="select-gender-male">Male</SelectItem>
                      <SelectItem value="female" data-testid="select-gender-female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={newPlayerCoupleId} onValueChange={setNewPlayerCoupleId}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-couple">
                      <SelectValue placeholder="Couple (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="none" data-testid="select-couple-none">No couple</SelectItem>
                      {couples.map((couple) => (
                        <SelectItem key={couple.id} value={couple.id} data-testid={`select-couple-${couple.id}`}>
                          {couple.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={addPlayer}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                  data-testid="button-add-player"
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Add Player
                </Button>
              </div>

              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {players.map((player) => (
                    <motion.div
                      key={player.id}
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                      data-testid={`player-row-${player.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getCoupleColor(player.coupleId)} flex items-center justify-center text-white text-sm font-medium`}>
                          {player.name[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="text-rose-100 font-medium">{player.name}</span>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className={`text-xs ${player.gender === 'male' ? 'border-blue-400/50 text-blue-300' : 'border-pink-400/50 text-pink-300'}`}>
                              {player.gender === 'male' ? 'M' : 'F'}
                            </Badge>
                            {player.coupleId && (
                              <Badge variant="outline" className="text-xs border-amber-400/50 text-amber-300">
                                {couples.find(c => c.id === player.coupleId)?.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removePlayer(player.id)}
                        className="text-rose-300 hover:text-rose-100 hover:bg-white/10"
                        data-testid={`button-remove-player-${player.id}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {players.length === 0 && (
                  <p className="text-rose-200/50 text-sm text-center py-4">
                    Add at least 2 players to start the game
                  </p>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Start Game Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={startGame}
              disabled={players.length < 2}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50"
              data-testid="button-start-game"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Game ({players.length} players)
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with counters */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSetup(true)}
            className="text-rose-200 hover:text-white hover:bg-white/10"
            data-testid="button-back-setup"
          >
            <Users className="w-4 h-4 mr-1" /> Setup
          </Button>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/30" data-testid="badge-round">
              Round {roundNumber}
            </Badge>
            <Badge className="bg-pink-500/30 text-pink-200 border-pink-400/30" data-testid="badge-turn">
              Turn {turnCount + 1}
            </Badge>
          </div>
        </motion.header>

        {/* Current Player Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4">
            <div className="flex items-center justify-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getCoupleColor(currentPlayer?.coupleId)} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                {currentPlayer?.name[0].toUpperCase()}
              </div>
              <div className="text-center">
                <p className="text-rose-200/70 text-sm">Current Turn</p>
                <h2 className="text-2xl font-bold text-white" data-testid="text-current-player">
                  {currentPlayer?.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Badge variant="outline" className={`text-xs ${currentPlayer?.gender === 'male' ? 'border-blue-400/50 text-blue-300' : 'border-pink-400/50 text-pink-300'}`}>
                    {currentPlayer?.gender === 'male' ? 'Male' : 'Female'}
                  </Badge>
                  {currentCouple && (
                    <Badge variant="outline" className="text-xs border-amber-400/50 text-amber-300">
                      {currentCouple.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Intensity Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
                  className={`relative p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br ${config.gradient} shadow-lg`
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                  }`}
                  data-testid={`button-intensity-${level}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-pink-300"}`} />
                    <span className={`text-sm font-semibold ${isActive ? "text-white" : "text-rose-100"}`}>
                      {config.label}
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
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 md:p-10 min-h-[180px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Sparkles className="w-10 h-10 text-pink-400 animate-pulse" />
                  <p className="text-rose-200/70">Getting spicy...</p>
                </motion.div>
              ) : currentPrompt ? (
                <motion.div
                  key={currentPrompt.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="text-center w-full"
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge
                      className={currentPrompt.type === "truth"
                        ? "bg-blue-500/30 text-blue-200 border-blue-400/30"
                        : "bg-orange-500/30 text-orange-200 border-orange-400/30"
                      }
                      data-testid="badge-prompt-type"
                    >
                      {currentPrompt.type === "truth" ? "Truth" : "Dare"}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/20"
                      data-testid="button-favorite"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed" data-testid="text-current-prompt">
                    {currentPrompt.text}
                  </p>
                  
                  {/* Timer for dares */}
                  {currentPrompt.type === "dare" && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                      {!timerActive ? (
                        <Button
                          onClick={startTimer}
                          variant="outline"
                          className="border-pink-400/50 text-pink-300 hover:bg-pink-500/20"
                          data-testid="button-start-timer"
                        >
                          <Timer className="w-4 h-4 mr-2" />
                          Start Timer (60s)
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-2xl font-mono text-pink-300" data-testid="text-timer">
                          <Timer className="w-6 h-6" />
                          {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <Shuffle className="w-10 h-10 text-pink-400/50 mx-auto mb-3" />
                  <p className="text-rose-200/50">
                    {currentPlayer?.name}, choose Truth or Dare!
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
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-4"
        >
          <Button
            onClick={() => generatePrompt("truth")}
            disabled={isGenerating}
            size="lg"
            className="h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
            data-testid="button-generate-truth"
          >
            <Heart className="w-5 h-5 mr-2" />
            Truth
          </Button>
          <Button
            onClick={() => generatePrompt("dare")}
            disabled={isGenerating}
            size="lg"
            className="h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg"
            data-testid="button-generate-dare"
          >
            <Flame className="w-5 h-5 mr-2" />
            Dare
          </Button>
        </motion.div>

        {/* Next Turn Button */}
        {currentPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={nextTurn}
              size="lg"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
              data-testid="button-next-turn"
            >
              <ChevronRight className="w-5 h-5 mr-2" />
              Next Player: {players[(currentPlayerIndex + 1) % players.length]?.name}
            </Button>
          </motion.div>
        )}

        {/* Player Queue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <p className="text-rose-200/50 text-sm text-center mb-2">Coming up:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {players.map((player, index) => {
              const isNext = index === (currentPlayerIndex + 1) % players.length;
              const isCurrent = index === currentPlayerIndex;
              
              return (
                <div
                  key={player.id}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${getCoupleColor(player.coupleId)} flex items-center justify-center text-white text-sm font-medium transition-all ${
                    isCurrent ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-transparent scale-110' : 
                    isNext ? 'ring-2 ring-green-400/50' : 'opacity-50'
                  }`}
                  title={player.name}
                  data-testid={`avatar-player-${player.id}`}
                >
                  {player.name[0].toUpperCase()}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-rose-200/40 text-sm"
        >
          <p>Play responsibly. Consent is sexy.</p>
        </motion.footer>
      </div>
    </div>
  );
}
