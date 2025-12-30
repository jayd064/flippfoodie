import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface MemeHeaderProps {
  videoUrl: string;
  fallbackImageUrl: string;
  productName: string;
  isRevealed: boolean;
}

export const MemeHeader = ({ 
  videoUrl, 
  fallbackImageUrl, 
  productName,
  isRevealed 
}: MemeHeaderProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // When revealed, try to play with sound
  useEffect(() => {
    if (isRevealed && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      setIsMuted(false);
      
      // Attempt to play - may be blocked by browser
      videoRef.current.play().catch(() => {
        // Autoplay with sound blocked, fall back to muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
        }
      });
    }
  }, [isRevealed]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      videoRef.current.volume = newMuted ? 0 : 1.0;
      setIsMuted(newMuted);
    }
  };

  if (!isRevealed) {
    return (
      <img
        src={fallbackImageUrl}
        alt={productName}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover"
      />
      
      {/* Volume Toggle Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 p-2.5 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-soft hover:bg-card transition-colors z-10"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-foreground" />
        ) : (
          <Volume2 className="w-5 h-5 text-foreground" />
        )}
      </button>
    </div>
  );
};
