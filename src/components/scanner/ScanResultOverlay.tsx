import { useState } from "react";
import { ChevronUp, Flame, Leaf, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const themeColor = isGuilty ? "red" : "green";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background with captured frame */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: capturedFrame ? `url(${capturedFrame})` : undefined,
          backgroundColor: "hsl(var(--background))",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-xl bg-black/60" />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-12 right-4 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Glassmorphism Result Card */}
      <div
        className={`relative w-[85%] max-w-sm mx-auto rounded-3xl overflow-hidden animate-scale-in ${
          isGuilty
            ? "shadow-[0_0_60px_rgba(239,68,68,0.4)]"
            : "shadow-[0_0_60px_rgba(34,197,94,0.4)]"
        }`}
      >
        {/* Card background with glass effect */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl border border-white/20" />

        {/* Glow border effect */}
        <div
          className={`absolute inset-0 rounded-3xl ${
            isGuilty
              ? "bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20"
              : "bg-gradient-to-br from-green-500/20 via-transparent to-emerald-500/20"
          }`}
        />

        {/* Card content */}
        <div className="relative z-10 p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${
                isGuilty
                  ? "bg-red-500/20 border border-red-500/40"
                  : "bg-green-500/20 border border-green-500/40"
              }`}
            >
              {isGuilty ? (
                <Flame className="w-5 h-5 text-red-400" />
              ) : (
                <Leaf className="w-5 h-5 text-green-400" />
              )}
              <span
                className={`text-sm font-bold tracking-widest ${
                  isGuilty ? "text-red-400" : "text-green-400"
                }`}
              >
                {isGuilty ? "GUILTY" : "CLEAN"}
              </span>
            </div>
          </div>

          {/* Mascot */}
          <div className="flex justify-center">
            <div
              className={`text-7xl drop-shadow-2xl ${
                isGuilty ? "animate-pulse" : "animate-float"
              }`}
            >
              {isGuilty ? "😈" : "😇"}
            </div>
          </div>

          {/* Product Image */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
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
              <p className="text-sm text-white/60">{product.brand}</p>
            )}
          </div>

          {/* Score Display */}
          <div className="flex justify-center">
            <div
              className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
                isGuilty
                  ? "bg-gradient-to-br from-red-500 to-orange-600"
                  : "bg-gradient-to-br from-green-500 to-emerald-600"
              }`}
              style={{
                boxShadow: isGuilty
                  ? "0 0 30px rgba(239,68,68,0.5)"
                  : "0 0 30px rgba(34,197,94,0.5)",
              }}
            >
              <div className="text-center">
                <span className="text-3xl font-black text-white">
                  {product.score}
                </span>
                <p className="text-xs text-white/80 font-medium">SCORE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Villains Button */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <button className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-105 animate-fade-up animation-delay-300">
            <ChevronUp className="w-5 h-5 text-white animate-bounce" />
            <span className="text-white font-semibold text-sm tracking-wide">
              TAP FOR VILLAINS
            </span>
          </button>
        </DrawerTrigger>

        <DrawerContent className="bg-background/95 backdrop-blur-xl border-t border-white/10">
          <DrawerHeader>
            <DrawerTitle className="text-center text-lg font-bold">
              Ingredient Details
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-6 pb-8 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Negative Points (Villains) */}
            {product.negativePoints && product.negativePoints.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Villains
                </h3>
                <div className="space-y-2">
                  {product.negativePoints.map((point, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-destructive/10 border border-destructive/20"
                    >
                      <p className="text-sm text-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Positive Points (Heroes) */}
            {product.positivePoints && product.positivePoints.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Heroes
                </h3>
                <div className="space-y-2">
                  {product.positivePoints.map((point, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-primary/10 border border-primary/20"
                    >
                      <p className="text-sm text-foreground">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Ingredients */}
            {product.ingredients && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Full Ingredients
                </h3>
                <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
                  <p className="text-muted-foreground">
                    No ingredient details available yet.
                  </p>
                </div>
              )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
