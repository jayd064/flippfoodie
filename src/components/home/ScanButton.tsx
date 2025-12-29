import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

export const ScanButton = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Pulsing rings */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full bg-primary/15 animate-pulse-ring animation-delay-300" />
        
        {/* Main button */}
        <Link
          to="/product"
          className="relative flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-glow-primary hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
        >
          <div className="flex flex-col items-center gap-2 text-primary-foreground">
            <Camera className="w-12 h-12" strokeWidth={1.5} />
            <span className="text-sm font-semibold tracking-wide">Scan Food</span>
          </div>
        </Link>
      </div>
      
      <p className="text-muted-foreground text-sm text-center max-w-[200px]">
        Point your camera at any food product to see its health score
      </p>
    </div>
  );
};
