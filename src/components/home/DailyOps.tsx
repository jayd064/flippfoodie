import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Shield, MessageSquare, Check, Zap } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { cn } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: "villain" | "hero" | "comment";
  completed: boolean;
  icon: typeof Target;
  accentColor: string;
  glowColor: string;
}

export const DailyOps = () => {
  const { profile, loading } = useGamification();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    const quests = profile.daily_quests as Record<string, boolean | string | null> | null;
    
    setMissions([
      {
        id: "villain",
        title: "Target: Villain",
        description: "Scan a product with score < 50",
        reward: 100,
        type: "villain",
        completed: quests?.villain_scan === true,
        icon: Target,
        accentColor: "from-rose-500/20 to-red-600/10",
        glowColor: "shadow-[0_0_20px_rgba(244,63,94,0.3)]",
      },
      {
        id: "hero",
        title: "Target: Hero",
        description: "Scan a product with score > 75",
        reward: 100,
        type: "hero",
        completed: quests?.hero_scan === true,
        icon: Shield,
        accentColor: "from-emerald-500/20 to-teal-600/10",
        glowColor: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
      },
      {
        id: "comment",
        title: "Intel Gathering",
        description: "Post a comment in the community",
        reward: 50,
        type: "comment",
        completed: quests?.comment === true,
        icon: MessageSquare,
        accentColor: "from-violet-500/20 to-purple-600/10",
        glowColor: "shadow-[0_0_20px_rgba(139,92,246,0.3)]",
      },
    ]);
  }, [profile]);

  const handleComplete = (missionId: string) => {
    setCompletingId(missionId);
    // The holographic unlock animation plays for 1.5s
    setTimeout(() => {
      setMissions(prev => prev.map(m => 
        m.id === missionId ? { ...m, completed: true } : m
      ));
      setCompletingId(null);
    }, 1500);
  };

  if (loading || !profile) return null;

  const completedCount = missions.filter(m => m.completed).length;

  return (
    <section className="px-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">Daily Ops</h2>
          <p className="text-xs text-muted-foreground font-mono">{completedCount}/3 COMPLETE</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm font-bold text-primary font-mono">{profile.credits || 0}</span>
        </div>
      </div>

      <div className="space-y-3">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative overflow-hidden rounded-2xl",
              "bg-white/5 backdrop-blur-md border",
              mission.completed 
                ? "border-primary/30" 
                : mission.type === "villain" 
                  ? "border-rose-500/20" 
                  : mission.type === "hero"
                    ? "border-emerald-500/20"
                    : "border-violet-500/20",
              !mission.completed && mission.glowColor
            )}
          >
            {/* Gradient background */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r opacity-50",
              mission.accentColor
            )} />

            {/* Content */}
            <div className="relative p-4 flex items-center gap-4">
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                mission.completed 
                  ? "bg-primary/20" 
                  : "bg-white/5 border border-white/10"
              )}>
                {mission.completed ? (
                  <Check className="w-6 h-6 text-primary" />
                ) : (
                  <mission.icon className={cn(
                    "w-6 h-6",
                    mission.type === "villain" && "text-rose-400",
                    mission.type === "hero" && "text-emerald-400",
                    mission.type === "comment" && "text-violet-400"
                  )} />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-semibold text-sm",
                  mission.completed ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {mission.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{mission.description}</p>
              </div>

              {/* Reward */}
              <div className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-lg",
                mission.completed 
                  ? "bg-primary/10" 
                  : "bg-white/5 border border-white/10"
              )}>
                <Zap className={cn(
                  "w-3.5 h-3.5",
                  mission.completed ? "text-primary" : "text-amber-400"
                )} />
                <span className={cn(
                  "text-sm font-bold font-mono",
                  mission.completed ? "text-primary" : "text-foreground"
                )}>
                  +{mission.reward}
                </span>
              </div>
            </div>

            {/* Holographic unlock animation */}
            <AnimatePresence>
              {completingId === mission.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10"
                >
                  {/* White flash */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-white"
                  />
                  
                  {/* Progress bar fill */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary origin-left"
                  />
                  
                  {/* Completed text */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                  >
                    <span className="text-xl font-black text-primary tracking-widest font-mono">
                      COMPLETED
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Completed overlay */}
            {mission.completed && completingId !== mission.id && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
