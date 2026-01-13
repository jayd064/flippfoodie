import { Heart, MessageCircle, Share2, TriangleAlert, Shield, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Post } from "@/contexts/PostContext";

interface CinematicFeedCardProps {
  post: Post;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
}

const CinematicFeedCard = ({ post, onLike, onComment, onShare }: CinematicFeedCardProps) => {
  // Determine if this is a "villain" or "hero" post
  const isVillain = post.flag === "alert" || post.flag === "rant";
  const isHero = post.flag === "safe";
  const commentsCount = post.comments.length;

  return (
    <div 
      className="relative w-full h-[calc(100vh-180px)] snap-start snap-always cursor-pointer"
      onClick={() => onComment(post.id)}
    >
      {/* Full Screen Image */}
      <div className="absolute inset-0">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top Gradient for Header */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />

      {/* Bottom Gradient for Text */}
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Savage Badge - Top Left */}
      {isVillain && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 left-4 z-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/90 border border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse">
            <TriangleAlert className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white tracking-wide">⚠️ High Alert</span>
          </div>
        </motion.div>
      )}

      {isHero && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 left-4 z-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/90 border border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white tracking-wide">✅ Verified Clean</span>
          </div>
        </motion.div>
      )}

      {!isVillain && !isHero && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-4 left-4 z-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 border border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-sm font-bold text-white tracking-wide">{post.flagLabel}</span>
          </div>
        </motion.div>
      )}

      {/* Interaction Icons - Right Side with Blur Backdrop */}
      <div 
        className="absolute right-4 bottom-32 flex flex-col gap-5 z-10" 
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
              post.isLiked
                ? "bg-red-500/80 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                : "bg-black/30 text-white border border-white/20 hover:bg-black/50"
            )}
          >
            <Heart className={cn("w-5 h-5", post.isLiked && "fill-current")} />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-lg">
            {post.likes + (post.isLiked ? 1 : 0)}
          </span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onComment(post.id); }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-black/30 border border-white/20 flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition-all">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-lg">{commentsCount}</span>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onShare(post.id); }}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-black/30 border border-white/20 flex items-center justify-center backdrop-blur-md hover:bg-black/50 transition-all">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold text-white drop-shadow-lg">Share</span>
        </button>
      </div>

      {/* Text Content - Bottom */}
      <div className="absolute bottom-6 left-4 right-16 space-y-3 z-10">
        <h3 className="text-2xl font-black text-white leading-tight drop-shadow-2xl">
          {post.title}
        </h3>

        <div className="flex items-center gap-3">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-10 h-10 rounded-full ring-2 ring-white/30"
          />
          <span className="text-base font-semibold text-white/90 drop-shadow-lg">@{post.userName}</span>
        </div>

        <p className="text-sm text-white/70 line-clamp-2 drop-shadow-lg">{post.caption}</p>
      </div>
    </div>
  );
};

export default CinematicFeedCard;
