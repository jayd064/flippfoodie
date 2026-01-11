import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
}

const VerifiedBadge = ({ 
  size = "sm", 
  className,
  showLabel = false 
}: VerifiedBadgeProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const containerClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div
        className={cn(
          containerClasses[size],
          "relative flex items-center justify-center",
          "bg-gradient-to-br from-amber-400 to-amber-600",
          "rounded-full shadow-lg shadow-amber-500/30"
        )}
      >
        <ShieldCheck 
          className={cn(
            sizeClasses[size],
            "text-black drop-shadow-sm",
            "p-0.5"
          )} 
        />
      </div>
      {showLabel && (
        <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide">
          Verified
        </span>
      )}
    </div>
  );
};

export default VerifiedBadge;
