import { ArrowUp, MessageCircle } from "lucide-react";

const discussions = [
  {
    id: 1,
    title: "Why does Maggi taste different now?",
    author: "FoodDetective",
    upvotes: 342,
    comments: 124,
    timeAgo: "2h",
  },
  {
    id: 2,
    title: "Amul vs Mother Dairy: The ultimate comparison",
    author: "DairyExpert",
    upvotes: 256,
    comments: 89,
    timeAgo: "5h",
  },
  {
    id: 3,
    title: "Hidden sugars in 'healthy' breakfast cereals",
    author: "NutritionNinja",
    upvotes: 189,
    comments: 67,
    timeAgo: "8h",
  },
  {
    id: 4,
    title: "Are imported snacks really better?",
    author: "SnackReviewer",
    upvotes: 145,
    comments: 43,
    timeAgo: "12h",
  },
];

export const TrendingDiscussions = () => {
  return (
    <div className="px-5">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Trending Discussions
      </h2>
      <div className="space-y-3">
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="bg-card rounded-xl p-4 shadow-xl"
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
          </div>
        ))}
      </div>
    </div>
  );
};
