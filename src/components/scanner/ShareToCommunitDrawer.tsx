import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Sparkles, ImageIcon } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { usePosts } from "@/contexts/PostContext";
import { ViralRoastCard } from "./ViralRoastCard";

interface ShareToCommunityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    brand?: string;
    image?: string;
    score: number;
    negativePoints?: string[];
    positivePoints?: string[];
  };
}

const flagOptions = [
  { id: "alert", label: "Health Alert", emoji: "⚠️" },
  { id: "review", label: "Review", emoji: "⭐" },
  { id: "rant", label: "Rant", emoji: "😤" },
  { id: "question", label: "Question", emoji: "❓" },
] as const;

export const ShareToCommunityDrawer = ({
  isOpen,
  onClose,
  product,
}: ShareToCommunityDrawerProps) => {
  const [caption, setCaption] = useState("");
  const [selectedFlag, setSelectedFlag] = useState<typeof flagOptions[number]["id"]>(
    product.score < 40 ? "alert" : "review"
  );
  const [showRoastCard, setShowRoastCard] = useState(false);
  const { addPost } = usePosts();
  const navigate = useNavigate();

  const handleShare = () => {
    const flag = flagOptions.find((f) => f.id === selectedFlag)!;
    
    addPost({
      type: "scan",
      community: "r/Scans",
      image: product.image || "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&h=750&fit=crop",
      flag: selectedFlag,
      flagLabel: flag.label,
      title: `${product.name}${product.brand ? ` by ${product.brand}` : ""} - Score: ${product.score}`,
      caption: caption || `Just scanned this product and got a ${product.score} score!`,
      userName: "You",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      likes: 0,
      comments: [],
      isLiked: false,
      score: product.score,
      negativePoints: product.negativePoints,
      positivePoints: product.positivePoints,
      tribes: product.score < 40 ? ["junk"] : ["organic"],
    });

    onClose();
    navigate("/feed");
  };

  const handleOpenRoastCard = () => {
    onClose(); // Close the drawer first
    setTimeout(() => setShowRoastCard(true), 300); // Open roast card after drawer closes
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="bg-[#0a0a0a] backdrop-blur-xl border-t border-white/10">
          <DrawerHeader>
            <DrawerTitle className="text-center text-lg font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Share to Community
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-6 pb-8 space-y-5">
            {/* Product Preview */}
            <div className="flex items-center gap-4 p-4 bg-[#151515] rounded-2xl border border-white/5">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{product.name}</h3>
                {product.brand && (
                  <p className="text-sm text-zinc-500">{product.brand}</p>
                )}
                <div
                  className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    product.score < 40
                      ? "bg-red-500/20 text-red-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  Score: {product.score}
                </div>
              </div>
            </div>

            {/* Viral Roast Card Button - NEW */}
            <button
              onClick={handleOpenRoastCard}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-400 hover:to-pink-400 transition-all"
              style={{
                boxShadow: "0 0 30px rgba(168,85,247,0.4)",
              }}
            >
              <ImageIcon className="w-5 h-5" />
              Create Viral Roast Card
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">🔥 Story Ready</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-zinc-500">or post to feed</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Flag Selector */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Post Type</label>
              <div className="grid grid-cols-2 gap-2">
                {flagOptions.map((flag) => (
                  <button
                    key={flag.id}
                    onClick={() => setSelectedFlag(flag.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                      selectedFlag === flag.id
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                        : "bg-[#151515] border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <span>{flag.emoji}</span>
                    <span className="text-sm font-medium">{flag.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Caption Input */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Add a caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="I can't believe this has so much sugar!"
                className="w-full h-24 p-4 bg-[#151515] border border-white/10 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
              />
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all"
              style={{
                boxShadow: "0 0 30px rgba(16,185,129,0.4)",
              }}
            >
              <Share2 className="w-5 h-5" />
              Post to Community Feed
            </button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Viral Roast Card Modal */}
      <ViralRoastCard
        isOpen={showRoastCard}
        onClose={() => setShowRoastCard(false)}
        product={product}
      />
    </>
  );
};
