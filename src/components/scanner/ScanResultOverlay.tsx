import { useState, useEffect, useMemo } from "react";
import { ChevronUp, Flame, Leaf, Skull, Shield, X, Share2, ExternalLink, Zap, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getAffiliateLink, AMAZON_DISCLAIMER } from "@/lib/linkUtils";
import { products as globalProducts, getHeroSwap } from "@/data/GlobalStore";
import { useAdmin } from "@/contexts/AdminContext";
import { useGamification } from "@/hooks/useGamification";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Savage roast arrays based on score
const SAVAGE_ROASTS = {
  critical: [ // Score < 30
    "Diabetes Starter Pack 💉",
    "Hello Cardiologist 👨‍⚕️",
    "80% Sugar, 20% Prayers 🙏",
    "Liquid Stress 😰",
    "Your Gym Trainer's Nightmare 🏋️",
    "Insurance Premium Increaser 📈",
  ],
  bad: [ // Score 30-40
    "Proceed with Caution ⚠️",
    "Your Body Will Judge You 👀",
    "Not Your Best Decision 🤔",
    "Regret in 3... 2... 1... 😬",
  ],
};

interface ScanResultOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  product: {
    name: string;
    brand?: string;
    image?: string;
    score: number;
    ingredients?: string;
    negativePoints?: string[];
    positivePoints?: string[];
  };
  capturedFrame?: string;
}

