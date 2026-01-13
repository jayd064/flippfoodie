import { useState, useMemo } from "react";
import BrandSubsHeader from "@/components/community/BrandSubsHeader";
import TrendingTribes from "@/components/community/TrendingTribes";
import BrandDirectory from "@/components/community/BrandDirectory";
import CinematicFeedCard from "@/components/community/CinematicFeedCard";
import CinematicFeedHeader from "@/components/community/CinematicFeedHeader";
import CommentDrawer from "@/components/community/CommentDrawer";
import CreatePostFAB from "@/components/community/CreatePostFAB";
import NewPostDrawer from "@/components/community/NewPostDrawer";
import { usePosts } from "@/contexts/PostContext";

const CommunityFeedPage = () => {
  const [activeTab, setActiveTab] = useState<"feed" | "tribes">("feed");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showNewPostDrawer, setShowNewPostDrawer] = useState(false);
  const [joinedBrands, setJoinedBrands] = useState<string[]>(["amul", "nestle"]);
  
  const { posts, toggleLike, addComment, voteComment, searchPosts } = usePosts();

  // Filter posts based on category for the cinematic feed
  const filteredPosts = useMemo(() => {
    if (!activeCategory) return posts;
    if (activeCategory === "hot") return posts.slice().sort((a, b) => b.likes - a.likes);
    if (activeCategory === "reviews") return posts.filter(p => p.flag === "review");
    if (activeCategory === "rants") return posts.filter(p => p.flag === "rant" || p.flag === "alert");
    return posts;
  }, [posts, activeCategory]);

  const handleLike = (id: string) => {
    toggleLike(id);
  };

  const handleComment = (id: string) => {
    setSelectedPostId(id);
  };

  const handleShare = (id: string) => {
    console.log("Share post:", id);
  };

  const handleVote = (commentId: string, vote: "up" | "down") => {
    if (selectedPostId) {
      voteComment(selectedPostId, commentId, vote);
    }
  };

  const handleAddComment = (text: string) => {
    if (selectedPostId && text.trim()) {
      addComment(selectedPostId, {
        userName: "You",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
        text: text.trim(),
      });
    }
  };

  const handleJoinBrand = (brandId: string) => {
    setJoinedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleTribeClick = (tribeId: string) => {
    console.log("Navigate to tribe:", tribeId);
    // Could navigate to a tribe detail page or filter feed
  };

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      {activeTab === "feed" ? (
        <>
          {/* Cinematic Full-Screen Feed */}
          <div className="relative">
            {/* Floating Header */}
            <CinematicFeedHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Vertical Snap Scroll Feed */}
            <div className="snap-y snap-mandatory overflow-y-auto h-[calc(100vh-100px)]">
              {filteredPosts.map((post) => (
                <CinematicFeedCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Tribes View with Header */}
          <div className="sticky top-0 z-50 pt-4 pb-3 px-4 bg-[#0a0a0a]/95 backdrop-blur-md">
            {/* Segmented Control */}
            <div className="flex justify-center mb-4">
              <div className="flex bg-[#151515] rounded-full p-1 border border-white/10">
                <button
                  onClick={() => setActiveTab("feed")}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab !== "tribes"
                      ? "bg-white text-black shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Discover
                </button>
                <button
                  onClick={() => setActiveTab("tribes")}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === "tribes"
                      ? "bg-white text-black shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Tribes
                </button>
              </div>
            </div>
          </div>

          <BrandSubsHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Trending Tribes Carousel */}
          <TrendingTribes onTribeClick={handleTribeClick} />

          {/* Brand Directory Grid */}
          <BrandDirectory
            searchQuery={searchQuery}
            activeCategory={activeCategory}
            onJoin={handleJoinBrand}
            joinedBrands={joinedBrands}
          />
        </>
      )}

      <CreatePostFAB onClick={() => setShowNewPostDrawer(true)} />

      <NewPostDrawer
        isOpen={showNewPostDrawer}
        onClose={() => setShowNewPostDrawer(false)}
      />

      <CommentDrawer
        isOpen={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
        postTitle={selectedPost?.title || ""}
        comments={selectedPost?.comments || []}
        onVote={handleVote}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default CommunityFeedPage;
