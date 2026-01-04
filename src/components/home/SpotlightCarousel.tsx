import { useState, useEffect } from "react";
import { ChevronRight, Flame, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SpotlightPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  upvotes: number;
  comments_count: number;
}

export const SpotlightCarousel = () => {
  const [spotlightPosts, setSpotlightPosts] = useState<SpotlightPost[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpotlight = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, content, image_url, upvotes, comments_count")
        .eq("is_spotlight", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setSpotlightPosts(data);
      }
      setIsLoading(false);
    };

    fetchSpotlight();
  }, []);

  // Fallback static data if no posts from DB
  const fallbackItems = [
    {
      id: "fallback-1",
      title: "Is Brown Bread a Scam?",
      content: "The truth about whole wheat",
      image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      upvotes: 342,
      comments_count: 124,
    },
  ];

  const items = spotlightPosts.length > 0 ? spotlightPosts : fallbackItems;

  if (isLoading) {
    return (
      <div className="px-5">
        <div className="aspect-[16/10] rounded-2xl bg-card animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-[85%] snap-center first:ml-5 last:mr-5"
            onClick={() => setActiveIndex(index)}
          >
            <Link to={`/article/${item.id}`}>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl group">
                {/* Background Image */}
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1.5 bg-destructive/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Flame className="w-3.5 h-3.5 text-destructive-foreground" />
                    <span className="text-xs font-semibold text-destructive-foreground">
                      Hot Debate
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-1">{item.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white/50 text-xs">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{item.comments_count} comments</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                      <span>Read</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Indicators */}
      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {items.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
