import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface ScoreGradientHeaderProps {
  score: number | null;
  imageUrl: string;
  videoUrl?: string | null;
  productName: string;
  isRevealed: boolean;
  isCalculating?: boolean;
}

// Get stamp text based on score
const getStampInfo = (score: number): { text: string; emoji: string } => {
  if (score <= 30) {
    return { text: "GUILTY PLEASURE", emoji: "🚩" };
  }
  if (score <= 70) {
    return { text: "IT'S A VIBE", emoji: "✨" };
  }
  return { text: "GOATED", emoji: "🐐" };
};

// Get gradient class based on score
const getGradientClass = (score: number | null): string => {
  if (score === null) return "bg-gradient-to-br from-muted to-muted/50";
  if (score <= 30) return "bg-gradient-to-br from-red-500 via-orange-400 to-red-600";
  if (score <= 70) return "bg-gradient-to-br from-blue-500 via-purple-400 to-indigo-600";
  return "bg-gradient-to-br from-emerald-400 via-teal-400 to-amber-400";
};

export const ScoreGradientHeader = ({
  score,
  imageUrl,
  videoUrl,
  productName,
  isRevealed,
  isCalculating = false,
}: ScoreGradientHeaderProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const showVideo = isRevealed && videoUrl && score !== null && score > 0;
  const stampInfo = score !== null ? getStampInfo(score) : null;

  // When revealed, try to play with sound
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      setIsMuted(false);

      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
        }
      });
    }
  }, [showVideo]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      videoRef.current.volume = newMuted ? 0 : 1.0;
      setIsMuted(newMuted);
    }
  };

  return (
    <div className={`relative w-full h-64 ${getGradientClass(score)}`}>
      {/* Background gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />

      {/* Main content - either video or image */}
      <div className="absolute inset-0 flex items-center justify-center">
        {showVideo ? (
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-background/20">
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-background/20">
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover"
            />
            
            {/* Calculating spinner overlay */}
            {isCalculating && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-medium text-foreground">Calculating...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rubber Stamp Overlay */}
      {stampInfo && score !== null && !isCalculating && (
        <div className="absolute top-16 right-4 transform rotate-12">
          <div className={`
            px-3 py-1.5 rounded-lg border-2 
            ${score <= 30 ? 'border-red-200 bg-red-500/90 text-white' : ''}
            ${score > 30 && score <= 70 ? 'border-purple-200 bg-purple-500/90 text-white' : ''}
            ${score > 70 ? 'border-amber-200 bg-emerald-500/90 text-white' : ''}
            shadow-lg
          `}>
            <span className="text-xs font-bold tracking-wider uppercase">
              {stampInfo.emoji} {stampInfo.text}
            </span>
          </div>
        </div>
      )}

      {/* Meme Reaction Bubble - shows the meme in a small bubble */}
      {showVideo && (
        <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full overflow-hidden border-2 border-background shadow-lg">
          <video
            src={videoUrl}
            autoPlay
            loop
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Volume Toggle Button */}
      {showVideo && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 left-4 p-2 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft hover:bg-card transition-colors z-10"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-foreground" />
          ) : (
            <Volume2 className="w-4 h-4 text-foreground" />
          )}
        </button>
      )}
    </div>
  );
};
