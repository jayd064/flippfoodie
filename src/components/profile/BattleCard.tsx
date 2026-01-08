import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Swords, Shield, Skull } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface BattleCardProps {
  userId: string;
  userName: string;
  userAvatar?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ScanItem {
  barcode: string;
  name: string;
  image: string;
  score: number;
}

export const BattleCard = ({ userId, userName, userAvatar, isOpen, onClose }: BattleCardProps) => {
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUserScans = async () => {
      try {
        // Fetch last 5 scans for this user
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

        // Fallback demo data if no scans
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

  const heroes = scans.filter(s => s.score >= 50);
  const villains = scans.filter(s => s.score < 50);
  const heroesWin = heroes.length >= villains.length;

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
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

        {/* Battle Card */}
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.8, rotate: 5 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm overflow-hidden rounded-2xl border-4 border-black shadow-2xl"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        >
          {/* Halftone Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
              backgroundSize: "8px 8px",
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-50 w-10 h-10 rounded-full bg-black border-2 border-white flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Header */}
          <div className="relative z-10 p-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 border-b-4 border-black">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-black bg-white overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-xl font-black text-white">{userName[0]?.toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-tight">{userName}'s</h2>
                <p className="text-xs font-bold text-black/70 uppercase">Food Battle!</p>
              </div>
            </div>
          </div>

          {/* Battle Arena - Split Screen */}
          <div className="relative h-64 flex">
            {/* Heroes Side (Left) */}
            <div 
              className="flex-1 relative bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-3 border-r-2 border-black"
              style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
            >
              <div className="flex items-center gap-1 mb-2">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-xs font-black text-white uppercase">Heroes</span>
                <span className="ml-auto text-lg font-black text-white">{heroes.length}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {heroes.slice(0, 3).map((hero, i) => (
                  <div 
                    key={hero.barcode}
                    className="w-14 h-14 rounded-lg border-2 border-black bg-white overflow-hidden shadow-lg"
                    style={{ transform: `rotate(${-5 + i * 5}deg)` }}
                  >
                    <img src={hero.image} alt={hero.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {heroes.length === 0 && (
                  <div className="text-xs text-white/70 font-bold">No heroes yet!</div>
                )}
              </div>
              
              {/* Winner Stamp */}
              {heroesWin && (
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: -15 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute bottom-2 left-2 px-2 py-1 bg-white border-2 border-black rounded shadow-lg"
                >
                  <span className="text-xs font-black text-emerald-600 uppercase">Hero Victory!</span>
                </motion.div>
              )}
            </div>

            {/* VS Badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
                className="relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 border-4 border-black rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                  }}
                >
                  <Swords className="w-8 h-8 text-black" />
                </div>
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-2xl font-black text-yellow-400 drop-shadow-lg" style={{ WebkitTextStroke: "2px black" }}>
                  VS
                </span>
              </motion.div>
            </div>

            {/* Villains Side (Right) */}
            <div 
              className="flex-1 relative bg-gradient-to-bl from-red-500 via-rose-500 to-red-600 p-3 border-l-2 border-black"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" }}
            >
              <div className="flex items-center gap-1 mb-2 justify-end">
                <span className="text-lg font-black text-white">{villains.length}</span>
                <span className="text-xs font-black text-white uppercase">Villains</span>
                <Skull className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-wrap gap-1 justify-end">
                {villains.slice(0, 3).map((villain, i) => (
                  <div 
                    key={villain.barcode}
                    className="w-14 h-14 rounded-lg border-2 border-black bg-white overflow-hidden shadow-lg"
                    style={{ transform: `rotate(${5 - i * 5}deg)` }}
                  >
                    <img src={villain.image} alt={villain.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {villains.length === 0 && (
                  <div className="text-xs text-white/70 font-bold">Clean eater!</div>
                )}
              </div>
              
              {/* Winner Stamp */}
              {!heroesWin && (
                <motion.div
                  initial={{ scale: 0, rotate: 30 }}
                  animate={{ scale: 1, rotate: 15 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute bottom-2 right-2 px-2 py-1 bg-black border-2 border-red-300 rounded shadow-lg"
                >
                  <span className="text-xs font-black text-red-400 uppercase">Villains Win!</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="relative z-10 p-4 bg-zinc-900 border-t-4 border-black">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-black text-emerald-400">{heroes.length}</p>
                <p className="text-xs font-bold text-zinc-400 uppercase">Heroes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-zinc-300">Last 5 Scans</p>
                <p className="text-xs text-zinc-500">Battle Summary</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-red-400">{villains.length}</p>
                <p className="text-xs font-bold text-zinc-400 uppercase">Villains</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
