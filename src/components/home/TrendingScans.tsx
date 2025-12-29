import { ChevronRight } from "lucide-react";

const trendingProducts = [
  {
    id: 1,
    name: "Lay's Classic",
    score: 28,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "Oreo Cookies",
    score: 22,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "Digestive Biscuits",
    score: 45,
    image: "https://images.unsplash.com/photo-1499636136210-6598f4a9a2e0?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "Pringles",
    score: 31,
    image: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200&h=200&fit=crop",
  },
];

const getScoreColor = (score: number) => {
  if (score >= 60) return "text-score-good bg-score-good/10 border-score-good/30";
  if (score >= 40) return "text-score-medium bg-score-medium/10 border-score-medium/30";
  return "text-score-bad bg-score-bad/10 border-score-bad/30";
};

export const TrendingScans = () => {
  return (
    <section className="mt-10 animate-fade-up animation-delay-200">
      <div className="flex items-center justify-between px-5 mb-4">
        <h2 className="text-lg font-semibold text-foreground">Trending Scans</h2>
        <button className="flex items-center gap-1 text-sm text-primary font-medium hover:opacity-80 transition-opacity">
          See all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide">
        {trendingProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-32 animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-card shadow-soft border border-border/50 hover:shadow-card transition-shadow duration-300">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-28 object-cover"
              />
              <div className="p-3">
                <p className="text-sm font-medium text-foreground truncate">
                  {product.name}
                </p>
                <div className={`mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(product.score)}`}>
                  {product.score}/100
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
