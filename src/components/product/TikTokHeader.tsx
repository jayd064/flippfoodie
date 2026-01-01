import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface TikTokHeaderProps {
  score: number | null;
  videoUrl?: string | null;
  productImageUrl: string;
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

// Get gradient class based on score for pattern background
const getPatternGradient = (score: number | null): string => {
  if (score === null) return "bg-gradient-to-br from-muted via-muted/80 to-muted/50";
  if (score <= 30) return "bg-gradient-to-br from-red-600 via-orange-500 to-red-500";
  if (score <= 70) return "bg-gradient-to-br from-blue-600 via-purple-500 to-indigo-500";
  return "bg-gradient-to-br from-emerald-500 via-teal-400 to-amber-400";
};

export const TikTokHeader = ({
  score,
  videoUrl,
  productImageUrl,
  productName,
  isRevealed,
  isCalculating = false,
}: TikTokHeaderProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const showVideo = isRevealed && videoUrl && score !== null && score > 0 && !videoError;
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

  const handleVideoLoad = () => setVideoLoaded(true);
  const handleVideoError = () => setVideoError(true);

  return (
    <div className="relative w-full">
      {/* Meme Header - 35vh cover area */}
      <div className={`relative w-full h-[35vh] overflow-hidden ${getPatternGradient(score)}`}>
        {/* Pattern overlay for visual interest when no video */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Video Cover */}
        {showVideo && (
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

        {/* Volume Toggle Button */}
        {showVideo && videoLoaded && (
          <button
            onClick={toggleMute}
            className="absolute bottom-4 left-4 p-2.5 rounded-full bg-card/80 backdrop-blur-md border border-border/30 shadow-lg hover:bg-card transition-colors z-10"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-foreground" />
            )}
          </button>
        )}

        {/* Score Badge - Glass morphism floating on top-right (Pokémon HP style) */}
        {stampInfo && score !== null && !isCalculating && (
          <div className="absolute top-4 right-4 z-50">
            <div className={`
              px-4 py-2.5 rounded-2xl backdrop-blur-md border shadow-xl
              ${score <= 30 ? 'bg-red-500/70 border-red-300/50 text-white' : ''}
              ${score > 30 && score <= 70 ? 'bg-purple-500/70 border-purple-300/50 text-white' : ''}
              ${score > 70 ? 'bg-emerald-500/70 border-emerald-300/50 text-white' : ''}
            `}>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black">{score}</span>
                <div className="text-left">
                  <span className="text-xs font-bold tracking-wider uppercase block">
                    {stampInfo.emoji} {stampInfo.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculating badge */}
        {isCalculating && (
          <div className="absolute bottom-4 right-4 z-10">
            <div className="px-4 py-2.5 rounded-2xl backdrop-blur-md bg-card/70 border border-border/30 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-foreground">Calculating...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product "Profile Pic" - overlapping the header */}
      <div className="relative z-10 flex justify-center -mt-16">
        <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-background shadow-2xl bg-background">
          <img
            src={productImageUrl}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
