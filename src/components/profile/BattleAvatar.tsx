import { useState } from "react";
import { CinematicBattleCard } from "./CinematicBattleCard";
import { cn } from "@/lib/utils";

interface BattleAvatarProps {
  userId: string;
  userName: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BattleAvatar = ({ userId, userName, avatarUrl, size = "md", className }: BattleAvatarProps) => {
  const [showBattle, setShowBattle] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <button
        onClick={() => setShowBattle(true)}
        className={cn(
          "rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-all hover:scale-105 active:scale-95",
          sizeClasses[size],
          className
        )}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/50 to-primary/30 flex items-center justify-center">
            <span className={cn(
              "font-semibold text-foreground",
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-base"
            )}>
              {getInitials(userName)}
            </span>
          </div>
        )}
      </button>

      <CinematicBattleCard
        userId={userId}
        userName={userName}
        userAvatar={avatarUrl}
        isOpen={showBattle}
        onClose={() => setShowBattle(false)}
      />
    </>
  );
};
