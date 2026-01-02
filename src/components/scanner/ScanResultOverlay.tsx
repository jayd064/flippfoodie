import { useState } from "react";
import { ChevronUp, Flame, Leaf, Skull, Shield, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ScanResultOverlayProps {
  isOpen: boolean;
  onClose: () => void;
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
  product,
  capturedFrame,
}: ScanResultOverlayProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!isOpen) return null;

  const isGuilty = product.score < 40;

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

            {/* Status Badge */}
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${
                  isGuilty
                    ? "bg-red-500/10 border border-red-500/20"
                    : "bg-emerald-500/10 border border-emerald-500/20"
                }`}
              >
                {isGuilty ? (
                  <Flame className="w-4 h-4 text-red-400" />
                ) : (
                  <Leaf className="w-4 h-4 text-emerald-400" />
                )}
                <span
                  className={`text-xs font-bold tracking-widest ${
                    isGuilty ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {isGuilty ? "GUILTY" : "CLEAN"}
                </span>
              </div>
            </div>

            {/* Product Image */}
            <div className="flex justify-center">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5 shadow-xl">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

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
