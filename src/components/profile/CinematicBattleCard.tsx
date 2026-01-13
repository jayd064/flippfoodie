import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface CinematicBattleCardProps {
  userId: string;
  userName: string;
  userAvatar?: string;
  userTheme?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ScanItem {
  barcode: string;
  name: string;
  image: string;
  score: number;
}

// Theme configurations for purchased themes
const THEMES = {
  default: {
    name: "Default",
    filter: "",
    cardBg: "bg-white/5",
  },
  noir: {
    name: "Noir Edition",
    filter: "grayscale(100%) contrast(110%)",
    cardBg: "bg-zinc-800/50",
  },
  cyberpunk: {
    name: "Cyberpunk",
    filter: "",
    cardBg: "bg-cyan-950/30",
  },
  gold: {
    name: "Gold Foil",
    filter: "",
    cardBg: "bg-amber-950/20",
  },
};

export const CinematicBattleCard = ({ 
  userId, 
  userName, 
  userAvatar, 
  userTheme = "default",
  isOpen, 
  onClose 
}: CinematicBattleCardProps) => {
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = THEMES[userTheme as keyof typeof THEMES] || THEMES.default;

  useEffect(() => {
    if (!isOpen) return;

    const fetchUserScans = async () => {
      try {
        const { data: scanData } = await supabase
          .from("scans")
          .select("product_barcode")
          .order("scanned_at", { ascending: false })
          .limit(8);

        if (scanData && scanData.length > 0) {
          const barcodes = scanData.map(s => s.product_barcode);
          const { data: products } = await supabase
            .from("products")
            .select("barcode, name, front_image_url, health_score")
            .in("barcode", barcodes);

          if (products) {
            setScans(products.map(p => ({
              barcode: p.barcode,
              name: p.name,
              image: p.front_image_url || "",
              score: p.health_score || 50,
            })));
          }
        }

        if (!scanData || scanData.length === 0) {
          // Demo data
          setScans([
            { barcode: "1", name: "Yoga Bar", image: "https://m.media-amazon.com/images/I/71J1x0kP+DL._SL1500_.jpg", score: 85 },
            { barcode: "2", name: "Maggi", image: "https://m.media-amazon.com/images/I/81tp0D9+y5L._SL1500_.jpg", score: 22 },
            { barcode: "3", name: "Lay's", image: "https://m.media-amazon.com/images/I/81R9Wk+rWPL._SL1500_.jpg", score: 15 },
            { barcode: "4", name: "Amul Butter", image: "https://m.media-amazon.com/images/I/61b7b7v+TFL._SL1500_.jpg", score: 65 },
            { barcode: "5", name: "Coke Zero", image: "https://m.media-amazon.com/images/I/51f3H-1X3nL._SL1000_.jpg", score: 28 },
            { barcode: "6", name: "Greek Yogurt", image: "https://m.media-amazon.com/images/I/71Qw+xR7LQL._SL1500_.jpg", score: 88 },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch battle data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserScans();
  }, [isOpen, userId]);

  const heroes = scans.filter(s => s.score >= 50);
  const villains = scans.filter(s => s.score < 50);
  const heroesWin = heroes.length >= villains.length;
  const winRate = scans.length > 0 ? Math.round((heroes.length / scans.length) * 100) : 0;
  const currentVibe = heroesWin ? "Clean" : "Guilty";

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

        {/* Premium Glass Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0f0f0f] backdrop-blur-2xl border border-white/10 shadow-2xl"
          style={{ filter: theme.filter }}
        >
          {/* Gold shimmer effect for Gold theme */}
          {userTheme === "gold" && (
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10 pointer-events-none z-50"
            />
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>

          {/* Header */}
          <div className="relative z-10 p-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={cn(
                  "w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-offset-2 ring-offset-[#0f0f0f]",
                  heroesWin ? "ring-emerald-500/50" : "ring-rose-500/50"
                )}>
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white/80">{userName[0]?.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{userName}</h2>
                <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase">Stats Overview</p>
              </div>
            </div>
          </div>

          {/* Battle Arena - Two Column Layout */}
          <div className="relative px-6 pb-4">
            <div className="relative flex gap-4">
              {/* Ambient Glow Blobs */}
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

              {/* Heroes Side (Left) */}
              <div className={cn(
                "flex-1 rounded-2xl p-4 transition-all",
                heroesWin ? "border-2 border-yellow-500/40" : "border border-white/5"
              )}>
                <p className="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase mb-4">
                  The Saints
                </p>
                
                {/* Product Grid 2x2 */}
                <div className="grid grid-cols-2 gap-2">
                  {heroes.slice(0, 4).map((hero, i) => (
                    <motion.div
                      key={hero.barcode}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden",
                        theme.cardBg
                      )}
                    >
                      <img 
                        src={hero.image} 
                        alt={hero.name} 
                        className="w-full h-full object-cover opacity-80" 
                      />
                      {/* Score Dot */}
                      <div className="absolute top-1.5 right-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Empty slots */}
                  {heroes.length < 4 && [...Array(4 - Math.min(heroes.length, 4))].map((_, i) => (
                    <div 
                      key={`empty-hero-${i}`}
                      className="aspect-square rounded-xl bg-white/[0.02] border border-dashed border-white/10"
                    />
                  ))}
                </div>
                
                <p className="text-center text-2xl font-bold text-emerald-400 mt-4">{heroes.length}</p>
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-white/5 self-stretch" />

              {/* Villains Side (Right) */}
              <div className={cn(
                "flex-1 rounded-2xl p-4 transition-all",
                !heroesWin ? "border-2 border-yellow-500/40" : "border border-white/5"
              )}>
                <p className="text-[10px] font-bold tracking-[0.3em] text-rose-400 uppercase mb-4 text-right">
                  The Sinners
                </p>
                
                {/* Product Grid 2x2 */}
                <div className="grid grid-cols-2 gap-2">
                  {villains.slice(0, 4).map((villain, i) => (
                    <motion.div
                      key={villain.barcode}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden",
                        theme.cardBg
                      )}
                    >
                      <img 
                        src={villain.image} 
                        alt={villain.name} 
                        className="w-full h-full object-cover opacity-80" 
                      />
                      {/* Score Dot */}
                      <div className="absolute top-1.5 right-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Empty slots */}
                  {villains.length < 4 && [...Array(4 - Math.min(villains.length, 4))].map((_, i) => (
                    <div 
                      key={`empty-villain-${i}`}
                      className="aspect-square rounded-xl bg-white/[0.02] border border-dashed border-white/10"
                    />
                  ))}
                </div>
                
                <p className="text-center text-2xl font-bold text-rose-400 mt-4">{villains.length}</p>
              </div>
            </div>
          </div>

          {/* Footer - Current Vibe */}
          <div className="relative z-10 px-6 pb-6 pt-2">
            <div className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-xs text-zinc-500 font-medium">Current Vibe:</span>
              <span className={cn(
                "text-sm font-bold",
                heroesWin ? "text-emerald-400" : "text-rose-400"
              )}>
                {currentVibe}
              </span>
              <span className="text-xs text-zinc-600 font-mono">({winRate}% clean)</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