export const ScanResultOverlay = ({
  isOpen,
  onClose,
  onShare,
  product,
  capturedFrame,
}: ScanResultOverlayProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasRecordedScan, setHasRecordedScan] = useState(false);
  const { getLinkOverride } = useAdmin();
  const { recordScan } = useGamification();

  const isGuilty = product.score < 40;
  const isCritical = product.score < 30;
  const needsMeltingEffect = product.score < 50;
  
  // Get random savage roast
  const savageRoast = useMemo(() => {
    if (isCritical) {
      return SAVAGE_ROASTS.critical[Math.floor(Math.random() * SAVAGE_ROASTS.critical.length)];
    } else if (isGuilty) {
      return SAVAGE_ROASTS.bad[Math.floor(Math.random() * SAVAGE_ROASTS.bad.length)];
    }
    return null;
  }, [isCritical, isGuilty]);
  
  // Record scan when overlay opens (only once per scan)
  useEffect(() => {
    if (isOpen && !hasRecordedScan && product.name) {
      recordScan(isGuilty);
      setHasRecordedScan(true);
    }
    // Reset when overlay closes
    if (!isOpen) {
      setHasRecordedScan(false);
    }
  }, [isOpen, hasRecordedScan, product.name, isGuilty, recordScan]);

  if (!isOpen) return null;
  
  // Find matching product in GlobalStore or use auto-search
  const matchedProduct = globalProducts.find(
    (p) => product.name?.toLowerCase().includes(p.name.split(' ')[0].toLowerCase())
  );
  const heroSwap = matchedProduct && matchedProduct.isVillain ? getHeroSwap(matchedProduct.id) : undefined;
  
  const handleBuyProduct = () => {
    const adminOverride = getLinkOverride(product.name);
    const manualUrl = matchedProduct?.affiliateUrl;
    const affiliateLink = getAffiliateLink(product.name, manualUrl, adminOverride);
    
    toast.success("Opening Amazon...", {
      description: `Finding ${product.name}`,
      duration: 2000,
    });
    setTimeout(() => window.open(affiliateLink, "_blank"), 1000);
  };
  
  const handleBuyHero = () => {
    if (!heroSwap) return;
    const adminOverride = getLinkOverride(heroSwap.name);
    const affiliateLink = getAffiliateLink(heroSwap.name, heroSwap.affiliateUrl, adminOverride);
    
    toast.success("Opening Amazon...", {
      description: `Get healthier: ${heroSwap.name}`,
      duration: 2000,
    });
    setTimeout(() => window.open(affiliateLink, "_blank"), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background with captured frame */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: capturedFrame ? `url(${capturedFrame})` : undefined,
          backgroundColor: "#0a0a0a",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-xl bg-black/70" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-12 right-4 z-20 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
      >
        <X className="w-5 h-5 text-white/60" />
      </button>

      {/* Deep Glass Result Card */}
      <div className="relative w-[85%] max-w-sm mx-auto animate-scale-in">
        {/* Glow effect at top edge */}
        <div 
          className={`absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-full blur-sm ${
            isGuilty ? 'bg-red-500' : 'bg-emerald-500'
          }`}
          style={{
            boxShadow: isGuilty 
              ? '0 0 20px 8px rgba(239,68,68,0.4)' 
              : '0 0 20px 8px rgba(16,185,129,0.4)'
          }}
        />
        
        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden bg-[#151515]/90 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Top accent line */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 ${
            isGuilty 
              ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent' 
              : 'bg-gradient-to-r from-transparent via-emerald-500 to-transparent'
          }`} />
          
          {/* Card content */}
          <div className="relative z-10 p-6 space-y-5">
            {/* Large Icon */}
            <div className="flex justify-center">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                  isGuilty 
                    ? 'bg-red-500/10 border border-red-500/20' 
                    : 'bg-emerald-500/10 border border-emerald-500/20'
                }`}
                style={{
                  boxShadow: isGuilty
                    ? '0 0 30px rgba(239,68,68,0.2)'
                    : '0 0 30px rgba(16,185,129,0.2)'
                }}
              >
                {isGuilty ? (
                  <Skull className="w-12 h-12 text-red-400" />
                ) : (
                  <Shield className="w-12 h-12 text-emerald-400" />
                )}
              </div>
            </div>

            {/* Status Badge - Savage Roast Edition */}
            <div className="flex items-center justify-center">
              {savageRoast ? (
                <div className="relative">
                  {/* Glitch/Caution tape background */}
                  <div 
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-900/80 via-orange-900/80 to-red-900/80 blur-sm animate-pulse"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.3) 20px)'
                    }}
                  />
                  <div
                    className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600/90 to-orange-600/90 border-2 border-red-400/50"
                    style={{
                      boxShadow: '0 0 20px rgba(239,68,68,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                      animation: isCritical ? 'pulse 1.5s ease-in-out infinite' : undefined
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 text-yellow-300 animate-pulse" />
                    <span className="text-xs font-black tracking-wide text-white drop-shadow-lg">
                      {savageRoast}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                >
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold tracking-widest text-emerald-400">
                    CLEAN
                  </span>
                </div>
              )}
            </div>

            {/* Product Image - With Melting Effect for Low Scores */}
            <div className="flex justify-center">
              <div 
                className={`relative w-28 h-28 rounded-2xl overflow-hidden bg-[#1a1a1a] border shadow-xl transition-all duration-500 ${
                  needsMeltingEffect 
                    ? 'border-red-500/30' 
                    : 'border-white/5'
                }`}
                style={needsMeltingEffect ? {
                  filter: 'drop-shadow(0 8px 16px rgba(239,68,68,0.3))',
                  animation: 'melt 3s ease-in-out infinite',
                } : {}}
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    needsMeltingEffect ? 'saturate-75' : ''
                  }`}
                  style={needsMeltingEffect ? {
                    animation: 'drip 2s ease-in-out infinite',
                  } : {}}
                />
                {/* Toxic drip overlay */}
                {needsMeltingEffect && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, transparent 60%, rgba(239,68,68,0.2) 100%)',
                      animation: 'drip 2s ease-in-out infinite',
                    }}
                  />
                )}
              </div>
            </div>
            
            {/* CSS Keyframes for melting effect */}
            <style>{`
              @keyframes melt {
                0%, 100% { transform: scaleY(1) translateY(0); }
                50% { transform: scaleY(1.02) translateY(2px); }
              }
              @keyframes drip {
                0%, 100% { opacity: 0.6; transform: translateY(0); }
                50% { opacity: 1; transform: translateY(3px); }
              }
            `}</style>

            {/* Product Info */}
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-white truncate">
                {product.name}
              </h2>
              {product.brand && (
                <p className="text-sm text-zinc-500">{product.brand}</p>
              )}
            </div>

            {/* Score Display - Circular Glowing Badge */}
            <div className="flex justify-center">
              <div
                className={`relative w-20 h-20 rounded-full flex items-center justify-center ${
                  isGuilty
                    ? "bg-gradient-to-br from-red-500 to-orange-600"
                    : "bg-gradient-to-br from-emerald-500 to-teal-600"
                }`}
                style={{
                  boxShadow: isGuilty
                    ? "0 0 30px rgba(239,68,68,0.5)"
                    : "0 0 30px rgba(16,185,129,0.5)",
                }}
              >
                <div className="text-center">
                  <span className="text-2xl font-black text-white">
                    {product.score}
                  </span>
                  <p className="text-[10px] text-white/80 font-medium tracking-wider">SCORE</p>
                </div>
              </div>
            </div>

            {/* Smart Swap Section - Revenue Source #1 */}
            {isGuilty && heroSwap && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/20">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-red-400 tracking-wide">
                    DON'T EAT THIS TRASH
                  </span>
                </div>
                
                {/* Side-by-side comparison */}
                <div className="flex items-center gap-3 mb-3">
                  {/* Villain (crossed out) */}
                  <div className="relative flex-1 p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-500 rotate-45 opacity-60" />
                    </div>
                    <img 
                      src={product.image || "/placeholder.svg"} 
                      alt={product.name}
                      className="w-12 h-12 mx-auto rounded-lg object-cover opacity-50"
                    />
                  </div>
                  
                  {/* Arrow */}
                  <Zap className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
                  
                  {/* Hero */}
                  <div className="flex-1 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <img 
                      src={heroSwap.image || "/placeholder.svg"} 
                      alt={heroSwap.name}
                      className="w-12 h-12 mx-auto rounded-lg object-cover"
                    />
                  </div>
                </div>
                
                {/* Swap text */}
                <p className="text-xs text-center text-white/80 mb-3">
                  Switch to <span className="font-bold text-emerald-400">{heroSwap.name}</span> for{' '}
                  <span className="font-bold text-emerald-400">+{Math.min(100 - product.score, 60)} Health</span>
                </p>
                
                {/* Big pulsing CTA button */}
                <button
                  onClick={handleBuyHero}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 animate-pulse"
                  style={{
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  <ExternalLink className="w-5 h-5" />
                  Buy {heroSwap.name.split(' ')[0]} on Blinkit
                </button>
              </div>
            )}

            {/* Buy Buttons */}
            <div className="space-y-2">
              {/* Buy Hero for Clean Products */}
              {!isGuilty && (
                <button
                  onClick={handleBuyProduct}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  Buy on Amazon
                </button>
              )}
              
              {/* Villain Buy Button - Ghost/Outline Style */}
              {isGuilty && (
                <button
                  onClick={handleBuyProduct}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-transparent border border-white/20 text-white/50 font-medium hover:bg-white/5 hover:border-white/30 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buy it anyway (Good luck) 🤞
                </button>
              )}
              
              {/* Disclaimer */}
              <p className="text-[9px] text-zinc-500 text-center">
                {AMAZON_DISCLAIMER}
              </p>
            </div>

            {/* Share to Community Button */}
            {onShare && (
              <button
                onClick={onShare}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all"
                style={{
                  boxShadow: "0 0 20px rgba(16,185,129,0.2)",
                }}
              >
                <Share2 className="w-5 h-5" />
                Share to Community
              </button>
            )}

            {/* Bouncing Chevron - Drawer Trigger */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <button className="w-full flex flex-col items-center gap-1 pt-2">
                  <ChevronUp className={`w-6 h-6 animate-bounce ${isGuilty ? 'text-red-400' : 'text-emerald-400'}`} />
                  <span className="text-xs text-zinc-500 tracking-wide">DETAILS</span>
                </button>
              </DrawerTrigger>

              <DrawerContent className="bg-[#0a0a0a] backdrop-blur-xl border-t border-white/10">
                <DrawerHeader>
                  <DrawerTitle className="text-center text-lg font-bold text-white tracking-wide">
                    Ingredient Details
                  </DrawerTitle>
                </DrawerHeader>

                <div className="px-6 pb-8 space-y-4 max-h-[60vh] overflow-y-auto">
                  {/* Negative Points (Villains) */}
                  {product.negativePoints && product.negativePoints.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                        <Skull className="w-4 h-4" />
                        Villains
                      </h3>
                      <div className="space-y-2">
                        {product.negativePoints.map((point, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-xl bg-red-500/5 border border-red-500/10"
                          >
                            <p className="text-sm text-white/80">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Positive Points (Heroes) */}
                  {product.positivePoints && product.positivePoints.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Heroes
                      </h3>
                      <div className="space-y-2">
                        {product.positivePoints.map((point, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
                          >
                            <p className="text-sm text-white/80">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Ingredients */}
                  {product.ingredients && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-zinc-500">
                        Full Ingredients
                      </h3>
                      <div className="p-3 rounded-xl bg-[#151515] border border-white/5">
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {product.ingredients}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fallback if no data */}
                  {!product.negativePoints?.length &&
                    !product.positivePoints?.length &&
                    !product.ingredients && (
                      <div className="text-center py-8">
                        <p className="text-zinc-500">
                          No ingredient details available yet.
                        </p>
                      </div>
                    )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
};
