import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Skull } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserStory {
  id: string;
  display_name: string;
  avatar_url: string | null;
  lastScanScore: number | null;
  lastProductName: string | null;
  lastProductImage: string | null;
  hasNewUpdate: boolean;
}

interface StoryViewerProps {
  user: UserStory;
  onClose: () => void;
}

export const StoryViewer = ({ user, onClose }: StoryViewerProps) => {
  const [progress, setProgress] = useState(0);
  const STORY_DURATION = 5000; // 5 seconds

  const isHero = (user.lastScanScore ?? 0) >= 50;
  const isVillain = !isHero;

  // Auto-progress timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onClose]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const caption = isHero
    ? `${user.display_name} is eating clean today! 🌿`
    : `${user.display_name} found a Villain! 😈`;

  const storyContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "fixed inset-0 z-[99999]",
          "bg-black/95 backdrop-blur-xl",
          "flex flex-col"
        )}
        onClick={onClose}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 px-3 pt-3 z-10">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                isHero
                  ? "bg-gradient-to-r from-emerald-400 to-green-500"
                  : "bg-gradient-to-r from-red-500 to-orange-500"
              )}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: "linear" }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-8 pb-4">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <div
              className={cn(
                "w-10 h-10 rounded-full overflow-hidden",
                "bg-gradient-to-br from-zinc-700 to-zinc-800",
                "flex items-center justify-center",
                "ring-2",
                isHero ? "ring-emerald-500" : "ring-red-500"
              )}
            >
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-foreground">
                  {getInitials(user.display_name)}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.display_name}</p>
              <p className="text-xs text-white/60">Just now</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Main Content */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-8 gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Product Image with Glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", damping: 20 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div
              className={cn(
                "absolute inset-0 -m-4 rounded-3xl blur-2xl opacity-50",
                isHero
                  ? "bg-gradient-to-br from-emerald-500 to-green-600"
                  : "bg-gradient-to-br from-red-500 to-orange-600"
              )}
            />

            {/* Product Image */}
            <div className="relative w-56 h-56 rounded-2xl overflow-hidden bg-zinc-900">
              {user.lastProductImage ? (
                <img
                  src={user.lastProductImage}
                  alt={user.lastProductName || "Product"}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>

            {/* Badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", damping: 15 }}
              className={cn(
                "absolute -bottom-3 -right-3",
                "w-14 h-14 rounded-full",
                "flex items-center justify-center",
                "shadow-lg",
                isHero
                  ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30"
                  : "bg-gradient-to-br from-red-500 to-orange-600 shadow-red-500/30"
              )}
            >
              {isHero ? (
                <Shield className="w-7 h-7 text-white" />
              ) : (
                <Skull className="w-7 h-7 text-white" />
              )}
            </motion.div>
          </motion.div>

          {/* Product Name */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white text-center"
          >
            {user.lastProductName || "Unknown Product"}
          </motion.h2>

          {/* Score Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className={cn(
              "px-4 py-2 rounded-full",
              "text-sm font-semibold",
              isHero
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {isHero ? "🌿 HERO" : "😈 VILLAIN"} • Score: {user.lastScanScore ?? "?"}
          </motion.div>

          {/* Caption */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/80 text-center max-w-xs"
          >
            {caption}
          </motion.p>
        </div>

        {/* Bottom Tap Hint */}
        <div className="px-8 py-8 text-center">
          <p className="text-xs text-white/40">Tap anywhere to close</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(storyContent, document.body);
};
