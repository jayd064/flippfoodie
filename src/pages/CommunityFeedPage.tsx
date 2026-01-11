import { useState, useMemo } from "react";
import BrandSubsHeader from "@/components/community/BrandSubsHeader";
import TrendingTribes from "@/components/community/TrendingTribes";
import BrandDirectory from "@/components/community/BrandDirectory";
import FeedCard from "@/components/community/FeedCard";
import CommentDrawer from "@/components/community/CommentDrawer";
import CreatePostFAB from "@/components/community/CreatePostFAB";
import NewPostDrawer from "@/components/community/NewPostDrawer";
import { usePosts } from "@/contexts/PostContext";

const CommunityFeedPage = () => {
  const [activeTab, setActiveTab] = useState<"brands" | "feed">("brands");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showNewPostDrawer, setShowNewPostDrawer] = useState(false);
  const [joinedBrands, setJoinedBrands] = useState<string[]>(["amul", "nestle"]);
  
  const { posts, toggleLike, addComment, voteComment, searchPosts } = usePosts();

  // Filter posts based on search
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    return searchPosts(searchQuery);
  }, [posts, searchQuery, searchPosts]);

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
