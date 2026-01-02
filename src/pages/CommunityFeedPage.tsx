import { useState } from "react";
import SubsHeader from "@/components/community/SubsHeader";
import FeedCard from "@/components/community/FeedCard";
import CommentDrawer from "@/components/community/CommentDrawer";
import MyStashGrid from "@/components/community/MyStashGrid";

interface Post {
  id: string;
  image: string;
  flag: "alert" | "review" | "safe";
  flagLabel: string;
  title: string;
  caption: string;
  userName: string;
  userAvatar: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const mockPosts: Post[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&h=750&fit=crop",
    flag: "alert",
    flagLabel: "Health Alert",
    title: "Lay's Magic Masala: What They Don't Tell You",
    caption: "High sodium content and MSG—this snack might taste great but here's why you should limit your intake. Breaking down the ingredients...",
    userName: "HealthHunter",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=health",
    likes: 2340,
    comments: 156,
    isLiked: false,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&h=750&fit=crop",
    flag: "review",
    flagLabel: "Review",
    title: "Amul Butter vs Store Brands: The Truth",
    caption: "I tested 5 different butter brands for taste, texture, and nutritional value. The results might surprise you!",
    userName: "FoodScience",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=food",
    likes: 4521,
    comments: 342,
    isLiked: true,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=750&fit=crop",
    flag: "safe",
    flagLabel: "Approved",
    title: "Greek Yogurt: The Perfect Protein Source",
    caption: "High protein, low sugar, and great for gut health. Here's why this should be in your daily diet!",
    userName: "NutriNinja",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nutri",
    likes: 1892,
    comments: 89,
    isLiked: false,
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=600&h=750&fit=crop",
    flag: "alert",
    flagLabel: "Health Alert",
    title: "Why Your Favorite Chips Are Addictive",
    caption: "The science behind why you can't stop at just one. Understanding the flavor engineering in processed snacks.",
    userName: "SnackScience",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=snack",
    likes: 3456,
    comments: 267,
    isLiked: false,
  },
];

const mockComments = [
  {
    id: "c1",
    userName: "HealthyEater",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=c1",
    text: "This is so eye-opening! I had no idea about the sodium levels. Going to check all my snacks now.",
    votes: 45,
    userVote: null as "up" | "down" | null,
    timeAgo: "2h",
    replies: [
      {
        id: "c1r1",
        userName: "NutriExpert",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=c1r1",
        text: "The daily recommended sodium is about 2300mg. One serving of these chips has 170mg!",
        votes: 23,
        userVote: null as "up" | "down" | null,
        timeAgo: "1h",
      },
    ],
  },
  {
    id: "c2",
    userName: "SkepticalSam",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=c2",
    text: "I mean, everything in moderation right? Not everything needs to be a 'health alert'.",
    votes: 12,
    userVote: null as "up" | "down" | null,
    timeAgo: "3h",
    replies: [
      {
        id: "c2r1",
        userName: "BalancedView",
        userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=c2r1",
        text: "That's fair, but awareness helps people make informed choices. Knowledge is power!",
        votes: 8,
        userVote: null as "up" | "down" | null,
        timeAgo: "2h",
      },
    ],
  },
  {
    id: "c3",
    userName: "ChipLover",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=c3",
    text: "Any good alternatives that taste similar but are healthier?",
    votes: 67,
    userVote: "up" as "up" | "down" | null,
    timeAgo: "4h",
  },
];

const CommunityFeedPage = () => {
  const [activeTab, setActiveTab] = useState<"discover" | "stash">("discover");
  const [activeTribe, setActiveTribe] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState(mockComments);
  const [brands, setBrands] = useState([
    { id: "1", name: "Amul", logo: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop", followerCount: 12400, isFollowing: true },
    { id: "2", name: "Nestle", logo: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop", followerCount: 8900, isFollowing: true },
    { id: "3", name: "Parle", logo: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop", followerCount: 6700, isFollowing: true },
    { id: "4", name: "Britannia", logo: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop", followerCount: 5400, isFollowing: true },
    { id: "5", name: "Haldiram's", logo: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop", followerCount: 4200, isFollowing: true },
    { id: "6", name: "MTR", logo: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&h=200&fit=crop", followerCount: 3100, isFollowing: true },
  ]);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isLiked: !post.isLiked } : post
      )
    );
  };

  const handleComment = (id: string) => {
    setSelectedPostId(id);
  };

  const handleShare = (id: string) => {
    // Share logic
    console.log("Share post:", id);
  };

  const handleVote = (commentId: string, vote: "up" | "down") => {
    const updateVotes = (commentsList: typeof comments): typeof comments => {
      return commentsList.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            userVote: c.userVote === vote ? null : vote,
          };
        }
        if (c.replies) {
          return { ...c, replies: updateVotes(c.replies) };
        }
        return c;
      });
    };
    setComments(updateVotes(comments));
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
      />

      {activeTab === "discover" ? (
        <div className="px-4 pt-4">
          {posts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <MyStashGrid brands={brands} onToggleFollow={handleToggleFollow} />
      )}

      <CommentDrawer
        isOpen={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
        postTitle={selectedPost?.title || ""}
        comments={comments}
        onVote={handleVote}
      />
    </div>
  );
};

export default CommunityFeedPage;
