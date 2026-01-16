import { cn } from "@/lib/utils";

interface EditorialHeaderProps {
  score: number | null;
  productImageUrl: string;
  productName: string;
  isRevealed: boolean;
  isCalculating?: boolean;
}

// Get verdict sticker based on score
const getVerdictSticker = (score: number): { text: string; emoji: string; isWarning: boolean } => {
  if (score < 40) {
    const stickers = [
      { text: "SUGAR BOMB", emoji: "🚫", isWarning: true },
      { text: "RED FLAG", emoji: "🚩", isWarning: true },
      { text: "STAY AWAY", emoji: "⚠️", isWarning: true },
      { text: "JUNK ALERT", emoji: "💀", isWarning: true },
    ];
    return stickers[Math.floor(Math.random() * stickers.length)];
  }
  if (score <= 70) {
    return { text: "PROCEED WITH CAUTION", emoji: "🤔", isWarning: false };
  }
  return { text: "CLEAN CHOICE", emoji: "✅", isWarning: false };
};

// Get background gradient based on score
const getBackgroundGradient = (score: number | null): string => {
  if (score === null) return "bg-gradient-to-b from-[#172554] to-[#0a0a0a]"; // Neutral: Deep Royal Blue
  if (score < 40) return "bg-gradient-to-b from-[#450a0a] to-[#0a0a0a]"; // Villain: Deep Red Velvet
  if (score > 70) return "bg-gradient-to-b from-[#064e3b] to-[#0a0a0a]"; // Hero: Deep Forest Green
  return "bg-gradient-to-b from-[#172554] to-[#0a0a0a]"; // Neutral: Deep Royal Blue
};

// Get score badge color
const getScoreBadgeStyle = (score: number): string => {
  if (score < 40) return "bg-red-600 text-white border-red-400";
  if (score > 70) return "bg-emerald-600 text-white border-emerald-400";
  return "bg-blue-600 text-white border-blue-400";
};

export const EditorialHeader = ({
  score,
  productImageUrl,
  productName,
  isRevealed,
  isCalculating = false,
}: EditorialHeaderProps) => {
  const verdict = score !== null ? getVerdictSticker(score) : null;

  return (
    <div className="relative w-full">
      {/* Deep Matte Background - 40vh */}
      <div className={cn(
        "relative w-full h-[40vh] overflow-hidden",
        getBackgroundGradient(score)
      )}>
        {/* Noise Texture Overlay - Paper/Magazine feel */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Subtle vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />
        
        {/* Radial glow for depth */}
        <div 
          className={cn(
            "absolute inset-0 opacity-30",
            score !== null && score < 40 && "bg-[radial-gradient(ellipse_at_center,_rgba(127,29,29,0.4)_0%,_transparent_70%)]",
            score !== null && score > 70 && "bg-[radial-gradient(ellipse_at_center,_rgba(6,78,59,0.4)_0%,_transparent_70%)]",
            (score === null || (score >= 40 && score <= 70)) && "bg-[radial-gradient(ellipse_at_center,_rgba(23,37,84,0.4)_0%,_transparent_70%)]"
          )}
        />

        {/* Score Badge - 3D Circular Badge (Top Right) */}
        {score !== null && isRevealed && !isCalculating && (
          <div className="absolute top-16 right-4 z-30">
            <div className={cn(
              "w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl",
              getScoreBadgeStyle(score),
              // 3D effect with multiple shadows
              "shadow-[0_8px_32px_rgba(0,0,0,0.4),_inset_0_2px_4px_rgba(255,255,255,0.2)]"
            )}>
              <span className="text-3xl font-black leading-none">{score}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">/100</span>
            </div>
          </div>
        )}

        {/* Calculating badge */}
        {isCalculating && (
          <div className="absolute top-16 right-4 z-30">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/20 bg-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Product Image Container - Overlapping with Floor Reflection */}
      <div className="relative z-10 flex justify-center -mt-24">
        <div className="relative">
          {/* Main Product Image - Clean, no neon borders */}
          <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white shadow-2xl shadow-black/40">
            <img
              src={productImageUrl}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Floor Reflection - Glass table effect */}
          <div className="absolute -bottom-10 left-0 right-0 h-12 overflow-hidden">
            <div 
              className="w-40 h-40 rounded-2xl overflow-hidden mx-auto opacity-30"
              style={{
                transform: 'scaleY(-1)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 60%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 60%)',
              }}
            >
              <img
                src={productImageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Paper Sticker - Die-Cut Physical Sticker Effect */}
          {verdict && isRevealed && !isCalculating && (
            <div 
              className={cn(
                "absolute -top-4 -right-8 z-20 transform rotate-[-6deg]",
                "px-4 py-2 rounded-lg",
                "border-4 border-white shadow-xl",
                // Hard shadow to make it lift off the screen
                "shadow-[4px_6px_12px_rgba(0,0,0,0.5)]",
                verdict.isWarning 
                  ? "bg-red-500" 
                  : score !== null && score > 70 
                    ? "bg-emerald-500" 
                    : "bg-amber-400"
              )}
            >
              <span className={cn(
                "text-sm font-black tracking-wide whitespace-nowrap",
                verdict.isWarning || (score !== null && score > 70) ? "text-white" : "text-black"
              )}>
                {verdict.emoji} {verdict.text}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Extra spacing to account for reflection */}
      <div className="h-8" />
    </div>
  );
};