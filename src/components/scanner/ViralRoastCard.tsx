import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, X, Sparkles } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";

interface ViralRoastCardProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    brand?: string;
    image?: string;
    score: number;
    negativePoints?: string[];
    positivePoints?: string[];
  };
}

// Savage labels for villains
const VILLAIN_ROASTS = [
  "Liquid Stress",
  "Diabetes Starter Pack",
  "80% Sugar, 20% Prayers",
  "Your Gut Hates This",
  "Chemical Cocktail",
  "Processed Poison",
  "Sugar Bomb",
  "Junk in Disguise",
];

// Hero labels
const HERO_LABELS = [
  "Clean Fuel",
  "Body Approved",
  "Guilt-Free Choice",
  "Real Food Energy",
  "Nature's Best",
  "Smart Choice",
];

export const ViralRoastCard = ({
  isOpen,
  onClose,
  product,
}: ViralRoastCardProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isVillain = product.score < 50;
  const roastLabel = isVillain
    ? VILLAIN_ROASTS[Math.floor(Math.random() * VILLAIN_ROASTS.length)]
    : HERO_LABELS[Math.floor(Math.random() * HERO_LABELS.length)];

  useEffect(() => {
    if (isOpen) {
      // Trigger content after modal opens for slam effect
      setTimeout(() => setShowContent(true), 100);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  const handleCapture = async () => {
    if (!cardRef.current) return;

    setIsCapturing(true);
    toast({
      title: "Creating your roast card... 🔥",
      description: "This will just take a second",
    });

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );

      // Try Web Share API first
      if (navigator.share && navigator.canShare?.({ files: [new File([blob], "flipp-roast.png", { type: "image/png" })] })) {
        const file = new File([blob], "flipp-roast.png", { type: "image/png" });
        await navigator.share({
          files: [file],
          title: "Flipp Verdict",
          text: `Check out this product: ${product.name} scored ${product.score}/100!`,
        });
        toast({
          title: "Shared successfully! 🎉",
        });
      } else {
        // Fallback: Download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "flipp-roast.png";
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: "Image downloaded! 📥",
          description: "Share it on your story!",
        });
      }
    } catch (error) {
      console.error("Error capturing:", error);
      toast({
        title: "Couldn't capture image",
        description: "Try taking a screenshot instead!",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Card Container - 9:16 aspect ratio for stories */}
        <motion.div
          initial={{ scale: 1.5, opacity: 0, rotate: -5 }}
          animate={
            showContent
              ? {
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                  },
                }
              : {}
          }
          className="relative w-[320px] aspect-[9/16] max-h-[90vh] overflow-hidden rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* The Capturable Card */}
          <div
            ref={cardRef}
            className={`relative w-full h-full overflow-hidden ${
              isVillain ? "bg-[#0a0a0a]" : "bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900"
            }`}
          >
            {/* Villain: Caution Tape Pattern */}
            {isVillain && (
              <>
                {/* Red Vignette */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-red-900/60 pointer-events-none" />
                
                {/* Animated Caution Tape Stripes */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-8 bg-yellow-400"
                      style={{
                        width: "200%",
                        left: "-50%",
                        top: `${i * 80 + 20}px`,
                        transform: "rotate(-15deg)",
                        background: `repeating-linear-gradient(
                          90deg,
                          #facc15 0px,
                          #facc15 40px,
                          #0a0a0a 40px,
                          #0a0a0a 80px
                        )`,
                      }}
                      animate={{
                        x: [0, 80],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>
                
                {/* Warning corners */}
                <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-red-500/50" />
                <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-red-500/50" />
                <div className="absolute bottom-24 left-4 w-12 h-12 border-l-4 border-b-4 border-red-500/50" />
                <div className="absolute bottom-24 right-4 w-12 h-12 border-r-4 border-b-4 border-red-500/50" />
              </>
            )}

            {/* Hero: Light Ray Overlays */}
            {!isVillain && (
              <>
                {/* Soft light rays */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-white/20 to-transparent blur-2xl"
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3],
                      x: [-20, 20, -20]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute top-0 right-1/4 w-24 h-full bg-gradient-to-b from-yellow-200/20 to-transparent blur-2xl"
                    animate={{ 
                      opacity: [0.4, 0.7, 0.4],
                      x: [20, -20, 20]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
                
                {/* Sparkle corners */}
                <Sparkles className="absolute top-6 left-6 w-6 h-6 text-yellow-300/60" />
                <Sparkles className="absolute top-6 right-6 w-6 h-6 text-yellow-300/60" />
              </>
            )}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center h-full px-6 py-8">
              {/* Top: Flipp Verdict */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={showContent ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h1
                  className={`text-2xl font-black tracking-[0.3em] ${
                    isVillain ? "text-red-400" : "text-emerald-300"
                  }`}
                  style={{
                    fontFamily: "'Impact', 'Arial Black', sans-serif",
                    textShadow: isVillain
                      ? "0 0 30px rgba(239, 68, 68, 0.5)"
                      : "0 0 30px rgba(16, 185, 129, 0.5)",
                  }}
                >
                  FLIPP VERDICT
                </h1>
                <div className={`mt-1 h-0.5 w-32 mx-auto ${isVillain ? "bg-red-500/50" : "bg-emerald-400/50"}`} />
              </motion.div>

              {/* Center: Product Image */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={showContent ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.3, type: "spring", damping: 15 }}
                className="flex-1 flex items-center justify-center my-6"
              >
                <div className="relative">
                  {/* Heavy Drop Shadow */}
                  <div
                    className={`absolute inset-0 rounded-3xl blur-3xl ${
                      isVillain ? "bg-red-500/30" : "bg-emerald-400/30"
                    }`}
                    style={{ transform: "translateY(20px)" }}
                  />
                  
                  {/* Product Image */}
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="relative w-44 h-44 object-cover rounded-3xl border-4 border-white/20"
                    style={{
                      boxShadow: isVillain
                        ? "0 25px 50px -12px rgba(239, 68, 68, 0.5)"
                        : "0 25px 50px -12px rgba(16, 185, 129, 0.5)",
                    }}
                  />
                  
                  {/* 3D Score Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={showContent ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.5, type: "spring", damping: 12 }}
                    className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center ${
                      isVillain
                        ? "bg-gradient-to-br from-red-500 to-red-700"
                        : "bg-gradient-to-br from-emerald-400 to-emerald-600"
                    }`}
                    style={{
                      boxShadow: isVillain
                        ? "0 10px 30px -5px rgba(239, 68, 68, 0.6), inset 0 -4px 0 rgba(0,0,0,0.3)"
                        : "0 10px 30px -5px rgba(16, 185, 129, 0.6), inset 0 -4px 0 rgba(0,0,0,0.3)",
                    }}
                  >
                    <span className="text-2xl font-black text-white">{product.score}</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* The Roast Label */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={showContent ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
                className="text-center mb-4"
              >
                <p
                  className={`text-4xl font-black leading-tight ${
                    isVillain ? "text-white" : "text-white"
                  }`}
                  style={{
                    fontFamily: "'Impact', 'Arial Black', sans-serif",
                    textShadow: isVillain
                      ? "2px 2px 0 #ef4444, -2px -2px 0 #ef4444, 2px -2px 0 #ef4444, -2px 2px 0 #ef4444"
                      : "2px 2px 0 #10b981, -2px -2px 0 #10b981, 2px -2px 0 #10b981, -2px 2px 0 #10b981",
                  }}
                >
                  "{roastLabel}"
                </p>
                <p className="mt-2 text-sm text-white/60">{product.name}</p>
                {product.brand && (
                  <p className="text-xs text-white/40">by {product.brand}</p>
                )}
              </motion.div>

              {/* Footer: Watermark */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={showContent ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <p className="text-xs text-white/40 tracking-widest uppercase">
                  Scanned on Flipp app
                </p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${isVillain ? "bg-red-400" : "bg-emerald-400"}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${isVillain ? "bg-red-400/60" : "bg-emerald-400/60"}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${isVillain ? "bg-red-400/30" : "bg-emerald-400/30"}`} />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons - Below the card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3 px-6"
        >
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all disabled:opacity-50"
            style={{
              boxShadow: "0 0 30px rgba(255,255,255,0.3)",
            }}
          >
            {isCapturing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Creating...
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share Card
              </>
            )}
          </button>
          
          <p className="text-xs text-white/40 text-center">
            📸 Take a Screenshot to post on Story!
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
