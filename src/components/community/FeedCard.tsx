import { Heart, MessageCircle, Share2, TriangleAlert, Star, Shield, HelpCircle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedCardProps {
  post: {
    id: string;
    image: string;
    flag: "alert" | "review" | "safe" | "question" | "rant";
    flagLabel: string;
    title: string;
    caption: string;
    userName: string;
    userAvatar: string;
    likes: number;
    comments: number;
    isLiked: boolean;
  };
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
}

const flagStyles = {
  alert: {
    bg: "bg-black/50 border-red-500/50",
    text: "text-red-400",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    icon: TriangleAlert,
  },
  review: {
    bg: "bg-black/50 border-amber-500/50",
    text: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    icon: Star,
  },
  safe: {
    bg: "bg-black/50 border-emerald-500/50",
    text: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    icon: Shield,
  },
  question: {
    bg: "bg-black/50 border-blue-500/50",
    text: "text-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    icon: HelpCircle,
  },
  rant: {
    bg: "bg-black/50 border-orange-500/50",
    text: "text-orange-400",
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
    icon: Flame,
  },
};

const FeedCard = ({ post, onLike, onComment, onShare }: FeedCardProps) => {
  const flagStyle = flagStyles[post.flag];
  const FlagIcon = flagStyle.icon;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden mb-6 bg-[#151515]">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Premium Flag - Top Left */}
        <div
          className={cn(
            "absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm",
            flagStyle.bg,
            flagStyle.glow
          )}
        >
          <FlagIcon className={cn("w-3.5 h-3.5", flagStyle.text)} />
          <span className={cn("text-xs font-semibold", flagStyle.text)}>
            {post.flagLabel}
          </span>
        </div>

        {/* Action Bar - Floating Right */}
        <div className="absolute right-4 bottom-28 flex flex-col gap-4">
          <button
            onClick={() => onLike(post.id)}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
                post.isLiked
                  ? "bg-red-500/80 text-white"
                  : "bg-black/40 text-white border border-white/10 hover:bg-black/60"
              )}
            >
              <Heart className={cn("w-6 h-6", post.isLiked && "fill-current")} />
            </div>
            <span className="text-xs font-medium text-white/80">
              {post.likes + (post.isLiked ? 1 : 0)}
            </span>
          </button>

          <button
            onClick={() => onComment(post.id)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-all">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white/80">{post.comments}</span>
          </button>

          <button
            onClick={() => onShare(post.id)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-all">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white/80">Share</span>
          </button>
        </div>

        {/* Text Overlay - Bottom Left */}
        <div className="absolute bottom-4 left-4 right-20 space-y-3">
          <h3 className="text-xl font-bold text-white leading-tight">
            {post.title}
          </h3>

          <div className="flex items-center gap-2">
            <img
              src={post.userAvatar}
              alt={post.userName}
              className="w-8 h-8 rounded-full ring-2 ring-white/20"
            />
            <span className="text-sm font-medium text-white/70">@{post.userName}</span>
          </div>

          <p className="text-sm text-white/60 line-clamp-2">{post.caption}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
