import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Check, Lock, Sparkles, Film, Cpu, Crown } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StyleShopProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ThemeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: typeof Film;
  preview: string;
  gradientFrom: string;
  gradientTo: string;
}

const THEMES: ThemeItem[] = [
  {
    id: "noir",
    name: "Noir Edition",
    description: "Black & white with film grain + dramatic lighting",
    price: 500,
    icon: Film,
    preview: "grayscale(100%) contrast(120%)",
    gradientFrom: "from-zinc-600",
    gradientTo: "to-zinc-800",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Glitch effects, neon borders, matrix rain",
    price: 1000,
    icon: Cpu,
    preview: "",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-fuchsia-500",
  },
  {
    id: "gold",
    name: "Gold Foil",
    description: "Shimmering gold texture with gyro response",
    price: 2000,
    icon: Crown,
    preview: "",
    gradientFrom: "from-amber-400",
    gradientTo: "to-yellow-600",
  },
];

export const StyleShop = ({ isOpen, onClose }: StyleShopProps) => {
  const { profile } = useGamification();
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const ownedThemes = (profile?.owned_themes as string[]) || ["default"];
  const equippedTheme = (profile?.equipped_theme as string) || "default";
  const credits = profile?.credits || 0;

  const handlePurchase = async (theme: ThemeItem) => {
    if (!profile) return;
    
    if (credits < theme.price) {
      toast.error("Not enough credits!", {
        description: `You need ${theme.price - credits} more credits`,
      });
      return;
    }

    setPurchasing(theme.id);

    try {
      const newOwnedThemes = [...ownedThemes, theme.id];
      const newCredits = credits - theme.price;

      const { error } = await supabase
        .from("profiles")
        .update({
          owned_themes: newOwnedThemes,
          credits: newCredits,
          equipped_theme: theme.id, // Auto-equip on purchase
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success(`${theme.name} unlocked!`, {
        description: "Your new theme has been equipped",
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          border: "none",
          color: "white",
        },
      });

      // Force refresh by closing and showing success
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error("Purchase failed:", err);
      toast.error("Purchase failed. Please try again.");
    } finally {
      setPurchasing(null);
    }
  };

  const handleEquip = async (themeId: string) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ equipped_theme: themeId })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Theme equipped!");
    } catch (err) {
      console.error("Equip failed:", err);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-end justify-center"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        {/* Shop Panel */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-gradient-to-b from-zinc-900 to-black rounded-t-3xl border-t border-white/10 overflow-hidden"
        >
          {/* Handle */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3" />

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Style Shop</h2>
                <p className="text-xs text-zinc-400">Premium Battle Card FX</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Credits Balance */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary font-mono">{credits}</span>
              </div>
              
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Themes Grid */}
          <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
            {THEMES.map((theme, index) => {
              const isOwned = ownedThemes.includes(theme.id);
              const isEquipped = equippedTheme === theme.id;
              const canAfford = credits >= theme.price;
              const isPurchasing = purchasing === theme.id;

              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative overflow-hidden rounded-2xl border",
                    isEquipped 
                      ? "border-primary/50 bg-primary/5" 
                      : "border-white/10 bg-white/5"
                  )}
                >
                  {/* Gradient Preview */}
                  <div className={cn(
                    "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                    theme.gradientFrom,
                    theme.gradientTo
                  )} />

                  <div className="p-4 flex items-center gap-4">
                    {/* Icon */}
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br",
                      theme.gradientFrom,
                      theme.gradientTo
                    )}
                      style={{ filter: theme.preview }}
                    >
                      <theme.icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{theme.name}</h3>
                        {isEquipped && (
                          <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                            Equipped
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{theme.description}</p>
                    </div>

                    {/* Action Button */}
                    {isOwned ? (
                      isEquipped ? (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-primary" />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEquip(theme.id)}
                          className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                        >
                          Equip
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handlePurchase(theme)}
                        disabled={!canAfford || isPurchasing}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          canAfford
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white hover:opacity-90"
                            : "bg-white/5 text-zinc-500 cursor-not-allowed"
                        )}
                      >
                        {isPurchasing ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : canAfford ? (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            <span>{theme.price}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>{theme.price}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Hint */}
          <div className="p-4 border-t border-white/10 text-center">
            <p className="text-xs text-zinc-500">
              Complete Daily Ops to earn credits
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
