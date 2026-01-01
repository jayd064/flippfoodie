import { useState } from "react";
import { Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanPost {
  id: string;
  productName: string;
  productImage: string;
  healthScore: number;
  userName: string;
  userAvatar: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

const mockPosts: ScanPost[] = [
  {
    id: "1",
    productName: "Lay's Classic Chips",
    productImage: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop",
    healthScore: 35,
    userName: "Jayesh_Foodie",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jayesh",
    likes: 234,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    productName: "Oreo Cookies",
    productImage: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    healthScore: 28,
    userName: "HealthyBites",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=healthy",
    likes: 567,
    isLiked: true,
    isSaved: false,
  },
  {
    id: "3",
    productName: "Greek Yogurt",
    productImage: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    healthScore: 82,
    userName: "FitFoodie",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fit",
    likes: 892,
    isLiked: false,
    isSaved: true,
  },
  {
    id: "4",
    productName: "Doritos Nacho Cheese",
    productImage: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=400&h=400&fit=crop",
    healthScore: 22,
    userName: "SnackHunter",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=snack",
    likes: 1203,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "5",
    productName: "Almonds Raw",
    productImage: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&h=400&fit=crop",
    healthScore: 91,
    userName: "NutriNinja",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nutri",
    likes: 445,
    isLiked: true,
    isSaved: true,
  },
];

const getScoreColor = (score: number) => {
  if (score >= 70) return "from-emerald-500 to-green-400";
  if (score >= 40) return "from-amber-500 to-yellow-400";
  return "from-red-500 to-orange-400";
};

const getScoreEmoji = (score: number) => {
  if (score >= 70) return "🐐";
  if (score >= 40) return "😐";
  return "🤨";
};

const ScanCard = ({ post, onLike, onSave }: { 
  post: ScanPost; 
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}) => {
  return (
    <div className="relative w-full h-[calc(100vh-180px)] min-h-[500px] snap-start flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
      {/* Score Badge */}
      <div className={cn(
        "absolute top-6 right-6 z-20 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl bg-gradient-to-br shadow-2xl",
        getScoreColor(post.healthScore)
      )}>
        <span className="text-3xl font-black text-white drop-shadow-lg">
          {post.healthScore}
        </span>
        <span className="text-lg">{getScoreEmoji(post.healthScore)}</span>
      </div>

      {/* Product Image */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20">
        <img 
          src={post.productImage} 
          alt={post.productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Name */}
      <div className="absolute bottom-32 left-6 right-20">
        <h2 className="text-xl font-bold text-foreground drop-shadow-lg">
          {post.productName}
        </h2>
      </div>

      {/* User Info */}
      <div className="absolute bottom-20 left-6 flex items-center gap-3">
        <img 
          src={post.userAvatar} 
          alt={post.userName}
          className="w-10 h-10 rounded-full ring-2 ring-primary/50"
        />
        <span className="text-sm font-semibold text-foreground/80">
          @{post.userName}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-20 right-6 flex flex-col gap-4">
        <button 
          onClick={() => onLike(post.id)}
          className="flex flex-col items-center gap-1 transition-transform active:scale-90"
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            post.isLiked 
              ? "bg-red-500 text-white" 
              : "bg-muted/80 text-foreground hover:bg-muted"
          )}>
            <Heart className={cn("w-6 h-6", post.isLiked && "fill-current")} />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {post.likes + (post.isLiked ? 1 : 0)}
          </span>
        </button>

        <button 
          onClick={() => onSave(post.id)}
          className="flex flex-col items-center gap-1 transition-transform active:scale-90"
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
            post.isSaved 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted/80 text-foreground hover:bg-muted"
          )}>
            <Bookmark className={cn("w-6 h-6", post.isSaved && "fill-current")} />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Save</span>
        </button>
      </div>
    </div>
  );
};

const CommunityFeedPage = () => {
  const [posts, setPosts] = useState<ScanPost[]>(mockPosts);

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, isLiked: !post.isLiked } : post
    ));
  };

  const handleSave = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, isSaved: !post.isSaved } : post
    ));
  };

  return (
    <div className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
        <h1 className="text-xl font-bold text-center">Community Feed</h1>
      </div>

      {/* Feed */}
      <div className="flex flex-col">
        {posts.map((post) => (
          <ScanCard 
            key={post.id} 
            post={post} 
            onLike={handleLike}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunityFeedPage;
