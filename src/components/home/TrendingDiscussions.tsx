import { ArrowUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TrendingPost {
  id: string;
  title: string;
  author_name: string;
  upvotes: number;
  comments_count: number;
  created_at: string;
}

export const TrendingDiscussions = () => {
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, author_name, upvotes, comments_count, created_at")
        .eq("is_spotlight", false)
        .order("upvotes", { ascending: false })
        .limit(4);

      if (!error && data) {
        setTrendingPosts(data);
      }
      setIsLoading(false);
    };

    fetchTrending();
  }, []);

  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    if (diffMins > 0) return `${diffMins}m`;
    return "now";
  }

  // Fallback static data if no posts from DB
  const fallbackDiscussions = [
    {
      id: "fallback-1",
      title: "Why does Maggi taste different now?",
      author_name: "FoodDetective",
      upvotes: 342,
      comments_count: 124,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "fallback-2",
      title: "Amul vs Mother Dairy: The ultimate comparison",
      author_name: "DairyExpert",
      upvotes: 256,
      comments_count: 89,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const discussions = trendingPosts.length > 0 ? trendingPosts : fallbackDiscussions;

  if (isLoading) {
    return (
      <div className="px-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Trending Discussions
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Trending Discussions
      </h2>
      <div className="space-y-3">
        {discussions.map((discussion) => (
          <Link
            to={`/article/${discussion.id}`}
            key={discussion.id}
            className="block bg-card rounded-xl p-4 shadow-xl hover:bg-card/80 transition-colors"
          >
            <h3 className="text-sm font-medium text-foreground mb-2 leading-snug">
              {discussion.title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-muted-foreground text-xs">
                <span>@{discussion.author_name}</span>
                <span>•</span>
                <span>{getTimeAgo(discussion.created_at)}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-primary">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-xs font-medium">{discussion.upvotes}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{discussion.comments_count}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
