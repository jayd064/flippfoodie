import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Shield, Skull, Sparkles } from "lucide-react";
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

// Theme configurations
const THEMES = {
  default: {
    name: "Default",
    heroGradient: "from-emerald-600 via-teal-500 to-emerald-700",
    villainGradient: "from-rose-600 via-red-500 to-rose-700",
    vsGradient: "from-amber-400 via-yellow-300 to-amber-500",
    filter: "",
    overlay: "",
  },
  noir: {
    name: "Noir Edition",
    heroGradient: "from-zinc-700 via-zinc-600 to-zinc-800",
    villainGradient: "from-zinc-800 via-zinc-700 to-zinc-900",
    vsGradient: "from-zinc-400 via-zinc-300 to-zinc-500",
    filter: "grayscale(100%) contrast(120%)",
    overlay: "bg-[url('data:image/svg+xml,...')] opacity-20",
  },
  cyberpunk: {
    name: "Cyberpunk",
    heroGradient: "from-cyan-500 via-blue-500 to-cyan-600",
    villainGradient: "from-fuchsia-500 via-pink-500 to-fuchsia-600",
    vsGradient: "from-lime-400 via-green-300 to-lime-500",
    filter: "",
    overlay: "",
  },
  gold: {
    name: "Gold Foil",
    heroGradient: "from-amber-500 via-yellow-400 to-amber-600",
    villainGradient: "from-orange-600 via-amber-500 to-orange-700",
    vsGradient: "from-yellow-300 via-amber-200 to-yellow-400",
    filter: "",
    overlay: "",
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
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const theme = THEMES[userTheme as keyof typeof THEMES] || THEMES.default;

  useEffect(() => {
    if (!isOpen) return;

    const fetchUserScans = async () => {
      try {
        const { data: scanData } = await supabase
          .from("scans")
          .select("product_barcode")
          .order("scanned_at", { ascending: false })
          .limit(5);

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
          setScans([
            { barcode: "1", name: "Yoga Bar", image: "https://m.media-amazon.com/images/I/71J1x0kP+DL._SL1500_.jpg", score: 85 },
            { barcode: "2", name: "Maggi", image: "https://m.media-amazon.com/images/I/81tp0D9+y5L._SL1500_.jpg", score: 22 },
            { barcode: "3", name: "Lay's", image: "https://m.media-amazon.com/images/I/81R9Wk+rWPL._SL1500_.jpg", score: 15 },
            { barcode: "4", name: "Amul Butter", image: "https://m.media-amazon.com/images/I/61b7b7v+TFL._SL1500_.jpg", score: 65 },
            { barcode: "5", name: "Coke Zero", image: "https://m.media-amazon.com/images/I/51f3H-1X3nL._SL1000_.jpg", score: 28 },
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const heroes = scans.filter(s => s.score >= 50);
  const villains = scans.filter(s => s.score < 50);
  const heroesWin = heroes.length >= villains.length;
  const winRate = scans.length > 0 ? Math.round((heroes.length / scans.length) * 100) : 0;

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
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

        {/* Cyberpunk rain effect */}
        {userTheme === "cyberpunk" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 0 }}
                animate={{ 
                  y: "100vh", 
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ 
                  duration: 1.5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="absolute w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  height: `${20 + Math.random() * 30}px`,
                }}
              />
            ))}
          </div>
        )}

        {/* 3D Card with perspective */}
        <motion.div
          initial={{ scale: 0.8, rotateY: -15, rotateX: 10 }}
          animate={{ scale: 1, rotateY: 0, rotateX: 0 }}
          exit={{ scale: 0.8, rotateY: 15, rotateX: -10 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          onMouseMove={handleMouseMove}
          className="relative w-full max-w-md overflow-hidden rounded-3xl"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d",
            transform: `rotateY(${(mousePos.x - 0.5) * 10}deg) rotateX(${(mousePos.y - 0.5) * -10}deg)`,
            filter: theme.filter,
          }}
        >
          {/* Gold shimmer effect */}
          {userTheme === "gold" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 via-transparent to-amber-200/30 pointer-events-none z-50"
              style={{
                backgroundPosition: `${mousePos.x * 100}% ${mousePos.y * 100}%`,
              }}
            />
          )}

          {/* Film grain overlay for Noir */}
          {userTheme === "noir" && (
            <div className="absolute inset-0 opacity-30 pointer-events-none z-50 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />
          )}

          {/* Card Container */}
          <div className="relative bg-gradient-to-b from-zinc-900 to-black border border-white/10">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Header */}
            <div className="relative z-10 p-5 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl overflow-hidden ring-2",
                    heroesWin ? "ring-emerald-500" : "ring-rose-500"
                  )}>
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/50 to-primary/30 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{userName[0]?.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  {/* Halo effect for winner */}
                  {heroesWin && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-400/20 via-yellow-300/30 to-amber-400/20 blur-md -z-10"
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{userName}</h2>
                  <p className="text-sm text-zinc-400 font-mono">BATTLE RECORD</p>
                </div>
              </div>
            </div>

            {/* Battle Arena - Split Screen with diagonal */}
            <div className="relative h-72 overflow-hidden">
              {/* Heroes Side (Left) */}
              <div 
                className={cn(
                  "absolute inset-y-0 left-0 w-3/5 bg-gradient-to-br p-4",
                  theme.heroGradient
                )}
                style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-white/90" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Heroes</span>
                </div>
                
                {/* Trading Cards */}
                <div className="flex flex-wrap gap-2">
                  {heroes.slice(0, 3).map((hero, i) => (
                    <motion.div
                      key={hero.barcode}
                      initial={{ opacity: 0, scale: 0.8, rotateZ: -10 }}
                      animate={{ opacity: 1, scale: 1, rotateZ: -5 + i * 5 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="w-16 h-20 rounded-lg border-2 border-white/30 bg-black/30 backdrop-blur-sm overflow-hidden shadow-xl"
                      style={{ transform: `translateY(${i * 4}px)` }}
                    >
                      <img src={hero.image} alt={hero.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center">
                        <span className="text-[8px] font-bold text-emerald-400">{hero.score}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {heroes.length === 0 && (
                  <p className="text-xs text-white/50 mt-4">No heroes yet...</p>
                )}
              </div>

              {/* Villains Side (Right) */}
              <div 
                className={cn(
                  "absolute inset-y-0 right-0 w-3/5 bg-gradient-to-bl p-4 flex flex-col items-end",
                  theme.villainGradient
                )}
                style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Villains</span>
                  <Skull className="w-5 h-5 text-white/90" />
                </div>
                
                {/* Trading Cards */}
                <div className="flex flex-wrap gap-2 justify-end">
                  {villains.slice(0, 3).map((villain, i) => (
                    <motion.div
                      key={villain.barcode}
                      initial={{ opacity: 0, scale: 0.8, rotateZ: 10 }}
                      animate={{ opacity: 1, scale: 1, rotateZ: 5 - i * 5 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="w-16 h-20 rounded-lg border-2 border-white/30 bg-black/30 backdrop-blur-sm overflow-hidden shadow-xl"
                      style={{ transform: `translateY(${i * 4}px)` }}
                    >
                      <img src={villain.image} alt={villain.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center">
                        <span className="text-[8px] font-bold text-rose-400">{villain.score}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {villains.length === 0 && (
                  <p className="text-xs text-white/50 mt-4">Clean record!</p>
                )}
              </div>

              {/* Lightning VS Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", damping: 12 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <div className={cn(
                  "w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br rotate-12",
                  theme.vsGradient
                )}
                  style={{
                    clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  }}
                >
                  <Zap className="w-8 h-8 text-black -rotate-12" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={cn(
                    "absolute inset-0 rounded-2xl blur-xl bg-gradient-to-br -z-10",
                    theme.vsGradient
                  )}
                />
              </motion.div>

              {/* Winner Stamp */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: heroesWin ? -12 : 12 }}
                transition={{ delay: 0.6, type: "spring" }}
                className={cn(
                  "absolute bottom-4 px-4 py-2 rounded-lg shadow-2xl backdrop-blur-sm border",
                  heroesWin 
                    ? "left-4 bg-emerald-500/20 border-emerald-400/50" 
                    : "right-4 bg-rose-500/20 border-rose-400/50"
                )}
              >
                <span className={cn(
                  "text-sm font-black uppercase tracking-wider",
                  heroesWin ? "text-emerald-400" : "text-rose-400"
                )}>
                  {heroesWin ? "HERO VICTORY" : "VILLAINS WIN"}
                </span>
              </motion.div>
            </div>

            {/* Footer Stats */}
            <div className="relative z-10 p-5 bg-black/50 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-400">{heroes.length}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Heroes</p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-mono font-bold text-white">
                    {winRate}% <span className="text-xs text-zinc-500">CLEAN</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase">Win Rate</p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-black text-rose-400">{villains.length}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Villains</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
