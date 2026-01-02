import { useState, useMemo } from "react";
import SubsHeader from "@/components/community/SubsHeader";
import FeedCard from "@/components/community/FeedCard";
import CommentDrawer from "@/components/community/CommentDrawer";
import MyStashGrid from "@/components/community/MyStashGrid";
import CreatePostFAB from "@/components/community/CreatePostFAB";
import NewPostDrawer from "@/components/community/NewPostDrawer";
import { usePosts } from "@/contexts/PostContext";

const CommunityFeedPage = () => {
  const [activeTab, setActiveTab] = useState<"discover" | "stash">("discover");
  const [activeTribe, setActiveTribe] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showNewPostDrawer, setShowNewPostDrawer] = useState(false);
  
  const { posts, toggleLike, addComment, voteComment, searchPosts, filterByTribe } = usePosts();
  
  const [brands, setBrands] = useState([
    { id: "1", name: "Amul", logo: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop", followerCount: 12400, isFollowing: true },
    { id: "2", name: "Nestle", logo: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop", followerCount: 8900, isFollowing: true },
    { id: "3", name: "Parle", logo: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop", followerCount: 6700, isFollowing: true },
    { id: "4", name: "Britannia", logo: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop", followerCount: 5400, isFollowing: true },
    { id: "5", name: "Haldiram's", logo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop", followerCount: 4200, isFollowing: true },
    { id: "6", name: "MTR", logo: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop", followerCount: 3100, isFollowing: true },
  ]);

  // Filter posts based on search and tribe
  const filteredPosts = useMemo(() => {
    let result = posts;
    
    if (searchQuery.trim()) {
      result = searchPosts(searchQuery);
    }
    
    if (activeTribe) {
      result = result.filter((post) => post.tribes?.includes(activeTribe));
    }
    
    return result;
  }, [posts, searchQuery, activeTribe, searchPosts]);

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

  const handleToggleFollow = (id: string) => {
    setBrands((prev) =>
      prev.map((brand) =>
        brand.id === id ? { ...brand, isFollowing: !brand.isFollowing } : brand
      )
    );
  };

  const selectedPost = posts.find((p) => p.id === selectedPostId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      <SubsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeTribe={activeTribe}
        onTribeChange={setActiveTribe}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {activeTab === "discover" ? (
        <div className="px-4 pt-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <FeedCard
                key={post.id}
                post={{
                  ...post,
                  comments: post.comments.length,
                }}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-500">No posts found</p>
            </div>
          )}
        </div>
      ) : (
        <MyStashGrid brands={brands} onToggleFollow={handleToggleFollow} />
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
