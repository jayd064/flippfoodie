import { useState } from "react";
import { Sparkles, ChevronDown, ImagePlus, Send } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { usePosts } from "@/contexts/PostContext";
import { cn } from "@/lib/utils";

interface NewPostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const flagOptions = [
  { id: "review", label: "Review", emoji: "⭐" },
  { id: "alert", label: "Health Alert", emoji: "⚠️" },
  { id: "rant", label: "Rant", emoji: "😤" },
  { id: "question", label: "Question", emoji: "❓" },
  { id: "safe", label: "Approved", emoji: "✅" },
] as const;

const NewPostDrawer = ({ isOpen, onClose }: NewPostDrawerProps) => {
  const { tribes, addTribe, addPost } = usePosts();
  const [showCommunitySelector, setShowCommunitySelector] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("t/General");
  const [isCreatingTribe, setIsCreatingTribe] = useState(false);
  const [newTribeName, setNewTribeName] = useState("");
  const [newTribeEmoji, setNewTribeEmoji] = useState("🌟");
  const [selectedFlag, setSelectedFlag] = useState<typeof flagOptions[number]["id"]>("review");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  const handleSelectCommunity = (community: string) => {
    setSelectedCommunity(community);
    setShowCommunitySelector(false);
    setIsCreatingTribe(false);
  };

  const handleCreateTribe = () => {
    if (!newTribeName.trim()) return;
    
    addTribe({
      name: newTribeName.trim(),
      emoji: newTribeEmoji,
    });
    
    setSelectedCommunity(`t/${newTribeName.trim()}`);
    setIsCreatingTribe(false);
    setShowCommunitySelector(false);
    setNewTribeName("");
    setNewTribeEmoji("🌟");
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    const flag = flagOptions.find((f) => f.id === selectedFlag)!;
    
    addPost({
      type: "manual",
      community: selectedCommunity,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=750&fit=crop",
      flag: selectedFlag,
      flagLabel: flag.label,
      title: title.trim(),
      caption: caption.trim() || "Check out this post!",
      userName: "You",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
      likes: 0,
      comments: [],
      isLiked: false,
      tribes: [],
    });
    
    // Reset form
    setTitle("");
    setCaption("");
    setSelectedFlag("review");
    setSelectedCommunity("t/General");
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-[#0a0a0a] backdrop-blur-xl border-t border-white/10 max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center text-lg font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Create Post
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-6 pb-8 space-y-5 overflow-y-auto">
          {/* Community Selector */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Tribe</label>
            <button
              onClick={() => setShowCommunitySelector(!showCommunitySelector)}
              className="w-full flex items-center justify-between p-4 bg-[#151515] border border-white/10 rounded-xl text-white hover:border-white/20 transition-colors"
            >
              <span>{selectedCommunity}</span>
              <ChevronDown className={cn(
                "w-5 h-5 text-zinc-500 transition-transform",
                showCommunitySelector && "rotate-180"
              )} />
            </button>
            
            {showCommunitySelector && (
              <div className="bg-[#151515] border border-white/10 rounded-xl overflow-hidden">
                {/* Existing Communities */}
                <div className="max-h-48 overflow-y-auto">
                  <button
                    onClick={() => handleSelectCommunity("t/General")}
                    className="w-full p-3 text-left text-white hover:bg-white/5 transition-colors"
                  >
                    t/General
                  </button>
                  <button
                    onClick={() => handleSelectCommunity("t/Scans")}
                    className="w-full p-3 text-left text-white hover:bg-white/5 transition-colors"
                  >
                    t/Scans
                  </button>
                  {tribes.map((tribe) => (
                    <button
                      key={tribe.id}
                      onClick={() => handleSelectCommunity(`t/${tribe.name}`)}
                      className="w-full p-3 text-left text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <span>{tribe.emoji}</span>
                      <span>t/{tribe.name}</span>
                    </button>
                  ))}
                </div>
                
                {/* Create New Tribe Option */}
                <div className="border-t border-white/10">
                  {!isCreatingTribe ? (
                    <button
                      onClick={() => setIsCreatingTribe(true)}
                      className="w-full p-3 text-left text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      ✨ Create New Tribe...
                    </button>
                  ) : (
                    <div className="p-3 space-y-3">
                      <div className="flex gap-2">
                        <input
                          value={newTribeEmoji}
                          onChange={(e) => setNewTribeEmoji(e.target.value)}
                          className="w-12 h-10 text-center bg-[#1a1a1a] border border-white/10 rounded-lg text-xl focus:outline-none focus:border-emerald-500/50"
                          placeholder="🌟"
                        />
                        <input
                          value={newTribeName}
                          onChange={(e) => setNewTribeName(e.target.value)}
                          placeholder="Tribe name (e.g., SpicyLovers)"
                          className="flex-1 h-10 px-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsCreatingTribe(false)}
                          className="flex-1 py-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateTribe}
                          disabled={!newTribeName.trim()}
                          className="flex-1 py-2 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Flag Selector */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Post Type <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-2">
              {flagOptions.map((flag) => (
                <button
                  key={flag.id}
                  onClick={() => setSelectedFlag(flag.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all text-sm",
                    selectedFlag === flag.id
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                      : "bg-[#151515] border-white/10 text-zinc-400 hover:border-white/20"
                  )}
                >
                  <span>{flag.emoji}</span>
                  <span>{flag.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Title <span className="text-red-400">*</span></label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's this about?"
              className="w-full h-12 px-4 bg-[#151515] border border-white/10 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Description</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share more details..."
              className="w-full h-24 p-4 bg-[#151515] border border-white/10 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
            />
          </div>

          {/* Image Upload Placeholder */}
          <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/10 rounded-xl text-zinc-500 hover:border-white/20 hover:text-zinc-400 transition-colors">
            <ImagePlus className="w-5 h-5" />
            <span>Add Image (coming soon)</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: title.trim() ? "0 0 30px rgba(16,185,129,0.4)" : undefined,
            }}
          >
            <Send className="w-5 h-5" />
            Post
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewPostDrawer;
