import { ArrowUp, MessageCircle } from "lucide-react";
import { usePosts } from "@/contexts/PostContext";
import { Link } from "react-router-dom";
import { useMemo } from "react";

export const TrendingDiscussions = () => {
  const { posts } = usePosts();
  
  // Get top 4 most-commented posts for trending
  const trendingPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 4)
      .map((post) => ({
        id: post.id,
        title: post.title,
        author: post.userName,
        upvotes: post.likes,
        comments: post.comments.length,
        timeAgo: getTimeAgo(post.createdAt),
      }));
  }, [posts]);

  function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    if (diffMins > 0) return `${diffMins}m`;
    return "now";
  }

  // Fallback static data if no posts
  const fallbackDiscussions = [
    {
      id: "fallback-1",
      title: "Why does Maggi taste different now?",
      author: "FoodDetective",
      upvotes: 342,
      comments: 124,
      timeAgo: "2h",
    },
    {
      id: "fallback-2",
      title: "Amul vs Mother Dairy: The ultimate comparison",
      author: "DairyExpert",
      upvotes: 256,
      comments: 89,
      timeAgo: "5h",
    },
    {
      id: "fallback-3",
      title: "Hidden sugars in 'healthy' breakfast cereals",
      author: "NutritionNinja",
      upvotes: 189,
      comments: 67,
      timeAgo: "8h",
    },
  ];

  const discussions = trendingPosts.length > 0 ? trendingPosts : fallbackDiscussions;

  return (
    <div className="px-5">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Trending Discussions
      </h2>
      <div className="space-y-3">
        {discussions.map((discussion) => (
          <Link
            to="/feed"
            key={discussion.id}
            className="block bg-card rounded-xl p-4 shadow-xl hover:bg-card/80 transition-colors"
          >
            <h3 className="text-sm font-medium text-foreground mb-2 leading-snug">
              {discussion.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-muted-foreground text-xs">
                <span>@{discussion.author}</span>
                <span>•</span>
                <span>{discussion.timeAgo}</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-xs font-medium">{discussion.upvotes}</span>
                </button>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{discussion.comments}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
